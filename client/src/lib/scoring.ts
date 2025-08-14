import { type Supplier, type FinancialData, type Transaction, type Document } from "@shared/schema";

export function calculateFinancialScore(
  supplier: Supplier,
  financialData: FinancialData[]
): { score: number; grade: string } {
  if (!financialData.length) return { score: 0, grade: "F" };

  const latestFinancial = financialData.sort((a, b) => b.year - a.year)[0];
  
  const revenue = parseFloat(latestFinancial.salesRevenue);
  const deRatio = parseFloat(latestFinancial.totalDebt) / parseFloat(latestFinancial.totalEquity);
  const currentRatio = parseFloat(latestFinancial.currentAssets) / parseFloat(latestFinancial.currentLiabilities);
  const netIncome = parseFloat(latestFinancial.netIncome);
  const interestExpense = parseFloat(latestFinancial.interestExpense);
  const interestCoverage = interestExpense > 0 ? netIncome / interestExpense : 999;

  let score = 0;

  // Scoring criteria
  if (["PLC", "Ltd", "LP"].includes(supplier.registrationType)) score += 10;
  if (supplier.vatRegistered) score += 10;
  if (supplier.yearsOfOperation >= 2) score += 10;
  if (revenue > 30000000) score += 15; // > 30M THB
  if (netIncome > 0) score += 15; // Profitable
  if (deRatio <= 4) score += 15;
  if (currentRatio > 1) score += 15;
  if (interestCoverage > 1) score += 10;

  score = Math.min(100, score);

  // Assign grade
  let grade = "F";
  if (score >= 95) grade = "AAA";
  else if (score >= 90) grade = "AA";
  else if (score >= 85) grade = "A";
  else if (score >= 80) grade = "B+";
  else if (score >= 75) grade = "B";
  else if (score >= 70) grade = "C+";
  else if (score >= 65) grade = "C";
  else if (score >= 60) grade = "D+";
  else if (score >= 60) grade = "D";

  return { score, grade };
}

export function calculateTransactionalScore(transactions: Transaction[]): number {
  if (!transactions.length) return 50; // Base score

  let score = 50;

  // Payment terms
  const avgPaymentTerm = transactions.reduce((sum, t) => sum + t.poPaymentTerm, 0) / transactions.length;
  if (avgPaymentTerm <= 180) score += 20;

  // Transaction frequency
  if (transactions.length >= 5) score += 15;
  if (transactions.length >= 10) score += 15;

  return Math.min(100, score);
}

export function calculateAScore(documents: Document[]): number {
  if (!documents.length) return 0;

  const submittedDocs = documents.filter(d => d.isSubmitted).length;
  return Math.round((submittedDocs / documents.length) * 100);
}

export function calculateOverallCreditScore(
  financialScore: number,
  transactionalScore: number,
  aScore: number
): number {
  return Math.round(
    (financialScore + transactionalScore + aScore) / 3
  );
}

export function determineRecommendation(
  financialScore: number,
  aScore: number
): "approved" | "pending" | "rejected" {
  if (aScore >= 80 && financialScore >= 70) return "approved";
  if (aScore >= 31 && financialScore >= 60) return "pending";
  return "rejected";
}
