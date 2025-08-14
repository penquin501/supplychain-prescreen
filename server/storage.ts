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
  type InsertScore
} from "@shared/schema";
import { randomUUID } from "crypto";

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
}

export class MemStorage implements IStorage {
  private suppliers: Map<string, Supplier> = new Map();
  private financialData: Map<string, FinancialData> = new Map();
  private transactions: Map<string, Transaction> = new Map();
  private documents: Map<string, Document> = new Map();
  private scores: Map<string, Score> = new Map();

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

    this.suppliers.set(supplier1.id, supplier1);
    this.suppliers.set(supplier2.id, supplier2);
    this.suppliers.set(supplier3.id, supplier3);

    // Create financial data for supplier1 (5 years)
    const years = [2019, 2020, 2021, 2022, 2023];
    const baseRevenue = [28500000, 32100000, 38700000, 42300000, 45200000];
    
    years.forEach((year, index) => {
      const revenue = baseRevenue[index];
      const cogs = Math.round(revenue * 0.62);
      const grossProfit = revenue - cogs;
      const netIncome = Math.round(grossProfit * 0.21);
      const totalAssets = Math.round(revenue * 1.6);
      const totalDebt = Math.round(totalAssets * 0.54);
      const totalEquity = totalAssets - totalDebt;
      const currentAssets = Math.round(totalAssets * 0.41);
      const currentLiabilities = Math.round(currentAssets * 0.56);
      
      const financialDataId = randomUUID();
      const data: FinancialData = {
        id: financialDataId,
        supplierId: supplier1.id,
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

    // Create sample transactions
    const transaction1: Transaction = {
      id: randomUUID(),
      supplierId: supplier1.id,
      buyerName: "Big Retail Corp",
      agreementNo: "AGR-2023-001",
      agreementStartDate: "2023-01-01",
      agreementEndDate: "2023-12-31",
      poNo: "PO-2023-001",
      poDate: "2023-01-15",
      poAmount: "1000000",
      poVatAmount: "70000",
      poNetAmount: "1070000",
      poShipmentDate: "2023-01-30",
      poPaymentTerm: 90,
      deliveryOrderNo: "DO-2023-001",
      deliveryDate: "2023-01-30",
      deliveryAmount: "1000000",
      grNo: "GR-2023-001",
      grDate: "2023-02-01",
      grAmount: "1000000",
      invoiceNo: "INV-2023-001",
      invoiceDate: "2023-02-01",
      invoiceAmount: "1000000",
      invoiceVatAmount: "70000",
      invoiceNetAmount: "1070000",
      paymentDate: "2023-05-01",
      receiptNo: "REC-2023-001",
      receiptDate: "2023-05-01",
      receiptAmount: "1070000",
    };

    this.transactions.set(transaction1.id, transaction1);

    // Create sample documents
    const documentTypes = [
      "Company Registration Certificate", "VAT Registration", "Financial Statements", 
      "Bank Statements", "Audit Report", "Tax Clearance", "Business License",
      "Director ID Copy", "Company Profile", "Reference Letters", "Insurance Policy",
      "Power of Attorney", "Board Resolution", "Share Certificate", "MOA & AOA",
      "Bank Reference Letter", "Credit Report", "Trade References"
    ];

    documentTypes.forEach((docType, index) => {
      const docId = randomUUID();
      const isSubmitted = index < 4; // Only first 4 documents submitted
      const doc: Document = {
        id: docId,
        supplierId: supplier1.id,
        documentType: docType,
        documentName: `${docType.replace(/\s+/g, '_').toLowerCase()}.pdf`,
        isSubmitted,
        submittedDate: isSubmitted ? "2023-01-20" : null,
        isVerified: isSubmitted,
      };
      this.documents.set(docId, doc);
    });

    // Create scores
    const score1: Score = {
      id: randomUUID(),
      supplierId: supplier1.id,
      financialScore: "85",
      financialGrade: "B+",
      transactionalScore: "78",
      aScore: "22", // 4/18 * 100
      overallCreditScore: "75",
      recommendation: "pending",
      lastUpdated: "2023-03-01",
    };

    this.scores.set(score1.id, score1);
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
    const newTransaction: Transaction = { ...transaction, id };
    this.transactions.set(id, newTransaction);
    return newTransaction;
  }

  async getDocuments(supplierId: string): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(doc => doc.supplierId === supplierId);
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    const id = randomUUID();
    const newDocument: Document = { ...document, id };
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
    const newScore: Score = { ...score, id };
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
}

export const storage = new MemStorage();
