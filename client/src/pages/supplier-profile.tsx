import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  type Supplier,
  type FinancialData,
  type Document,
} from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Building, Plus, CheckCircle, XCircle, Eye } from "lucide-react";
import { useState, useRef, useEffect } from "react";

import FinancialScoreCard from "@/components/supplier/financial-score-card";
import TransactionalScoreCard from "@/components/supplier/transactional-score-card";
import AScoreCard from "@/components/supplier/a-score-card";
import BusinessProfile from "@/components/supplier/business-profile";
import FinancialDataTable from "@/components/supplier/financial-data-table";
import { getRandomCompanyData } from "@/lib/randomData";

export default function SupplierProfile() {
  const [location] = useLocation();
  const urlParams = new URLSearchParams(location.split("?")[1] || "");
  const initialSupplierId = urlParams.get("id") || "";

  const [selectedSupplierId, setSelectedSupplierId] =
    useState(initialSupplierId);

  const { data: suppliers } = useQuery<Supplier[]>({
    queryKey: ["/api/suppliers"],
  });

  const { data: supplier, isLoading: supplierLoading } = useQuery<Supplier>({
    queryKey: ["/api/suppliers", selectedSupplierId],
    enabled: !!selectedSupplierId,
  });

  const { data: financialData } = useQuery<FinancialData[]>({
    queryKey: ["/api/suppliers", selectedSupplierId, "financial-data"],
    enabled: !!selectedSupplierId,
  });

  const { data: documents } = useQuery<Document[]>({
    queryKey: ["/api/suppliers", selectedSupplierId, "documents"],
    enabled: !!selectedSupplierId,
  });

  // Get random data for the selected supplier
  const randomData = selectedSupplierId
    ? getRandomCompanyData(selectedSupplierId)
    : null;

  // refs for each section to allow smooth scrolling via navigation bar
  const businessProfileRef = useRef<HTMLDivElement | null>(null);
  const scoreSectionRef = useRef<HTMLDivElement | null>(null);
  const qualificationRef = useRef<HTMLDivElement | null>(null);
  const financialPerformanceSummaryRef = useRef<HTMLDivElement | null>(null);
  const financialTableRef = useRef<HTMLDivElement | null>(null);
  const icTableRef = useRef<HTMLDivElement | null>(null);

  // active tab state for styling the tab menu
  const [activeTab, setActiveTab] = useState<
    | "business"
    | "score"
    | "qualification"
    | "financePerformance"
    | "financialTable"
    | "icTable"
  >("business");

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      // ชดเชยกรณีมี header ติดบน
      window.scrollBy({
        top: -80,
        left: 0,
        behavior: "instant" as ScrollBehavior,
      });
    } else {
      // Retry after a short delay if element not found
      setTimeout(() => {
        const retryEl = document.getElementById(id);
        if (retryEl) {
          retryEl.scrollIntoView({ behavior: "smooth", block: "start" });
          window.scrollBy({
            top: -80,
            left: 0,
            behavior: "instant" as ScrollBehavior,
          });
        }
      }, 100);
    }
  };

  useEffect(() => {
    const applyHash = () => {
      const h = (window.location.hash || "#business").replace("#", "");
      setActiveTab(
        [
          "business",
          "score",
          "qualification",
          "financePerformance",
          "financialTable",
          "icTable",
        ].includes(h as any)
          ? (h as any)
          : "business"
      );
      scrollToId(h);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  useEffect(() => {
    const sections = [
      "business",
      "score",
      "qualification",
      "financePerformance",
      "financialTable",
      "icTable",
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        // หา entry ที่อยู่ใกล้บนสุดและกำลัง intersect
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          )[0];

        if (visible?.target?.id) {
          const id = visible.target.id as typeof activeTab;
          setActiveTab(id);
          // อัปเดต hash แบบไม่ scroll กระตุก
          history.replaceState(null, "", `#${id}`);
        }
      },
      {
        root: null,
        // เริ่ม active เมื่อหัว section เข้า 20% จากบนจอ
        rootMargin: "-20% 0px -70% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  if (supplierLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Supplier Profile</h2>

        {/* Card for selecting the supplier */}
        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Select Supplier
              </h3>
              {/* <Button className="bg-financial-primary hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add New Supplier
              </Button> */}
            </div>
            <Select
              value={selectedSupplierId}
              onValueChange={setSelectedSupplierId}
            >
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Select a supplier..." />
              </SelectTrigger>
              <SelectContent>
                {suppliers?.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.companyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Tab navigation appears below the select card */}
        {selectedSupplierId && (
          <div className="mt-2">
            <nav className="flex border-b border-slate-200">
              <button
                type="button"
                onClick={() => {
                  window.location.hash = "business";
                  scrollToId("business");
                }}
                className={`flex-1 text-center py-2 text-sm font-medium cursor-pointer border-b-2 ${
                  activeTab === "business"
                    ? "border-financial-primary text-financial-primary"
                    : "border-transparent text-slate-600 hover:text-financial-primary"
                }`}
              >
                Business Profile
              </button>
              <button
                type="button"
                onClick={() => {
                  window.location.hash = "score";
                  scrollToId("score");
                }}
                className={`flex-1 text-center py-2 text-sm font-medium cursor-pointer border-b-2 ${
                  activeTab === "score"
                    ? "border-financial-primary text-financial-primary"
                    : "border-transparent text-slate-600 hover:text-financial-primary"
                }`}
              >
                Score
              </button>
              <button
                type="button"
                onClick={() => {
                  window.location.hash = "qualification";
                  scrollToId("qualification");
                }}
                className={`flex-1 text-center py-2 text-sm font-medium cursor-pointer border-b-2 ${
                  activeTab === "qualification"
                    ? "border-financial-primary text-financial-primary"
                    : "border-transparent text-slate-600 hover:text-financial-primary"
                }`}
              >
                Qualification
              </button>
              <button
                type="button"
                onClick={() => {
                  window.location.hash = "financePerformance";
                  scrollToId("financePerformance");
                }}
                className={`flex-1 text-center py-2 text-sm font-medium cursor-pointer border-b-2 ${
                  activeTab === "financePerformance"
                    ? "border-financial-primary text-financial-primary"
                    : "border-transparent text-slate-600 hover:text-financial-primary"
                }`}
              >
                Performance
              </button>
              <button
                type="button"
                onClick={() => {
                  window.location.hash = "financialTable";
                  scrollToId("financialTable");
                }}
                className={`flex-1 text-center py-2 text-sm font-medium cursor-pointer border-b-2 ${
                  activeTab === "financialTable"
                    ? "border-financial-primary text-financial-primary"
                    : "border-transparent text-slate-600 hover:text-financial-primary"
                }`}
              >
                Financial Data
              </button>
              <button
                type="button"
                onClick={() => {
                  window.location.hash = "icTable";
                  scrollToId("icTable");
                }}
                className={`flex-1 text-center py-2 text-sm font-medium cursor-pointer border-b-2 ${
                  activeTab === "icTable"
                    ? "border-financial-primary text-financial-primary"
                    : "border-transparent text-slate-600 hover:text-financial-primary"
                }`}
              >
                IC Table
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Supplier Selection */}

      {selectedSupplierId && supplier ? (
        <>
          {/* Business Profile */}
          <div id="business" ref={businessProfileRef}>
            <BusinessProfile supplier={supplier} randomData={randomData} />
          </div>

          {/* Scoring Cards - combined into a single section */}
          <div
            id="score"
            ref={scoreSectionRef}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch"
          >
            <div className="h-full">
              <AScoreCard
                supplierId={selectedSupplierId}
                documents={documents}
              />
            </div>
            <div className="h-full">
              <FinancialScoreCard
                supplierId={selectedSupplierId}
                supplier={supplier}
                financialData={financialData}
                randomData={randomData}
              />
            </div>
            <div className="h-full">
              <TransactionalScoreCard supplierId={selectedSupplierId} />
            </div>
          </div>

          {/* Qualification Criteria Assessment */}
          <div id="qualification" ref={qualificationRef}>
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Qualification Criteria Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="border border-slate-300 px-4 py-3 text-center text-sm font-semibold">
                          No.
                        </th>
                        <th className="border border-slate-300 px-4 py-3 text-left text-sm font-semibold">
                          Qualification
                        </th>
                        <th className="border border-slate-300 px-4 py-3 text-left text-sm font-semibold">
                          Criteria
                        </th>
                        <th className="border border-slate-300 px-4 py-3 text-center text-sm font-semibold">
                          Result
                        </th>
                        <th className="border border-slate-300 px-4 py-3 text-center text-sm font-semibold">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {randomData?.qualificationResults.map((item, index) => (
                        <tr
                          key={item.no}
                          className={index % 2 === 1 ? "bg-slate-25" : ""}
                        >
                          <td className="border border-slate-300 px-4 py-2 text-sm">
                            {item.no}
                          </td>
                          <td className="border border-slate-300 px-4 py-2 text-sm">
                            {item.qualification}
                          </td>
                          <td className="border border-slate-300 px-4 py-2 text-sm">
                            {item.criteria}
                          </td>
                          <td className="border border-slate-300 px-4 py-2 text-center">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                item.result === "Yes"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {item.result === "Yes" ? "Pass" : "Fail"}
                            </span>
                          </td>
                          <td className="border border-slate-300 px-4 py-2 text-center text-sm">
                            <Button className="bg-financial-primary hover:bg-grey-100">
                              View
                            </Button>
                          </td>
                        </tr>
                      )) ||
                        // Fallback static data if randomData is null
                        Array.from({ length: 11 }, (_, i) => (
                          <tr
                            key={i + 1}
                            className={i % 2 === 1 ? "bg-slate-25" : ""}
                          >
                            <td className="border border-slate-300 px-4 py-2 text-sm">
                              {i + 1}
                            </td>
                            <td className="border border-slate-300 px-4 py-2 text-sm">
                              Loading...
                            </td>
                            <td className="border border-slate-300 px-4 py-2 text-sm">
                              -
                            </td>
                            <td className="border border-slate-300 px-4 py-2 text-center">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                -
                              </span>
                            </td>
                            <td className="border border-slate-300 px-4 py-2 text-center text-sm">
                              -
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                  >
                    Top
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Financial Performance Summary */}
          <div id="financePerformance" ref={financialPerformanceSummaryRef}>
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Financial Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Client Information */}
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-slate-600">Client Name</span>
                        <div className="font-medium">
                          {randomData?.companyName || supplier?.companyName}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-600">Business Unit</span>
                        <div className="font-medium">
                          {randomData?.businessUnit || "Factoring"}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-600">
                          Approval Authority
                        </span>
                        <div className="font-medium">
                          {randomData?.approvalAuthority ||
                            "Executive Committee"}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-600">Business</span>
                        <div className="font-medium">
                          {randomData?.business || "HOME"}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-600">Industry</span>
                        <div className="font-medium">
                          {randomData?.industry || "Growth"}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-600">
                          Registered Capital
                        </span>
                        <div className="font-medium">
                          {randomData?.registeredCapital || 10}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-600">Client Status</span>
                        <div className="font-medium">
                          {randomData?.clientStatus || "Existing Client"}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-600">
                          Additional Credit Line
                        </span>
                        <div className="font-medium">
                          {randomData?.additionalCreditLine || "-"}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-600">Credit Line</span>
                        <div className="font-medium">
                          {randomData?.creditLine || ""}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Financial Performance Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="border border-slate-300 px-3 py-2 text-left">
                            Financial Performance (Last 3 Years) (Million THB)
                          </th>
                          <th className="border border-slate-300 px-3 py-2 text-right">
                            2024
                          </th>
                          <th className="border border-slate-300 px-3 py-2 text-right">
                            2023
                          </th>
                          <th className="border border-slate-300 px-3 py-2 text-right">
                            2022
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(randomData &&
                          (() => {
                            const { financialData: fd } = randomData;
                            const financialRows = [
                              {
                                label: "Sales Revenue",
                                values: [
                                  fd.salesRevenue[2024],
                                  fd.salesRevenue[2023],
                                  fd.salesRevenue[2022],
                                ],
                              },
                              {
                                label: "Cost of Sales",
                                values: [
                                  fd.costOfSales[2024],
                                  fd.costOfSales[2023],
                                  fd.costOfSales[2022],
                                ],
                              },
                              {
                                label: "Gross Profit",
                                values: [
                                  fd.grossProfit[2024],
                                  fd.grossProfit[2023],
                                  fd.grossProfit[2022],
                                ],
                              },
                              {
                                label: "OPEX",
                                values: [
                                  fd.opex[2024],
                                  fd.opex[2023],
                                  fd.opex[2022],
                                ],
                              },
                              {
                                label: "Operating Profit",
                                values: [
                                  fd.operatingProfit[2024],
                                  fd.operatingProfit[2023],
                                  fd.operatingProfit[2022],
                                ],
                              },
                              {
                                label: "EBITDA",
                                values: [
                                  fd.ebitda[2024],
                                  fd.ebitda[2023],
                                  fd.ebitda[2022],
                                ],
                              },
                              {
                                label: "Depreciation and amortization",
                                values: ["-", "-", "-"],
                                isStatic: true,
                              },
                              {
                                label: "Interest",
                                values: [
                                  fd.interest[2024],
                                  fd.interest[2023],
                                  fd.interest[2022],
                                ],
                              },
                              {
                                label: "Taxes",
                                values: [
                                  fd.taxes[2024],
                                  fd.taxes[2023],
                                  fd.taxes[2022],
                                ],
                              },
                              {
                                label: "Net Profit (Loss)",
                                values: [
                                  fd.netProfit[2024],
                                  fd.netProfit[2023],
                                  fd.netProfit[2022],
                                ],
                                colorCode: true,
                              },
                              {
                                label: "Current Assets",
                                values: [
                                  fd.currentAssets[2024],
                                  fd.currentAssets[2023],
                                  fd.currentAssets[2022],
                                ],
                              },
                              {
                                label: "Total Assets",
                                values: [
                                  fd.totalAssets[2024],
                                  fd.totalAssets[2023],
                                  fd.totalAssets[2022],
                                ],
                              },
                              {
                                label: "Debt Principle Payment",
                                values: [
                                  fd.debtPrinciplePayment[2024],
                                  fd.debtPrinciplePayment[2023],
                                  fd.debtPrinciplePayment[2022],
                                ],
                              },
                              {
                                label: "Current Liabilities",
                                values: [
                                  fd.currentLiabilities[2024],
                                  fd.currentLiabilities[2023],
                                  fd.currentLiabilities[2022],
                                ],
                              },
                              {
                                label: "Total Liabilities",
                                values: [
                                  fd.totalLiabilities[2024],
                                  fd.totalLiabilities[2023],
                                  fd.totalLiabilities[2022],
                                ],
                              },
                              {
                                label: "Retained Earning",
                                values: [
                                  fd.retainedEarning[2024],
                                  fd.retainedEarning[2023],
                                  fd.retainedEarning[2022],
                                ],
                              },
                              {
                                label: "Shareholders' Equity",
                                values: [
                                  fd.shareholdersEquity[2024],
                                  fd.shareholdersEquity[2023],
                                  fd.shareholdersEquity[2022],
                                ],
                              },
                              {
                                label: "Gross Margin (%)",
                                values: [
                                  fd.grossMargin[2024],
                                  fd.grossMargin[2023],
                                  fd.grossMargin[2022],
                                ],
                                isStatic: true,
                              },
                              {
                                label: "Net Profit (%)",
                                values: [
                                  fd.netProfitMargin[2024],
                                  fd.netProfitMargin[2023],
                                  fd.netProfitMargin[2022],
                                ],
                                colorCode: true,
                                isStatic: true,
                              },
                              {
                                label: "Current Ratio (times)",
                                values: [
                                  fd.currentRatio[2024],
                                  fd.currentRatio[2023],
                                  fd.currentRatio[2022],
                                ],
                              },
                              {
                                label: "DSCR",
                                values: [
                                  fd.dscr[2024],
                                  fd.dscr[2023],
                                  fd.dscr[2022],
                                ],
                                colorCode: true,
                              },
                              {
                                label: "Interest Coverage Ratio",
                                values: [
                                  fd.interestCoverageRatio[2024],
                                  fd.interestCoverageRatio[2023],
                                  fd.interestCoverageRatio[2022],
                                ],
                                colorCode: true,
                              },
                              {
                                label: "Debt-to-Equity Ratio (D/E) (times)",
                                values: [
                                  fd.debtToEquityRatio[2024],
                                  fd.debtToEquityRatio[2023],
                                  fd.debtToEquityRatio[2022],
                                ],
                                colorCode: true,
                              },
                              {
                                label: "Revenue CAGR",
                                values: [
                                  fd.revenueCagr[2024],
                                  fd.revenueCagr[2023],
                                  fd.revenueCagr[2022],
                                ],
                                colorCode: true,
                                isStatic: true,
                              },
                            ];

                            return financialRows.map((row, index) => (
                              <tr
                                key={row.label}
                                className={index % 2 === 1 ? "bg-slate-25" : ""}
                              >
                                <td className="border border-slate-300 px-3 py-2">
                                  {row.label}
                                </td>
                                {row.values.map((value, i) => {
                                  const numValue =
                                    typeof value === "number"
                                      ? value
                                      : parseFloat(String(value));
                                  const displayValue = row.isStatic
                                    ? value
                                    : typeof value === "number"
                                    ? value.toFixed(2)
                                    : value;
                                  let textColor = "";

                                  if (
                                    row.colorCode &&
                                    typeof value !== "string"
                                  ) {
                                    if (
                                      row.label === "Net Profit (Loss)" ||
                                      row.label === "Net Profit (%)"
                                    ) {
                                      textColor =
                                        numValue >= 0
                                          ? "text-green-600"
                                          : "text-red-600";
                                    } else if (row.label === "DSCR") {
                                      textColor =
                                        numValue >= 1.2
                                          ? "text-green-600"
                                          : "text-red-600";
                                    } else if (
                                      row.label === "Interest Coverage Ratio"
                                    ) {
                                      textColor =
                                        numValue > 1
                                          ? "text-green-600"
                                          : "text-red-600";
                                    } else if (
                                      row.label ===
                                      "Debt-to-Equity Ratio (D/E) (times)"
                                    ) {
                                      textColor =
                                        numValue <= 4
                                          ? "text-green-600"
                                          : "text-red-600";
                                    } else if (
                                      row.label === "Revenue CAGR" &&
                                      typeof value === "string"
                                    ) {
                                      textColor = value.includes("-")
                                        ? "text-red-600"
                                        : "text-green-600";
                                    }
                                  }

                                  return (
                                    <td
                                      key={i}
                                      className={`border border-slate-300 px-3 py-2 text-right ${textColor}`}
                                    >
                                      {displayValue}
                                    </td>
                                  );
                                })}
                              </tr>
                            ));
                          })()) || (
                          // Fallback for no data
                          <tr>
                            <td
                              colSpan="4"
                              className="border border-slate-300 px-3 py-2 text-center text-gray-500"
                            >
                              No financial data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                  >
                    Top
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Financial Data Table */}
          <div id="financialTable" ref={financialTableRef}>
            <FinancialDataTable
              financialData={financialData || []}
              isLoading={!financialData}
            />
          </div>

          <div id="icTable" ref={icTableRef}>
            {/* Income Statement Detailed Table */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Income Statement (IC) - Detailed Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-slate-700">
                          Income Statement Item
                        </th>
                        {financialData
                          ?.sort((a, b) => a.year - b.year)
                          .map((data) => (
                            <th
                              key={data.year}
                              className="px-4 py-3 text-right font-medium text-slate-700"
                            >
                              {data.year}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="px-4 py-3 text-slate-700 font-medium">
                          Net Sales
                        </td>
                        {financialData
                          ?.sort((a, b) => a.year - b.year)
                          .map((data) => (
                            <td
                              key={data.year}
                              className="px-4 py-3 text-right font-medium"
                            >
                              {(
                                parseFloat(data.netSales || data.salesRevenue) /
                                1000000
                              ).toFixed(1)}
                              M
                            </td>
                          ))}
                      </tr>
                      <tr className="bg-slate-25">
                        <td className="px-4 py-3 text-slate-700">
                          Total Other Income
                        </td>
                        {financialData
                          ?.sort((a, b) => a.year - b.year)
                          .map((data) => (
                            <td
                              key={data.year}
                              className="px-4 py-3 text-right"
                            >
                              {(
                                parseFloat(data.totalOtherIncome || "0") /
                                1000000
                              ).toFixed(1)}
                              M
                            </td>
                          ))}
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-slate-700 font-medium">
                          Total Revenue
                        </td>
                        {financialData
                          ?.sort((a, b) => a.year - b.year)
                          .map((data) => (
                            <td
                              key={data.year}
                              className="px-4 py-3 text-right font-medium"
                            >
                              {(
                                parseFloat(
                                  data.totalRevenue || data.salesRevenue
                                ) / 1000000
                              ).toFixed(1)}
                              M
                            </td>
                          ))}
                      </tr>
                      <tr className="bg-slate-25">
                        <td className="px-4 py-3 text-slate-700">
                          Cost of Sales/Services
                        </td>
                        {financialData
                          ?.sort((a, b) => a.year - b.year)
                          .map((data) => (
                            <td
                              key={data.year}
                              className="px-4 py-3 text-right"
                            >
                              {(
                                parseFloat(
                                  data.costOfSalesServices ||
                                    data.costOfGoodsSold
                                ) / 1000000
                              ).toFixed(1)}
                              M
                            </td>
                          ))}
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-slate-700 font-medium">
                          Gross Profit (Loss)
                        </td>
                        {financialData
                          ?.sort((a, b) => a.year - b.year)
                          .map((data) => {
                            const grossProfit = parseFloat(
                              data.grossProfitLoss || data.grossProfit
                            );
                            return (
                              <td
                                key={data.year}
                                className={`px-4 py-3 text-right font-medium ${
                                  grossProfit > 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {(grossProfit / 1000000).toFixed(1)}M
                              </td>
                            );
                          })}
                      </tr>
                      <tr className="bg-slate-25">
                        <td className="px-4 py-3 text-slate-700">
                          Total Operating Expenses
                        </td>
                        {financialData
                          ?.sort((a, b) => a.year - b.year)
                          .map((data) => (
                            <td
                              key={data.year}
                              className="px-4 py-3 text-right"
                            >
                              {(
                                parseFloat(data.totalOperatingExpenses || "0") /
                                1000000
                              ).toFixed(1)}
                              M
                            </td>
                          ))}
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-slate-700">
                          Operating Income (Loss)
                        </td>
                        {financialData
                          ?.sort((a, b) => a.year - b.year)
                          .map((data) => {
                            const operatingIncome = parseFloat(
                              data.operatingIncomeLoss || "0"
                            );
                            return (
                              <td
                                key={data.year}
                                className={`px-4 py-3 text-right ${
                                  operatingIncome > 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {(operatingIncome / 1000000).toFixed(1)}M
                              </td>
                            );
                          })}
                      </tr>
                      <tr className="bg-slate-25">
                        <td className="px-4 py-3 text-slate-700">
                          Other Expenses
                        </td>
                        {financialData
                          ?.sort((a, b) => a.year - b.year)
                          .map((data) => (
                            <td
                              key={data.year}
                              className="px-4 py-3 text-right"
                            >
                              {(
                                parseFloat(data.otherExpenses || "0") / 1000000
                              ).toFixed(1)}
                              M
                            </td>
                          ))}
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-slate-700">
                          Income (Loss) Before Depreciation and Amortization
                        </td>
                        {financialData
                          ?.sort((a, b) => a.year - b.year)
                          .map((data) => {
                            const incomeBeforeDA = parseFloat(
                              data.incomeBeforeDepreciationAmortization || "0"
                            );
                            return (
                              <td
                                key={data.year}
                                className={`px-4 py-3 text-right ${
                                  incomeBeforeDA > 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {(incomeBeforeDA / 1000000).toFixed(1)}M
                              </td>
                            );
                          })}
                      </tr>
                      <tr className="bg-slate-25">
                        <td className="px-4 py-3 text-slate-700">
                          Income (Loss) Before Interest and Income Taxes
                        </td>
                        {financialData
                          ?.sort((a, b) => a.year - b.year)
                          .map((data) => {
                            const incomeBeforeIT = parseFloat(
                              data.incomeBeforeInterestIncomeTaxes || "0"
                            );
                            return (
                              <td
                                key={data.year}
                                className={`px-4 py-3 text-right ${
                                  incomeBeforeIT > 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {(incomeBeforeIT / 1000000).toFixed(1)}M
                              </td>
                            );
                          })}
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-slate-700">
                          Interest Expenses
                        </td>
                        {financialData
                          ?.sort((a, b) => a.year - b.year)
                          .map((data) => (
                            <td
                              key={data.year}
                              className="px-4 py-3 text-right"
                            >
                              {(
                                parseFloat(
                                  data.interestExpenses || data.interestExpense
                                ) / 1000000
                              ).toFixed(1)}
                              M
                            </td>
                          ))}
                      </tr>
                      <tr className="bg-slate-25">
                        <td className="px-4 py-3 text-slate-700">
                          Income Taxes
                        </td>
                        {financialData
                          ?.sort((a, b) => a.year - b.year)
                          .map((data) => (
                            <td
                              key={data.year}
                              className="px-4 py-3 text-right"
                            >
                              {(
                                parseFloat(data.incomeTaxes || "0") / 1000000
                              ).toFixed(1)}
                              M
                            </td>
                          ))}
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-slate-700">
                          Extraordinary Items
                        </td>
                        {financialData
                          ?.sort((a, b) => a.year - b.year)
                          .map((data) => (
                            <td
                              key={data.year}
                              className="px-4 py-3 text-right"
                            >
                              {(
                                parseFloat(data.extraordinaryItems || "0") /
                                1000000
                              ).toFixed(1)}
                              M
                            </td>
                          ))}
                      </tr>
                      <tr className="bg-slate-25">
                        <td className="px-4 py-3 text-slate-700">Others</td>
                        {financialData
                          ?.sort((a, b) => a.year - b.year)
                          .map((data) => (
                            <td
                              key={data.year}
                              className="px-4 py-3 text-right"
                            >
                              {(
                                parseFloat(data.othersIncomeStatement || "0") /
                                1000000
                              ).toFixed(1)}
                              M
                            </td>
                          ))}
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-slate-700 font-bold">
                          Net Income (Loss)
                        </td>
                        {financialData
                          ?.sort((a, b) => a.year - b.year)
                          .map((data) => {
                            const netIncome = parseFloat(
                              data.netIncomeLoss || data.netIncome
                            );
                            return (
                              <td
                                key={data.year}
                                className={`px-4 py-3 text-right font-bold ${
                                  netIncome > 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {(netIncome / 1000000).toFixed(1)}M
                              </td>
                            );
                          })}
                      </tr>
                      <tr className="bg-slate-25">
                        <td className="px-4 py-3 text-slate-700">
                          Earnings (Loss) per Share
                        </td>
                        {financialData
                          ?.sort((a, b) => a.year - b.year)
                          .map((data) => {
                            const eps = parseFloat(
                              data.earningsLossPerShare || "0"
                            );
                            return (
                              <td
                                key={data.year}
                                className={`px-4 py-3 text-right ${
                                  eps > 0 ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {eps.toFixed(2)}
                              </td>
                            );
                          })}
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-slate-700">
                          Number of Weighted Average Ordinary Shares
                        </td>
                        {financialData
                          ?.sort((a, b) => a.year - b.year)
                          .map((data) => (
                            <td
                              key={data.year}
                              className="px-4 py-3 text-right"
                            >
                              {parseInt(
                                data.numberOfWeightedAverageOrdinaryShares ||
                                  "0"
                              ).toLocaleString()}
                            </td>
                          ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                  >
                    Top
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <Card className="border-slate-200">
          <CardContent className="p-12 text-center">
            <Building className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No Supplier Selected
            </h3>
            <p className="text-slate-600">
              Please select a supplier to view their profile and scoring
              information.
            </p>
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Top
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
