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
  
  // Balance Sheet - Assets
  cashAndDeposits: decimal("cash_and_deposits", { precision: 15, scale: 2 }),
  accountsReceivable: decimal("accounts_receivable", { precision: 15, scale: 2 }),
  accountsNotesReceivableNet: decimal("accounts_notes_receivable_net", { precision: 15, scale: 2 }),
  totalShortTermLoans: decimal("total_short_term_loans", { precision: 15, scale: 2 }),
  inventoriesNet: decimal("inventories_net", { precision: 15, scale: 2 }),
  accruedIncome: decimal("accrued_income", { precision: 15, scale: 2 }),
  prepaidExpenses: decimal("prepaid_expenses", { precision: 15, scale: 2 }),
  otherCurrentAssets: decimal("other_current_assets", { precision: 15, scale: 2 }),
  othersCurrentAssets: decimal("others_current_assets", { precision: 15, scale: 2 }),
  totalCurrentAssets: decimal("total_current_assets", { precision: 15, scale: 2 }).notNull(),
  totalLongTermLoansInvestments: decimal("total_long_term_loans_investments", { precision: 15, scale: 2 }),
  propertyPlantEquipmentNet: decimal("property_plant_equipment_net", { precision: 15, scale: 2 }),
  otherNonCurrentAssets: decimal("other_non_current_assets", { precision: 15, scale: 2 }),
  othersNonCurrentAssets: decimal("others_non_current_assets", { precision: 15, scale: 2 }),
  totalNonCurrentAssets: decimal("total_non_current_assets", { precision: 15, scale: 2 }),
  totalAssets: decimal("total_assets", { precision: 15, scale: 2 }).notNull(),
  
  // Balance Sheet - Liabilities
  bankOverdraftsShortTermLoans: decimal("bank_overdrafts_short_term_loans", { precision: 15, scale: 2 }),
  accountsPayable: decimal("accounts_payable", { precision: 15, scale: 2 }),
  totalAccountsPayableNotesPayable: decimal("total_accounts_payable_notes_payable", { precision: 15, scale: 2 }),
  currentPortionLongTermLoans: decimal("current_portion_long_term_loans", { precision: 15, scale: 2 }),
  totalShortTermLoansLiabilities: decimal("total_short_term_loans_liabilities", { precision: 15, scale: 2 }),
  accruedExpenses: decimal("accrued_expenses", { precision: 15, scale: 2 }),
  unearnedRevenues: decimal("unearned_revenues", { precision: 15, scale: 2 }),
  otherCurrentLiabilities: decimal("other_current_liabilities", { precision: 15, scale: 2 }),
  othersCurrentLiabilities: decimal("others_current_liabilities", { precision: 15, scale: 2 }),
  totalCurrentLiabilities: decimal("total_current_liabilities", { precision: 15, scale: 2 }).notNull(),
  totalLongTermLoans: decimal("total_long_term_loans", { precision: 15, scale: 2 }),
  otherNonCurrentLiabilities: decimal("other_non_current_liabilities", { precision: 15, scale: 2 }),
  othersNonCurrentLiabilities: decimal("others_non_current_liabilities", { precision: 15, scale: 2 }),
  totalNonCurrentLiabilities: decimal("total_non_current_liabilities", { precision: 15, scale: 2 }),
  totalLiabilities: decimal("total_liabilities", { precision: 15, scale: 2 }).notNull(),
  
  // Balance Sheet - Shareholders' Equity
  authorizedPreferredStocks: decimal("authorized_preferred_stocks", { precision: 15, scale: 2 }),
  authorizedCommonStocks: decimal("authorized_common_stocks", { precision: 15, scale: 2 }),
  issuedPaidUpPreferredStocks: decimal("issued_paid_up_preferred_stocks", { precision: 15, scale: 2 }),
  issuedPaidUpCommonStocks: decimal("issued_paid_up_common_stocks", { precision: 15, scale: 2 }),
  appraisalSurplusPropertyPlantEquipment: decimal("appraisal_surplus_property_plant_equipment", { precision: 15, scale: 2 }),
  accumulatedRetainedEarnings: decimal("accumulated_retained_earnings", { precision: 15, scale: 2 }),
  othersShareholdersEquity: decimal("others_shareholders_equity", { precision: 15, scale: 2 }),
  totalShareholdersEquity: decimal("total_shareholders_equity", { precision: 15, scale: 2 }).notNull(),
  totalLiabilitiesShareholdersEquity: decimal("total_liabilities_shareholders_equity", { precision: 15, scale: 2 }).notNull(),
  
  // Additional Shareholders' Equity Information
  commonStocksAuthorizedShares: integer("common_stocks_authorized_shares"),
  commonStocksAuthorizedParValue: decimal("common_stocks_authorized_par_value", { precision: 10, scale: 2 }),
  commonStocksIssuedPaidUpShares: integer("common_stocks_issued_paid_up_shares"),
  commonStocksIssuedPaidUpParValue: decimal("common_stocks_issued_paid_up_par_value", { precision: 10, scale: 2 }),
  
  // Income Statement
  netSales: decimal("net_sales", { precision: 15, scale: 2 }).notNull(),
  totalOtherIncome: decimal("total_other_income", { precision: 15, scale: 2 }),
  totalRevenue: decimal("total_revenue", { precision: 15, scale: 2 }).notNull(),
  costOfSalesServices: decimal("cost_of_sales_services", { precision: 15, scale: 2 }).notNull(),
  grossProfitLoss: decimal("gross_profit_loss", { precision: 15, scale: 2 }).notNull(),
  totalOperatingExpenses: decimal("total_operating_expenses", { precision: 15, scale: 2 }),
  operatingIncomeLoss: decimal("operating_income_loss", { precision: 15, scale: 2 }),
  otherExpenses: decimal("other_expenses", { precision: 15, scale: 2 }),
  incomeBeforeDepreciationAmortization: decimal("income_before_depreciation_amortization", { precision: 15, scale: 2 }),
  incomeBeforeInterestIncomeTaxes: decimal("income_before_interest_income_taxes", { precision: 15, scale: 2 }),
  interestExpenses: decimal("interest_expenses", { precision: 15, scale: 2 }),
  incomeTaxes: decimal("income_taxes", { precision: 15, scale: 2 }),
  extraordinaryItems: decimal("extraordinary_items", { precision: 15, scale: 2 }),
  othersIncomeStatement: decimal("others_income_statement", { precision: 15, scale: 2 }),
  netIncomeLoss: decimal("net_income_loss", { precision: 15, scale: 2 }).notNull(),
  earningsLossPerShare: decimal("earnings_loss_per_share", { precision: 10, scale: 4 }),
  numberOfWeightedAverageOrdinaryShares: integer("number_of_weighted_average_ordinary_shares"),
  
  // Legacy fields for backward compatibility
  salesRevenue: decimal("sales_revenue", { precision: 15, scale: 2 }).notNull(),
  costOfGoodsSold: decimal("cost_of_goods_sold", { precision: 15, scale: 2 }).notNull(),
  grossProfit: decimal("gross_profit", { precision: 15, scale: 2 }).notNull(),
  netIncome: decimal("net_income", { precision: 15, scale: 2 }).notNull(),
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
