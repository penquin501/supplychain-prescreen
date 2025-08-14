import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, date, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const suppliers = pgTable("suppliers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyName: text("company_name").notNull(),
  taxId: text("tax_id").notNull().unique(),
  registrationType: text("registration_type").notNull(), // PLC, Ltd, LP
  vatRegistered: boolean("vat_registered").notNull().default(false),
  businessType: text("business_type").notNull(),
  establishedDate: date("established_date").notNull(),
  address: text("address").notNull(),
  contactPerson: text("contact_person").notNull(),
  yearsOfOperation: integer("years_of_operation").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  createdAt: date("created_at").default(sql`CURRENT_DATE`),
});

export const financialData = pgTable("financial_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  supplierId: varchar("supplier_id").references(() => suppliers.id).notNull(),
  year: integer("year").notNull(),
  salesRevenue: decimal("sales_revenue", { precision: 15, scale: 2 }).notNull(),
  costOfGoodsSold: decimal("cost_of_goods_sold", { precision: 15, scale: 2 }).notNull(),
  grossProfit: decimal("gross_profit", { precision: 15, scale: 2 }).notNull(),
  netIncome: decimal("net_income", { precision: 15, scale: 2 }).notNull(),
  totalAssets: decimal("total_assets", { precision: 15, scale: 2 }).notNull(),
  totalDebt: decimal("total_debt", { precision: 15, scale: 2 }).notNull(),
  totalEquity: decimal("total_equity", { precision: 15, scale: 2 }).notNull(),
  currentAssets: decimal("current_assets", { precision: 15, scale: 2 }).notNull(),
  currentLiabilities: decimal("current_liabilities", { precision: 15, scale: 2 }).notNull(),
  interestExpense: decimal("interest_expense", { precision: 15, scale: 2 }).notNull(),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  supplierId: varchar("supplier_id").references(() => suppliers.id).notNull(),
  buyerName: text("buyer_name").notNull(),
  agreementNo: text("agreement_no").notNull(),
  agreementStartDate: date("agreement_start_date").notNull(),
  agreementEndDate: date("agreement_end_date").notNull(),
  poNo: text("po_no").notNull(),
  poDate: date("po_date").notNull(),
  poAmount: decimal("po_amount", { precision: 15, scale: 2 }).notNull(),
  poVatAmount: decimal("po_vat_amount", { precision: 15, scale: 2 }).notNull(),
  poNetAmount: decimal("po_net_amount", { precision: 15, scale: 2 }).notNull(),
  poShipmentDate: date("po_shipment_date"),
  poPaymentTerm: integer("po_payment_term").notNull(), // days
  deliveryOrderNo: text("delivery_order_no"),
  deliveryDate: date("delivery_date"),
  deliveryAmount: decimal("delivery_amount", { precision: 15, scale: 2 }),
  grNo: text("gr_no"),
  grDate: date("gr_date"),
  grAmount: decimal("gr_amount", { precision: 15, scale: 2 }),
  invoiceNo: text("invoice_no"),
  invoiceDate: date("invoice_date"),
  invoiceAmount: decimal("invoice_amount", { precision: 15, scale: 2 }),
  invoiceVatAmount: decimal("invoice_vat_amount", { precision: 15, scale: 2 }),
  invoiceNetAmount: decimal("invoice_net_amount", { precision: 15, scale: 2 }),
  paymentDate: date("payment_date"),
  receiptNo: text("receipt_no"),
  receiptDate: date("receipt_date"),
  receiptAmount: decimal("receipt_amount", { precision: 15, scale: 2 }),
});

export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  supplierId: varchar("supplier_id").references(() => suppliers.id).notNull(),
  documentType: text("document_type").notNull(),
  documentName: text("document_name").notNull(),
  isSubmitted: boolean("is_submitted").notNull().default(false),
  submittedDate: date("submitted_date"),
  isVerified: boolean("is_verified").notNull().default(false),
});

export const scores = pgTable("scores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  supplierId: varchar("supplier_id").references(() => suppliers.id).notNull(),
  financialScore: decimal("financial_score", { precision: 5, scale: 2 }).notNull(),
  financialGrade: text("financial_grade").notNull(),
  transactionalScore: decimal("transactional_score", { precision: 5, scale: 2 }).notNull(),
  aScore: decimal("a_score", { precision: 5, scale: 2 }).notNull(),
  overallCreditScore: decimal("overall_credit_score", { precision: 5, scale: 2 }).notNull(),
  recommendation: text("recommendation").notNull(), // approved, pending, rejected
  lastUpdated: date("last_updated").default(sql`CURRENT_DATE`),
});

export const insertSupplierSchema = createInsertSchema(suppliers).omit({
  id: true,
  createdAt: true,
});

export const insertFinancialDataSchema = createInsertSchema(financialData).omit({
  id: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
});

export const insertScoreSchema = createInsertSchema(scores).omit({
  id: true,
});

export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
export type Supplier = typeof suppliers.$inferSelect;
export type InsertFinancialData = z.infer<typeof insertFinancialDataSchema>;
export type FinancialData = typeof financialData.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertScore = z.infer<typeof insertScoreSchema>;
export type Score = typeof scores.$inferSelect;
