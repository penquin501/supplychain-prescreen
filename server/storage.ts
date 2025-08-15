import { 
  type Supplier, 
  type InsertSupplier,
  type FinancialData,
  type InsertFinancialData,
  type Transaction,
  type InsertTransaction,
  type Document,
  type InsertDocument,
  type Score,
  type InsertScore,
  type PricingDecision,
  type InsertPricingDecision
} from "@shared/schema";
import { randomUUID } from "crypto";
import { getRandomDocumentSubmissions } from "../client/src/lib/randomData";

export interface IStorage {
  // Suppliers
  getSuppliers(): Promise<Supplier[]>;
  getSupplier(id: string): Promise<Supplier | undefined>;
  createSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: string, supplier: Partial<InsertSupplier>): Promise<Supplier | undefined>;
  
  // Financial Data
  getFinancialData(supplierId: string): Promise<FinancialData[]>;
  createFinancialData(data: InsertFinancialData): Promise<FinancialData>;
  
  // Transactions
  getTransactions(supplierId: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  // Documents
  getDocuments(supplierId: string): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: string, document: Partial<InsertDocument>): Promise<Document | undefined>;
  
  // Scores
  getScore(supplierId: string): Promise<Score | undefined>;
  createScore(score: InsertScore): Promise<Score>;
  updateScore(supplierId: string, score: Partial<InsertScore>): Promise<Score | undefined>;

  // Pricing Decisions (for machine learning)
  createPricingDecision(decision: InsertPricingDecision): Promise<PricingDecision>;
  getPricingDecisions(supplierId: string): Promise<PricingDecision[]>;
}

export class MemStorage implements IStorage {
  private suppliers: Map<string, Supplier> = new Map();
  private financialData: Map<string, FinancialData> = new Map();
  private transactions: Map<string, Transaction> = new Map();
  private documents: Map<string, Document> = new Map();
  private scores: Map<string, Score> = new Map();
  private pricingDecisions: Map<string, PricingDecision> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create sample suppliers
    const supplier1: Supplier = {
      id: "supplier-1",
      companyName: "ABC Manufacturing Co., Ltd.",
      taxId: "1234567890123",
      registrationType: "Ltd",
      vatRegistered: true,
      businessType: "Manufacturing",
      establishedDate: "2018-03-15",
      address: "123 Industrial Road, Bangkok 10400",
      contactPerson: "Mr. John Smith (CFO)",
      yearsOfOperation: 5,
      status: "approved",
      createdAt: "2023-01-15",
    };

    const supplier2: Supplier = {
      id: "supplier-2",
      companyName: "XYZ Trading Ltd.",
      taxId: "9876543210987",
      registrationType: "Ltd",
      vatRegistered: true,
      businessType: "Trading",
      establishedDate: "2019-06-20",
      address: "456 Business District, Bangkok 10110",
      contactPerson: "Ms. Jane Doe (Finance Manager)",
      yearsOfOperation: 4,
      status: "pending",
      createdAt: "2023-02-20",
    };

    const supplier3: Supplier = {
      id: "supplier-3",
      companyName: "DEF Logistics Co.",
      taxId: "5555666677778",
      registrationType: "Ltd",
      vatRegistered: false,
      businessType: "Logistics",
      establishedDate: "2021-01-10",
      address: "789 Transport Hub, Bangkok 10210",
      contactPerson: "Mr. Bob Wilson (CFO)",
      yearsOfOperation: 2,
      status: "rejected",
      createdAt: "2023-03-10",
    };

    const supplier4: Supplier = {
      id: "supplier-4",
      companyName: "Global Electronics PLC",
      taxId: "1111222233334",
      registrationType: "PLC",
      vatRegistered: true,
      businessType: "Electronics",
      establishedDate: "2015-09-12",
      address: "88 Technology Park, Bangkok 10250",
      contactPerson: "Dr. Sarah Chen (CEO)",
      yearsOfOperation: 8,
      status: "approved",
      createdAt: "2023-01-05",
    };

    const supplier5: Supplier = {
      id: "supplier-5",
      companyName: "Thai Fresh Foods Ltd.",
      taxId: "4444555566667",
      registrationType: "Ltd",
      vatRegistered: true,
      businessType: "Food Processing",
      establishedDate: "2020-02-28",
      address: "200 Food Valley, Chonburi 20230",
      contactPerson: "Mr. Somchai Tanaka (Operations Director)",
      yearsOfOperation: 3,
      status: "pending",
      createdAt: "2023-03-25",
    };

    const supplier6: Supplier = {
      id: "supplier-6",
      companyName: "Pacific Textiles Co.",
      taxId: "7777888899990",
      registrationType: "Ltd",
      vatRegistered: false,
      businessType: "Textiles",
      establishedDate: "2022-08-15",
      address: "55 Textile District, Nakhon Pathom 73000",
      contactPerson: "Ms. Maria Santos (Finance Head)",
      yearsOfOperation: 1,
      status: "rejected",
      createdAt: "2023-04-10",
    };

    const supplier7: Supplier = {
      id: "supplier-7",
      companyName: "Innovation Tech Solutions LP",
      taxId: "3333444455556",
      registrationType: "LP",
      vatRegistered: true,
      businessType: "Software Development",
      establishedDate: "2017-11-03",
      address: "42 Innovation Hub, Bangkok 10110",
      contactPerson: "Mr. Alex Johnson (CTO)",
      yearsOfOperation: 6,
      status: "approved",
      createdAt: "2023-02-12",
    };

    const supplier8: Supplier = {
      id: "supplier-8",
      companyName: "Green Energy Systems Ltd.",
      taxId: "6666777788889",
      registrationType: "Ltd",
      vatRegistered: true,
      businessType: "Renewable Energy",
      establishedDate: "2019-04-22",
      address: "150 Solar Park, Rayong 21000",
      contactPerson: "Dr. Michael Green (Engineering Director)",
      yearsOfOperation: 4,
      status: "pending",
      createdAt: "2023-03-08",
    };

    const suppliers = [supplier1, supplier2, supplier3, supplier4, supplier5, supplier6, supplier7, supplier8];
    suppliers.forEach(supplier => {
      this.suppliers.set(supplier.id, supplier);
    });

    // Create financial data for multiple suppliers (5 years each)
    const suppliersFinancialData = [
      {
        supplierId: supplier1.id,
        baseRevenue: [28500000, 32100000, 38700000, 42300000, 45200000], // Growing company
        profitMargin: 0.21
      },
      {
        supplierId: supplier2.id,
        baseRevenue: [18200000, 22800000, 26400000, 31200000, 35600000], // Steady growth
        profitMargin: 0.18
      },
      {
        supplierId: supplier3.id,
        baseRevenue: [12800000, 15200000, 14100000, 16800000, 18900000], // Volatile
        profitMargin: 0.12
      },
      {
        supplierId: supplier4.id,
        baseRevenue: [65200000, 71800000, 82300000, 94600000, 108400000], // Large established
        profitMargin: 0.25
      },
      {
        supplierId: supplier5.id,
        baseRevenue: [24600000, 28900000, 32100000, 35800000, 39200000], // Good growth
        profitMargin: 0.19
      },
      {
        supplierId: supplier6.id,
        baseRevenue: [8200000, 11600000, 14200000, 16800000, 19400000], // New but growing
        profitMargin: 0.14
      },
      {
        supplierId: supplier7.id,
        baseRevenue: [42800000, 48600000, 56200000, 64800000, 72400000], // Tech company
        profitMargin: 0.28
      },
      {
        supplierId: supplier8.id,
        baseRevenue: [31200000, 35800000, 41200000, 46800000, 52600000], // Energy sector
        profitMargin: 0.22
      }
    ];

    const years = [2019, 2020, 2021, 2022, 2023];
    
    suppliersFinancialData.forEach(supplierData => {
      years.forEach((year, index) => {
        const revenue = supplierData.baseRevenue[index];
        const cogs = Math.round(revenue * 0.62);
        const grossProfit = revenue - cogs;
        const netIncome = Math.round(grossProfit * supplierData.profitMargin);
        const totalAssets = Math.round(revenue * 1.6);
        const totalDebt = Math.round(totalAssets * 0.54);
        const totalEquity = totalAssets - totalDebt;
        const currentAssets = Math.round(totalAssets * 0.41);
        const currentLiabilities = Math.round(currentAssets * 0.56);
        
        const financialDataId = randomUUID();
        const data: FinancialData = {
          id: financialDataId,
          supplierId: supplierData.supplierId,
          year,
          salesRevenue: revenue.toString(),
          costOfGoodsSold: cogs.toString(),
          grossProfit: grossProfit.toString(),
          netIncome: netIncome.toString(),
          totalAssets: totalAssets.toString(),
          totalDebt: totalDebt.toString(),
          totalEquity: totalEquity.toString(),
          currentAssets: currentAssets.toString(),
          currentLiabilities: currentLiabilities.toString(),
          interestExpense: Math.round(totalDebt * 0.05).toString(),
        };
        this.financialData.set(financialDataId, data);
      });
    });

    // Create sample transactions for multiple suppliers
    const transactionData = [
      {
        supplierId: supplier1.id,
        buyers: ["Big Retail Corp", "Global Mall Chain", "Super Store Ltd"],
        transactionCount: 12,
        avgAmount: 850000,
        paymentTerms: [60, 90, 120]
      },
      {
        supplierId: supplier2.id,
        buyers: ["Fashion Forward Inc", "Style Central", "Trend Setters Ltd"],
        transactionCount: 8,
        avgAmount: 620000,
        paymentTerms: [45, 60, 90]
      },
      {
        supplierId: supplier4.id,
        buyers: ["Tech Giant Corp", "Innovation Labs", "Digital Solutions Inc"],
        transactionCount: 15,
        avgAmount: 1200000,
        paymentTerms: [30, 45, 60]
      },
      {
        supplierId: supplier7.id,
        buyers: ["StartUp Accelerator", "Enterprise Solutions", "Cloud Systems Ltd"],
        transactionCount: 10,
        avgAmount: 480000,
        paymentTerms: [30, 45, 75]
      },
      {
        supplierId: supplier8.id,
        buyers: ["Green Energy Corp", "Solar Power Ltd", "Renewable Systems"],
        transactionCount: 6,
        avgAmount: 950000,
        paymentTerms: [90, 120, 150]
      }
    ];

    transactionData.forEach(data => {
      for (let i = 0; i < data.transactionCount; i++) {
        const buyerIndex = i % data.buyers.length;
        const termIndex = i % data.paymentTerms.length;
        const amount = Math.round(data.avgAmount * (0.7 + Math.random() * 0.6));
        const vatAmount = Math.round(amount * 0.07);
        const netAmount = amount + vatAmount;
        
        const monthsAgo = Math.floor(Math.random() * 18);
        const baseDate = new Date();
        baseDate.setMonth(baseDate.getMonth() - monthsAgo);
        
        const poDate = baseDate.toISOString().split('T')[0];
        const shipDate = new Date(baseDate);
        shipDate.setDate(shipDate.getDate() + 15);
        const invoiceDate = new Date(shipDate);
        invoiceDate.setDate(invoiceDate.getDate() + 3);
        const paymentDate = new Date(invoiceDate);
        paymentDate.setDate(paymentDate.getDate() + data.paymentTerms[termIndex]);

        const transaction: Transaction = {
          id: randomUUID(),
          supplierId: data.supplierId,
          buyerName: data.buyers[buyerIndex],
          agreementNo: `AGR-2023-${String(i + 1).padStart(3, '0')}`,
          agreementStartDate: "2023-01-01",
          agreementEndDate: "2024-12-31",
          poNo: `PO-2023-${String(i + 1).padStart(4, '0')}`,
          poDate: poDate,
          poAmount: amount.toString(),
          poVatAmount: vatAmount.toString(),
          poNetAmount: netAmount.toString(),
          poShipmentDate: shipDate.toISOString().split('T')[0],
          poPaymentTerm: data.paymentTerms[termIndex],
          deliveryOrderNo: `DO-2023-${String(i + 1).padStart(4, '0')}`,
          deliveryDate: shipDate.toISOString().split('T')[0],
          deliveryAmount: amount.toString(),
          grNo: `GR-2023-${String(i + 1).padStart(4, '0')}`,
          grDate: new Date(shipDate.getTime() + 86400000).toISOString().split('T')[0],
          grAmount: amount.toString(),
          invoiceNo: `INV-2023-${String(i + 1).padStart(4, '0')}`,
          invoiceDate: invoiceDate.toISOString().split('T')[0],
          invoiceAmount: amount.toString(),
          invoiceVatAmount: vatAmount.toString(),
          invoiceNetAmount: netAmount.toString(),
          paymentDate: paymentDate.toISOString().split('T')[0],
          receiptNo: `REC-2023-${String(i + 1).padStart(4, '0')}`,
          receiptDate: paymentDate.toISOString().split('T')[0],
          receiptAmount: netAmount.toString(),
        };

        this.transactions.set(transaction.id, transaction);
      }
    });

    // Create random documents for all suppliers
    const allSuppliers = [supplier1, supplier2, supplier3, supplier4, supplier5, supplier6, supplier7, supplier8];
    
    allSuppliers.forEach(supplier => {
      const randomDocs = getRandomDocumentSubmissions(supplier.id);
      randomDocs.forEach(docData => {
        const docId = randomUUID();
        const submissionDate = docData.isSubmitted ? 
          new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : 
          null;
        
        const doc: Document = {
          id: docId,
          supplierId: supplier.id,
          documentType: docData.documentType,
          documentName: `${docData.documentType.replace(/\s+/g, '_').toLowerCase()}.pdf`,
          isSubmitted: docData.isSubmitted,
          submittedDate: submissionDate,
          isVerified: docData.isSubmitted,
          approvalStatus: docData.isSubmitted ? "approved" : "pending",
          reviewedBy: docData.isSubmitted ? "System" : null,
          reviewedDate: docData.isSubmitted ? submissionDate : null,
          fileUrl: docData.isSubmitted ? `/objects/uploads/${docId}` : null,
        };
        this.documents.set(docId, doc);
      });
    });

    // Create scores for all suppliers
    const supplierScores = [
      {
        supplierId: supplier1.id,
        financialScore: "85",
        financialGrade: "B+",
        transactionalScore: "82",
        aScore: "89", // 16/18 * 100
        overallCreditScore: "85", // (85+82+89)/3
        recommendation: "approved"
      },
      {
        supplierId: supplier2.id,
        financialScore: "72",
        financialGrade: "C+",
        transactionalScore: "68",
        aScore: "67", // 12/18 * 100
        overallCreditScore: "69", // (72+68+67)/3
        recommendation: "pending"
      },
      {
        supplierId: supplier3.id,
        financialScore: "58",
        financialGrade: "D",
        transactionalScore: "45",
        aScore: "33", // 6/18 * 100
        overallCreditScore: "45", // (58+45+33)/3
        recommendation: "rejected"
      },
      {
        supplierId: supplier4.id,
        financialScore: "95",
        financialGrade: "AA",
        transactionalScore: "88",
        aScore: "100", // 18/18 * 100
        overallCreditScore: "94", // (95+88+100)/3
        recommendation: "approved"
      },
      {
        supplierId: supplier5.id,
        financialScore: "76",
        financialGrade: "C+",
        transactionalScore: "72",
        aScore: "56", // 10/18 * 100
        overallCreditScore: "68", // (76+72+56)/3
        recommendation: "pending"
      },
      {
        supplierId: supplier6.id,
        financialScore: "52",
        financialGrade: "F",
        transactionalScore: "38",
        aScore: "22", // 4/18 * 100
        overallCreditScore: "37", // (52+38+22)/3
        recommendation: "rejected"
      },
      {
        supplierId: supplier7.id,
        financialScore: "90",
        financialGrade: "A",
        transactionalScore: "75",
        aScore: "83", // 15/18 * 100
        overallCreditScore: "83", // (90+75+83)/3
        recommendation: "approved"
      },
      {
        supplierId: supplier8.id,
        financialScore: "81",
        financialGrade: "B",
        transactionalScore: "65",
        aScore: "72", // 13/18 * 100
        overallCreditScore: "73", // (81+65+72)/3
        recommendation: "pending"
      }
    ];

    supplierScores.forEach(scoreData => {
      const score: Score = {
        id: randomUUID(),
        supplierId: scoreData.supplierId,
        financialScore: scoreData.financialScore,
        financialGrade: scoreData.financialGrade,
        transactionalScore: scoreData.transactionalScore,
        aScore: scoreData.aScore,
        overallCreditScore: scoreData.overallCreditScore,
        recommendation: scoreData.recommendation,
        lastUpdated: "2023-03-01",
      };
      this.scores.set(score.id, score);
    });
  }

  async getSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliers.values());
  }

  async getSupplier(id: string): Promise<Supplier | undefined> {
    return this.suppliers.get(id);
  }

  async createSupplier(supplier: InsertSupplier): Promise<Supplier> {
    const id = randomUUID();
    const newSupplier: Supplier = { 
      ...supplier, 
      id, 
      status: supplier.status || "pending",
      vatRegistered: supplier.vatRegistered || false,
      createdAt: new Date().toISOString().split('T')[0] 
    };
    this.suppliers.set(id, newSupplier);
    return newSupplier;
  }

  async updateSupplier(id: string, supplier: Partial<InsertSupplier>): Promise<Supplier | undefined> {
    const existing = this.suppliers.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...supplier };
    this.suppliers.set(id, updated);
    return updated;
  }

  async getFinancialData(supplierId: string): Promise<FinancialData[]> {
    return Array.from(this.financialData.values()).filter(data => data.supplierId === supplierId);
  }

  async createFinancialData(data: InsertFinancialData): Promise<FinancialData> {
    const id = randomUUID();
    const newData: FinancialData = { ...data, id };
    this.financialData.set(id, newData);
    return newData;
  }

  async getTransactions(supplierId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(txn => txn.supplierId === supplierId);
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const newTransaction: Transaction = { 
      ...transaction, 
      id,
      poShipmentDate: transaction.poShipmentDate || null,
      deliveryOrderNo: transaction.deliveryOrderNo || null,
      deliveryDate: transaction.deliveryDate || null,
      deliveryAmount: transaction.deliveryAmount || null,
      grNo: transaction.grNo || null,
      grDate: transaction.grDate || null,
      grAmount: transaction.grAmount || null,
      invoiceNo: transaction.invoiceNo || null,
      invoiceDate: transaction.invoiceDate || null,
      invoiceAmount: transaction.invoiceAmount || null,
      invoiceVatAmount: transaction.invoiceVatAmount || null,
      invoiceNetAmount: transaction.invoiceNetAmount || null,
      paymentDate: transaction.paymentDate || null,
      receiptNo: transaction.receiptNo || null,
      receiptDate: transaction.receiptDate || null,
      receiptAmount: transaction.receiptAmount || null
    };
    this.transactions.set(id, newTransaction);
    return newTransaction;
  }

  async getDocuments(supplierId: string): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(doc => doc.supplierId === supplierId);
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    const id = randomUUID();
    const newDocument: Document = { 
      ...document, 
      id,
      isSubmitted: document.isSubmitted || false,
      submittedDate: document.submittedDate || null,
      isVerified: document.isVerified || false
    };
    this.documents.set(id, newDocument);
    return newDocument;
  }

  async updateDocument(id: string, document: Partial<InsertDocument>): Promise<Document | undefined> {
    const existing = this.documents.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...document };
    this.documents.set(id, updated);
    return updated;
  }

  async getScore(supplierId: string): Promise<Score | undefined> {
    return Array.from(this.scores.values()).find(score => score.supplierId === supplierId);
  }

  async createScore(score: InsertScore): Promise<Score> {
    const id = randomUUID();
    const newScore: Score = { 
      ...score, 
      id,
      lastUpdated: score.lastUpdated || new Date().toISOString().split('T')[0]
    };
    this.scores.set(id, newScore);
    return newScore;
  }

  async updateScore(supplierId: string, score: Partial<InsertScore>): Promise<Score | undefined> {
    const existing = Array.from(this.scores.values()).find(s => s.supplierId === supplierId);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...score };
    this.scores.set(existing.id, updated);
    return updated;
  }

  // Pricing Decisions (for machine learning)
  async createPricingDecision(decision: InsertPricingDecision): Promise<PricingDecision> {
    const id = randomUUID();
    const newDecision: PricingDecision = { 
      ...decision, 
      id,
      createdAt: new Date().toISOString()
    };
    this.pricingDecisions.set(id, newDecision);
    return newDecision;
  }

  async getPricingDecisions(supplierId: string): Promise<PricingDecision[]> {
    return Array.from(this.pricingDecisions.values()).filter(decision => decision.supplierId === supplierId);
  }
}

export const storage = new MemStorage();
