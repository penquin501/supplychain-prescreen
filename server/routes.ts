import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSupplierSchema, insertFinancialDataSchema, insertTransactionSchema, insertDocumentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Suppliers
  app.get("/api/suppliers", async (req, res) => {
    try {
      const suppliers = await storage.getSuppliers();
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch suppliers" });
    }
  });

  app.get("/api/suppliers/:id", async (req, res) => {
    try {
      const supplier = await storage.getSupplier(req.params.id);
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.json(supplier);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch supplier" });
    }
  });

  app.post("/api/suppliers", async (req, res) => {
    try {
      const validatedData = insertSupplierSchema.parse(req.body);
      const supplier = await storage.createSupplier(validatedData);
      res.status(201).json(supplier);
    } catch (error) {
      res.status(400).json({ message: "Invalid supplier data" });
    }
  });

  // Financial Data
  app.get("/api/suppliers/:id/financial-data", async (req, res) => {
    try {
      const financialData = await storage.getFinancialData(req.params.id);
      res.json(financialData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch financial data" });
    }
  });

  app.post("/api/suppliers/:id/financial-data", async (req, res) => {
    try {
      const validatedData = insertFinancialDataSchema.parse({
        ...req.body,
        supplierId: req.params.id
      });
      const financialData = await storage.createFinancialData(validatedData);
      res.status(201).json(financialData);
    } catch (error) {
      res.status(400).json({ message: "Invalid financial data" });
    }
  });

  // Transactions
  app.get("/api/suppliers/:id/transactions", async (req, res) => {
    try {
      const transactions = await storage.getTransactions(req.params.id);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post("/api/suppliers/:id/transactions", async (req, res) => {
    try {
      const validatedData = insertTransactionSchema.parse({
        ...req.body,
        supplierId: req.params.id
      });
      const transaction = await storage.createTransaction(validatedData);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({ message: "Invalid transaction data" });
    }
  });

  // Documents
  app.get("/api/suppliers/:id/documents", async (req, res) => {
    try {
      const documents = await storage.getDocuments(req.params.id);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.post("/api/suppliers/:id/documents", async (req, res) => {
    try {
      const validatedData = insertDocumentSchema.parse({
        ...req.body,
        supplierId: req.params.id
      });
      const document = await storage.createDocument(validatedData);
      res.status(201).json(document);
    } catch (error) {
      res.status(400).json({ message: "Invalid document data" });
    }
  });

  app.patch("/api/documents/:id", async (req, res) => {
    try {
      const document = await storage.updateDocument(req.params.id, req.body);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.json(document);
    } catch (error) {
      res.status(500).json({ message: "Failed to update document" });
    }
  });

  // Scores
  app.get("/api/suppliers/:id/score", async (req, res) => {
    try {
      const score = await storage.getScore(req.params.id);
      if (!score) {
        return res.status(404).json({ message: "Score not found" });
      }
      res.json(score);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch score" });
    }
  });

  app.post("/api/suppliers/:id/calculate-score", async (req, res) => {
    try {
      const supplierId = req.params.id;
      
      // Get all required data
      const supplier = await storage.getSupplier(supplierId);
      const financialData = await storage.getFinancialData(supplierId);
      const transactions = await storage.getTransactions(supplierId);
      const documents = await storage.getDocuments(supplierId);
      
      if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
      }

      // Calculate Financial Score
      const latestFinancial = financialData.sort((a, b) => b.year - a.year)[0];
      let financialScore = 0;
      let financialGrade = "F";

      if (latestFinancial) {
        const revenue = parseFloat(latestFinancial.salesRevenue);
        const deRatio = parseFloat(latestFinancial.totalDebt) / parseFloat(latestFinancial.totalEquity);
        const currentRatio = parseFloat(latestFinancial.currentAssets) / parseFloat(latestFinancial.currentLiabilities);
        const netIncome = parseFloat(latestFinancial.netIncome);
        const interestExpense = parseFloat(latestFinancial.interestExpense);
        const interestCoverage = interestExpense > 0 ? netIncome / interestExpense : 999;

        // Calculate score based on criteria
        let score = 0;
        if (supplier.registrationType === "PLC" || supplier.registrationType === "Ltd") score += 10;
        if (supplier.vatRegistered) score += 10;
        if (supplier.yearsOfOperation >= 2) score += 10;
        if (revenue > 30000000) score += 15; // > 30M THB
        if (netIncome > 0) score += 15; // Profitable
        if (deRatio <= 4) score += 15;
        if (currentRatio > 1) score += 15;
        if (interestCoverage > 1) score += 10;

        financialScore = Math.min(100, score);
        
        // Assign grade
        if (financialScore >= 95) financialGrade = "AAA";
        else if (financialScore >= 90) financialGrade = "AA";
        else if (financialScore >= 85) financialGrade = "A";
        else if (financialScore >= 80) financialGrade = "B+";
        else if (financialScore >= 75) financialGrade = "B";
        else if (financialScore >= 70) financialGrade = "C+";
        else if (financialScore >= 65) financialGrade = "C";
        else if (financialScore >= 60) financialGrade = "D+";
        else if (financialScore >= 60) financialGrade = "D";
        else financialGrade = "F";
      }

      // Calculate Transactional Score (simplified RFM)
      let transactionalScore = 50; // Base score
      if (transactions.length > 0) {
        const avgPaymentTerm = transactions.reduce((sum, t) => sum + t.poPaymentTerm, 0) / transactions.length;
        if (avgPaymentTerm <= 180) transactionalScore += 20;
        if (transactions.length >= 5) transactionalScore += 15;
        if (transactions.length >= 10) transactionalScore += 15;
      }

      // Calculate A-Score
      const submittedDocs = documents.filter(d => d.isSubmitted).length;
      const totalDocs = documents.length || 18;
      const aScore = Math.round((submittedDocs / totalDocs) * 100);

      // Calculate Overall Credit Score (simple average of all three scores)
      const overallScore = Math.round(
        (financialScore + transactionalScore + aScore) / 3
      );

      // Determine recommendation
      let recommendation = "rejected";
      if (aScore >= 80 && financialScore >= 70) recommendation = "approved";
      else if (aScore >= 31 && financialScore >= 60) recommendation = "pending";

      const scoreData = {
        supplierId,
        financialScore: financialScore.toString(),
        financialGrade,
        transactionalScore: transactionalScore.toString(),
        aScore: aScore.toString(),
        overallCreditScore: overallScore.toString(),
        recommendation,
        lastUpdated: new Date().toISOString().split('T')[0],
      };

      // Update or create score
      const existingScore = await storage.getScore(supplierId);
      let score;
      if (existingScore) {
        score = await storage.updateScore(supplierId, scoreData);
      } else {
        score = await storage.createScore(scoreData);
      }

      res.json(score);
    } catch (error) {
      res.status(500).json({ message: "Failed to calculate score" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
