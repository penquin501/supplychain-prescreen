// Required documents list with English translations
export const requiredDocuments = [
  { id: 1, thai: "Company Profile", english: "Company Profile" },
  { id: 2, thai: "ประวัติเจ้าของ / ผู้บริหารหลัก", english: "Owner/Key Executive History" },
  { id: 3, thai: "หนังสือรับรองบริษัท (ออกภายใน 1 เดือนล่าสุด)", english: "Company Certificate (Issued within the last month)" },
  { id: 4, thai: "บริคณห์สนธิ", english: "Articles of Association" },
  { id: 5, thai: "สำเนารายชื่อถือหุ้น (ล่าสุด)", english: "Copy of Shareholders List (Latest)" },
  { id: 6, thai: "หนังสือแสดงการจดทะเบียนหุ้นส่วนบริษัท", english: "Partnership Registration Certificate" },
  { id: 7, thai: "ภ.พ.20", english: "Por Por 20 (VAT Registration)" },
  { id: 8, thai: "บอจ.3 / ใบอนุญาตจัดตั้งโรงงาน", english: "Factory License (Bor Chor 3 / Factory Establishment Permit)" },
  { id: 9, thai: "งบภายในปี 68 และ ภ.พ.30 ย้อนหลัง ม.ค. 68 – ปัจจุบัน พร้อมใบเสร็จ", english: "Internal Financial Statements for 2025 and Por Por 30 (Jan 2025 - Present) with receipts" },
  { id: 10, thai: "งบการเงินย้อนหลัง 3 ปี (ล่าสุด) กรณียังไม่ปิดปี 67 ขอ ภ.พ.30 ม.ค.–ธ.ค. 67 พร้อมใบเสร็จ", english: "3-Year Financial Statements (Latest). If 2024 not closed, request Por Por 30 Jan-Dec 2024 with receipts" },
  { id: 11, thai: "Statement ธนาคารย้อนหลัง 1 ปี", english: "Bank Statements for the past 1 year" },
  { id: 12, thai: "สำเนาบัตรประจำตัวประชาชน และสำเนาทะเบียนบ้านกรรมการและคู่สมรสกรรมการ (รับรองสำเนาถูกต้อง)", english: "Copy of ID Cards and House Registration of Directors and Spouses (Certified copies)" },
  { id: 13, thai: "List รายชื่อลูกหนี้ที่ขออนุมัติวงเงิน", english: "List of Debtors for Credit Limit Approval" },
  { id: 14, thai: "ประวัติการเรียกเก็บเงินจากลูกหนี้การค้าที่เสนอขอวงเงินย้อนหลัง 1 ปี เอกสารประกอบได้แก่ ใบเสนอราคา, ใบสั่งซื้อ, ใบส่งของ, ใบวางบิล, ใบแจ้งหนี้ และภาพถ่ายหน้าเช็คลูกหนี้การค้าหรือเอกสารแสดงรายการโอนเงิน (Remittance) พร้อมแนับหน้า Statement ที่มียอดเงินรับชำระจากลูกค้าเข้ามา", english: "1-Year Collection History from Trade Debtors including: quotations, purchase orders, delivery notes, billing, invoices, check photos or remittance documents with statement pages showing customer payments" },
  { id: 15, thai: "PO งาน หรือ สัญญาที่ได้รับจากลูกหนี้", english: "Purchase Orders or Contracts from Debtors" },
  { id: 16, thai: "คาดการณ์ยอดขายลูกหนี้รายที่ขออนุมัติวงเงิน", english: "Sales Forecast for Debtors Requesting Credit Approval" },
  { id: 17, thai: "เอกสารเครดิตบูโร (บริษัท+กรรมการ+ผู้ค้ำประกัน) (ย้อนหลังไม่เกิน 1 เดือน)", english: "Credit Bureau Reports (Company + Directors + Guarantors) (Not older than 1 month)" },
  { id: 18, thai: "เงื่อนไขการวางบิลและชำระเงิน", english: "Billing and Payment Terms including: a) Billing schedule, b) Payment schedule, c) Payment type (check/transfer), d) Check receipt documents, e) Payment location, f) Billing/payment procedures (if any)" }
];

// Function to generate random document submission data for a supplier
export function getRandomDocumentSubmissions(supplierId: string): { documentType: string; isSubmitted: boolean }[] {
  // Use supplier ID as seed for consistent random data
  const seed = supplierId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const random = (index: number) => {
    // Simple deterministic random based on supplier ID and document index
    return ((seed * (index + 1) * 1103515245 + 12345) % 2147483647) / 2147483647;
  };

  return requiredDocuments.map((doc, index) => ({
    documentType: doc.english,
    isSubmitted: random(index) > 0.3 // 70% chance of being submitted
  }));
}

// Random data generator for supplier profiles
export interface RandomCompanyData {
  companyName: string;
  registrationType: string;
  vatRegistration: string;
  businessType: string;
  taxId: string;
  establishedDate: string;
  yearsOfOperation: number;
  address: string;
  contactPerson: string;
  businessUnit: string;
  business: string;
  industry: string;
  registeredCapital: number;
  clientStatus: string;
  additionalCreditLine: string;
  creditLine: string;
  approvalAuthority: string;
  qualificationResults: QualificationResult[];
  qualificationTotalScore: number;
  financialGrade: string;
  financialData: FinancialPerformanceData;
  scoreChange: ScoreChangeData;
}

export interface ScoreChangeData {
  change: number;
  type: 'positive' | 'negative' | 'neutral';
  factors: string[];
  impactBreakdown?: { factor: string; points: number }[];
}

export interface QualificationResult {
  no: number;
  qualification: string;
  criteria: string;
  result: 'Yes' | 'No';
  value: number;
  weight: string;
  scoring: string;
}

export interface FinancialPerformanceData {
  salesRevenue: { 2024: number; 2023: number; 2022: number };
  costOfSales: { 2024: number; 2023: number; 2022: number };
  grossProfit: { 2024: number; 2023: number; 2022: number };
  opex: { 2024: number; 2023: number; 2022: number };
  operatingProfit: { 2024: number; 2023: number; 2022: number };
  ebitda: { 2024: number; 2023: number; 2022: number };
  interest: { 2024: number; 2023: number; 2022: number };
  taxes: { 2024: number; 2023: number; 2022: number };
  netProfit: { 2024: number; 2023: number; 2022: number };
  currentAssets: { 2024: number; 2023: number; 2022: number };
  totalAssets: { 2024: number; 2023: number; 2022: number };
  debtPrinciplePayment: { 2024: number; 2023: number; 2022: number };
  currentLiabilities: { 2024: number; 2023: number; 2022: number };
  totalLiabilities: { 2024: number; 2023: number; 2022: number };
  retainedEarning: { 2024: number; 2023: number; 2022: number };
  shareholdersEquity: { 2024: number; 2023: number; 2022: number };
  grossMargin: { 2024: string; 2023: string; 2022: string };
  netProfitMargin: { 2024: string; 2023: string; 2022: string };
  currentRatio: { 2024: number; 2023: number; 2022: number };
  dscr: { 2024: number; 2023: number; 2022: number };
  interestCoverageRatio: { 2024: number; 2023: number; 2022: number };
  debtToEquityRatio: { 2024: number; 2023: number; 2022: number };
  revenueCagr: { 2024: string; 2023: string; 2022: string };
}

const companies = [
  {
    companyName: "GADHOUSE CO.,LTD.",
    registrationType: "Ltd",
    vatRegistration: "Registered",
    businessType: "Manufacturing",
    taxId: "1234567890123",
    establishedDate: "2018-03-15",
    yearsOfOperation: 6,
    address: "123 Industrial Road, Bangkok 10400",
    contactPerson: "Mr. John Smith (CFO)",
    businessUnit: "Factoring",
    business: "HOME",
    industry: "Growth",
    registeredCapital: 10,
    clientStatus: "Existing Client",
    additionalCreditLine: "-",
    creditLine: "",
    approvalAuthority: "Executive Committee"
  },
  {
    companyName: "TECHNO SOLUTIONS PLC",
    registrationType: "PLC",
    vatRegistration: "Registered",
    businessType: "Technology Services",
    taxId: "2345678901234",
    establishedDate: "2020-07-22",
    yearsOfOperation: 4,
    address: "456 Tech Park, Bangkok 10110",
    contactPerson: "Ms. Jane Doe (Finance Director)",
    businessUnit: "Leasing",
    business: "TECHNOLOGY",
    industry: "Tech",
    registeredCapital: 25,
    clientStatus: "New Client",
    additionalCreditLine: "5M THB",
    creditLine: "15M THB",
    approvalAuthority: "Credit Committee"
  },
  {
    companyName: "GREEN FOOD INDUSTRIES LTD.",
    registrationType: "Ltd",
    vatRegistration: "Registered",
    businessType: "Food Manufacturing",
    taxId: "3456789012345",
    establishedDate: "2016-12-05",
    yearsOfOperation: 8,
    address: "789 Food Complex, Nonthaburi 11120",
    contactPerson: "Mr. Robert Kim (Finance Manager)",
    businessUnit: "Supply Chain Finance",
    business: "FOOD",
    industry: "FMCG",
    registeredCapital: 15,
    clientStatus: "Existing Client",
    additionalCreditLine: "-",
    creditLine: "8M THB",
    approvalAuthority: "Board of Directors"
  },
  {
    companyName: "SUNRISE TRADING CO.",
    registrationType: "Ltd",
    vatRegistration: "Registered", 
    businessType: "Import/Export Trading",
    taxId: "4567890123456",
    establishedDate: "2021-09-12",
    yearsOfOperation: 3,
    address: "456 Trading Plaza, Samut Prakan 10270",
    contactPerson: "Ms. Maria Santos (Accounting Head)",
    businessUnit: "Factoring",
    business: "TRADING",
    industry: "Import/Export",
    registeredCapital: 8,
    clientStatus: "Prospect",
    additionalCreditLine: "2M THB",
    creditLine: "",
    approvalAuthority: "Executive Committee"
  },
  {
    companyName: "PACIFIC MANUFACTURING LP",
    registrationType: "LP",
    vatRegistration: "Registered",
    businessType: "Industrial Manufacturing",
    taxId: "5678901234567",
    establishedDate: "2014-02-18",
    yearsOfOperation: 10,
    address: "321 Industrial Estate, Rayong 21140",
    contactPerson: "Dr. Michael Zhang (CFO)",
    businessUnit: "Asset Finance",
    business: "MANUFACTURING",
    industry: "Industrial",
    registeredCapital: 50,
    clientStatus: "Existing Client",
    additionalCreditLine: "10M THB",
    creditLine: "30M THB",
    approvalAuthority: "Board of Directors"
  },
  {
    companyName: "DIGITAL INNOVATIONS LTD.",
    registrationType: "Ltd",
    vatRegistration: "Registered",
    businessType: "Software Development",
    taxId: "6789012345678",
    establishedDate: "2019-06-30",
    yearsOfOperation: 5,
    address: "654 Digital Park, Bangkok 10330",
    contactPerson: "Ms. Emily Johnson (Finance Director)",
    businessUnit: "Working Capital",
    business: "SOFTWARE",
    industry: "Tech",
    registeredCapital: 12,
    clientStatus: "New Client",
    additionalCreditLine: "-",
    creditLine: "6M THB",
    approvalAuthority: "Credit Committee"
  }
];

// Seeded random number generator
function seededRandom(seed: string): () => number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return function() {
    hash = (hash * 9301 + 49297) % 233280;
    return hash / 233280;
  };
}

function randomBetween(random: () => number, min: number, max: number): number {
  return min + random() * (max - min);
}

// Helper function to calculate qualification score and grade
function calculateQualificationScoreAndGrade(qualificationResults: QualificationResult[]): { score: number; grade: string } {
  const totalScore = qualificationResults.reduce((sum, result) => {
    return sum + parseFloat(result.scoring);
  }, 0);
  
  const scorePercentage = Math.round(totalScore * 100);
  
  let grade = "F";
  if (scorePercentage === 100) grade = "AAA";
  else if (scorePercentage >= 95) grade = "AA";
  else if (scorePercentage >= 90) grade = "A";
  else if (scorePercentage >= 85) grade = "B+";
  else if (scorePercentage >= 80) grade = "B";
  else if (scorePercentage >= 75) grade = "C+";
  else if (scorePercentage >= 70) grade = "C";
  else if (scorePercentage >= 65) grade = "D+";
  else if (scorePercentage >= 60) grade = "D";
  else grade = "F";
  
  return { score: scorePercentage, grade };
}

export function getRandomCompanyData(supplierId: string): RandomCompanyData {
  const random = seededRandom(supplierId);
  const companyIndex = Math.floor(random() * companies.length);
  const company = companies[companyIndex];
  
  // Generate base revenue (30-200 million THB)
  const baseRevenue2022 = randomBetween(random, 30, 200);
  const baseRevenue2023 = baseRevenue2022 * randomBetween(random, 0.8, 1.4);
  const baseRevenue2024 = baseRevenue2023 * randomBetween(random, 0.6, 1.3);
  
  // Generate cost ratios (50-80% of revenue)
  const costRatio2022 = randomBetween(random, 0.5, 0.8);
  const costRatio2023 = randomBetween(random, 0.5, 0.8);
  const costRatio2024 = randomBetween(random, 0.5, 0.8);
  
  const costOfSales2022 = baseRevenue2022 * costRatio2022;
  const costOfSales2023 = baseRevenue2023 * costRatio2023;
  const costOfSales2024 = baseRevenue2024 * costRatio2024;
  
  const grossProfit2022 = baseRevenue2022 - costOfSales2022;
  const grossProfit2023 = baseRevenue2023 - costOfSales2023;
  const grossProfit2024 = baseRevenue2024 - costOfSales2024;
  
  // OPEX (80-95% of gross profit)
  const opex2022 = grossProfit2022 * randomBetween(random, 0.8, 0.95);
  const opex2023 = grossProfit2023 * randomBetween(random, 0.8, 0.95);
  const opex2024 = grossProfit2024 * randomBetween(random, 0.8, 0.95);
  
  const operatingProfit2022 = grossProfit2022 - opex2022;
  const operatingProfit2023 = grossProfit2023 - opex2023;
  const operatingProfit2024 = grossProfit2024 - opex2024;
  
  // EBITDA (slightly higher than operating profit)
  const ebitda2022 = operatingProfit2022 + randomBetween(random, 0.5, 2);
  const ebitda2023 = operatingProfit2023 + randomBetween(random, 0.5, 2);
  const ebitda2024 = operatingProfit2024 + randomBetween(random, 0.5, 2);
  
  // Interest (0.1-3% of revenue)
  const interest2022 = baseRevenue2022 * randomBetween(random, 0.001, 0.03);
  const interest2023 = baseRevenue2023 * randomBetween(random, 0.001, 0.03);
  const interest2024 = baseRevenue2024 * randomBetween(random, 0.001, 0.03);
  
  // Taxes (0-5% of revenue)
  const taxes2022 = baseRevenue2022 * randomBetween(random, 0, 0.05);
  const taxes2023 = baseRevenue2023 * randomBetween(random, 0, 0.05);
  const taxes2024 = baseRevenue2024 * randomBetween(random, 0, 0.05);
  
  const netProfit2022 = operatingProfit2022 - interest2022 - taxes2022;
  const netProfit2023 = operatingProfit2023 - interest2023 - taxes2023;
  const netProfit2024 = operatingProfit2024 - interest2024 - taxes2024;
  
  // Balance sheet items
  const totalAssets2022 = baseRevenue2022 * randomBetween(random, 0.6, 1.2);
  const totalAssets2023 = baseRevenue2023 * randomBetween(random, 0.6, 1.2);
  const totalAssets2024 = baseRevenue2024 * randomBetween(random, 0.6, 1.2);
  
  const currentAssets2022 = totalAssets2022 * randomBetween(random, 0.6, 0.9);
  const currentAssets2023 = totalAssets2023 * randomBetween(random, 0.6, 0.9);
  const currentAssets2024 = totalAssets2024 * randomBetween(random, 0.6, 0.9);
  
  const totalLiabilities2022 = totalAssets2022 * randomBetween(random, 0.6, 0.9);
  const totalLiabilities2023 = totalAssets2023 * randomBetween(random, 0.6, 0.9);
  const totalLiabilities2024 = totalAssets2024 * randomBetween(random, 0.6, 0.9);
  
  const currentLiabilities2022 = totalLiabilities2022 * randomBetween(random, 0.7, 0.95);
  const currentLiabilities2023 = totalLiabilities2023 * randomBetween(random, 0.7, 0.95);
  const currentLiabilities2024 = totalLiabilities2024 * randomBetween(random, 0.7, 0.95);
  
  const shareholdersEquity2022 = totalAssets2022 - totalLiabilities2022;
  const shareholdersEquity2023 = totalAssets2023 - totalLiabilities2023;
  const shareholdersEquity2024 = totalAssets2024 - totalLiabilities2024;
  
  const retainedEarning2022 = shareholdersEquity2022 * randomBetween(random, 0.3, 0.8);
  const retainedEarning2023 = shareholdersEquity2023 * randomBetween(random, 0.3, 0.8);
  const retainedEarning2024 = shareholdersEquity2024 * randomBetween(random, 0.3, 0.8);
  
  const debtPrinciplePayment2022 = randomBetween(random, 5, 20);
  const debtPrinciplePayment2023 = randomBetween(random, 5, 20);
  const debtPrinciplePayment2024 = randomBetween(random, 5, 20);
  
  // Calculate ratios
  const currentRatio2022 = currentAssets2022 / currentLiabilities2022;
  const currentRatio2023 = currentAssets2023 / currentLiabilities2023;
  const currentRatio2024 = currentAssets2024 / currentLiabilities2024;
  
  const dscr2022 = operatingProfit2022 / debtPrinciplePayment2022;
  const dscr2023 = operatingProfit2023 / debtPrinciplePayment2023;
  const dscr2024 = operatingProfit2024 / debtPrinciplePayment2024;
  
  const interestCoverageRatio2022 = operatingProfit2022 / Math.max(interest2022, 0.01);
  const interestCoverageRatio2023 = operatingProfit2023 / Math.max(interest2023, 0.01);
  const interestCoverageRatio2024 = operatingProfit2024 / Math.max(interest2024, 0.01);
  
  const debtToEquityRatio2022 = totalLiabilities2022 / Math.max(shareholdersEquity2022, 0.01);
  const debtToEquityRatio2023 = totalLiabilities2023 / Math.max(shareholdersEquity2023, 0.01);
  const debtToEquityRatio2024 = totalLiabilities2024 / Math.max(shareholdersEquity2024, 0.01);
  
  // Generate qualification results based on financial ratios
  const qualificationResults: QualificationResult[] = [
    {
      no: 1,
      qualification: "Registered Entity",
      criteria: "Public Company (PLC) / Limited Company (Ltd.) / Limited Partnership (LP)",
      result: "Yes",
      value: 1,
      weight: "5.00%",
      scoring: "0.05"
    },
    {
      no: 2,
      qualification: "Registered in the VAT System", 
      criteria: "Registered for VAT",
      result: random() > 0.2 ? "Yes" : "No",
      value: random() > 0.2 ? 1 : 0,
      weight: "5.00%",
      scoring: random() > 0.2 ? "0.05" : "0.00"
    },
    {
      no: 3,
      qualification: "Years of Operation",
      criteria: "In business for at least 2 years", 
      result: random() > 0.1 ? "Yes" : "No",
      value: random() > 0.1 ? 1 : 0,
      weight: "5.00%",
      scoring: random() > 0.1 ? "0.05" : "0.00"
    },
    {
      no: 4,
      qualification: "Sales Revenue",
      criteria: "> 30 million THB",
      result: baseRevenue2024 > 30 ? "Yes" : "No", 
      value: baseRevenue2024 > 30 ? 1 : 0,
      weight: "5.00%",
      scoring: baseRevenue2024 > 30 ? "0.05" : "0.00"
    },
    {
      no: 5,
      qualification: "Credit Term",
      criteria: "≤ 180 days",
      result: random() > 0.3 ? "Yes" : "No",
      value: random() > 0.3 ? 1 : 0,
      weight: "5.00%",
      scoring: random() > 0.3 ? "0.05" : "0.00"
    },
    {
      no: 6,
      qualification: "Business Performance", 
      criteria: "Profitable in the latest year or in 2 of the last 3 years",
      result: (netProfit2024 > 0 || (netProfit2023 > 0 && netProfit2022 > 0)) ? "Yes" : "No",
      value: (netProfit2024 > 0 || (netProfit2023 > 0 && netProfit2022 > 0)) ? 1 : 0,
      weight: "5.00%",
      scoring: (netProfit2024 > 0 || (netProfit2023 > 0 && netProfit2022 > 0)) ? "0.05" : "0.00"
    },
    {
      no: 7,
      qualification: "Equity",
      criteria: "No accumulated losses exceeding paid-up capital*",
      result: shareholdersEquity2024 > 0 ? "Yes" : "No",
      value: shareholdersEquity2024 > 0 ? 1 : 0,
      weight: "15.00%",
      scoring: shareholdersEquity2024 > 0 ? "0.15" : "0.00"
    },
    {
      no: 8,
      qualification: "D/E Ratio",
      criteria: "Not more than 4 times",
      result: debtToEquityRatio2024 <= 4 ? "Yes" : "No",
      value: debtToEquityRatio2024 <= 4 ? 1 : 0,
      weight: "20.00%",
      scoring: debtToEquityRatio2024 <= 4 ? "0.20" : "0.00"
    },
    {
      no: 9,
      qualification: "DSCR",
      criteria: "Not less than 1.2 times",
      result: dscr2024 >= 1.2 ? "Yes" : "No",
      value: dscr2024 >= 1.2 ? 1 : 0,
      weight: "15.00%",
      scoring: dscr2024 >= 1.2 ? "0.15" : "0.00"
    },
    {
      no: 10,
      qualification: "Current Ratio",
      criteria: "Greater than 1 time",
      result: currentRatio2024 > 1 ? "Yes" : "No",
      value: currentRatio2024 > 1 ? 1 : 0,
      weight: "10.00%",
      scoring: currentRatio2024 > 1 ? "0.10" : "0.00"
    },
    {
      no: 11,
      qualification: "Interest Coverage Ratio", 
      criteria: "Greater than 1 time",
      result: interestCoverageRatio2024 > 1 ? "Yes" : "No",
      value: interestCoverageRatio2024 > 1 ? 1 : 0,
      weight: "10.00%",
      scoring: interestCoverageRatio2024 > 1 ? "0.10" : "0.00"
    }
  ];

  // Calculate qualification score and grade
  let { score: qualificationTotalScore, grade: financialGrade } = calculateQualificationScoreAndGrade(qualificationResults);

  // If supplierId === "supplier-1", override results to "Yes"
  let adjustedQualificationResults = qualificationResults;
  if (supplierId === "supplier-1") {
    adjustedQualificationResults = qualificationResults.map((item) => {
      const weightValue = parseFloat(item.weight) / 100;
      return {
        ...item,
        result: "Yes",
        value: 1,
        scoring: weightValue.toFixed(2),
      };
    });
    const { score: adjScore, grade: adjGrade } = calculateQualificationScoreAndGrade(adjustedQualificationResults);
    qualificationTotalScore = adjScore;
    financialGrade = adjGrade;
  }

  // Generate score change data based on supplier ID
  function generateScoreChange(supplierId: string): ScoreChangeData {
    const scoreChangeRandom = seededRandom(supplierId + "_score_change");
    const changeValue = Math.floor(scoreChangeRandom() * 40 - 20); // Range: -20 to +19
    
    if (changeValue > 5) {
      return {
        change: changeValue,
        type: 'positive',
        factors: [
          "Improved payment collection",
          "Stronger buyer relationships", 
          "Enhanced operational efficiency"
        ],
        impactBreakdown: [
          { factor: "Enhanced collection efficiency", points: Math.floor(changeValue * 0.6) },
          { factor: "Stronger buyer relationships", points: Math.floor(changeValue * 0.3) },
          { factor: "Operational improvements", points: changeValue - Math.floor(changeValue * 0.6) - Math.floor(changeValue * 0.3) }
        ]
      };
    } else if (changeValue < -3) {
      return {
        change: changeValue,
        type: 'negative',
        factors: [
          "Market downturn impact",
          "Delayed payments from buyers",
          "Increased operating costs"
        ],
        impactBreakdown: [
          { factor: "External market conditions", points: Math.floor(changeValue * 0.6) },
          { factor: "Increased financial leverage", points: Math.floor(changeValue * 0.2) },
          { factor: "Buyer concentration risk", points: changeValue - Math.floor(changeValue * 0.6) - Math.floor(changeValue * 0.2) }
        ]
      };
    } else {
      return {
        change: changeValue,
        type: 'neutral',
        factors: [
          "Stable market conditions",
          "Consistent payment patterns",
          "Steady operational performance"
        ]
      };
    }
  }

  const scoreChange = generateScoreChange(supplierId);

  return {
    ...company,
    qualificationResults: adjustedQualificationResults,
    qualificationTotalScore,
    financialGrade,
    financialData: {
      salesRevenue: { 2024: baseRevenue2024, 2023: baseRevenue2023, 2022: baseRevenue2022 },
      costOfSales: { 2024: costOfSales2024, 2023: costOfSales2023, 2022: costOfSales2022 },
      grossProfit: { 2024: grossProfit2024, 2023: grossProfit2023, 2022: grossProfit2022 },
      opex: { 2024: opex2024, 2023: opex2023, 2022: opex2022 },
      operatingProfit: { 2024: operatingProfit2024, 2023: operatingProfit2023, 2022: operatingProfit2022 },
      ebitda: { 2024: ebitda2024, 2023: ebitda2023, 2022: ebitda2022 },
      interest: { 2024: interest2024, 2023: interest2023, 2022: interest2022 },
      taxes: { 2024: taxes2024, 2023: taxes2023, 2022: taxes2022 },
      netProfit: { 2024: netProfit2024, 2023: netProfit2023, 2022: netProfit2022 },
      currentAssets: { 2024: currentAssets2024, 2023: currentAssets2023, 2022: currentAssets2022 },
      totalAssets: { 2024: totalAssets2024, 2023: totalAssets2023, 2022: totalAssets2022 },
      debtPrinciplePayment: { 2024: debtPrinciplePayment2024, 2023: debtPrinciplePayment2023, 2022: debtPrinciplePayment2022 },
      currentLiabilities: { 2024: currentLiabilities2024, 2023: currentLiabilities2023, 2022: currentLiabilities2022 },
      totalLiabilities: { 2024: totalLiabilities2024, 2023: totalLiabilities2023, 2022: totalLiabilities2022 },
      retainedEarning: { 2024: retainedEarning2024, 2023: retainedEarning2023, 2022: retainedEarning2022 },
      shareholdersEquity: { 2024: shareholdersEquity2024, 2023: shareholdersEquity2023, 2022: shareholdersEquity2022 },
      grossMargin: { 
        2024: ((grossProfit2024 / baseRevenue2024) * 100).toFixed(1) + "%", 
        2023: ((grossProfit2023 / baseRevenue2023) * 100).toFixed(1) + "%", 
        2022: ((grossProfit2022 / baseRevenue2022) * 100).toFixed(1) + "%" 
      },
      netProfitMargin: { 
        2024: ((netProfit2024 / baseRevenue2024) * 100).toFixed(1) + "%", 
        2023: ((netProfit2023 / baseRevenue2023) * 100).toFixed(1) + "%", 
        2022: ((netProfit2022 / baseRevenue2022) * 100).toFixed(1) + "%" 
      },
      currentRatio: { 2024: currentRatio2024, 2023: currentRatio2023, 2022: currentRatio2022 },
      dscr: { 2024: dscr2024, 2023: dscr2023, 2022: dscr2022 },
      interestCoverageRatio: { 2024: interestCoverageRatio2024, 2023: interestCoverageRatio2023, 2022: interestCoverageRatio2022 },
      debtToEquityRatio: { 2024: debtToEquityRatio2024, 2023: debtToEquityRatio2023, 2022: debtToEquityRatio2022 },
      revenueCagr: {
        2024: (((baseRevenue2024 / baseRevenue2023) - 1) * 100).toFixed(1) + "%",
        2023: (((baseRevenue2023 / baseRevenue2022) - 1) * 100).toFixed(1) + "%", 
        2022: "38.9%"
      }
    },
    scoreChange
  };
}