import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type Supplier, type FinancialData, type Score } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Calculator } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { type RandomCompanyData } from "@/lib/randomData";

interface FinancialScoreCardProps {
  supplierId: string;
  supplier: Supplier;
  financialData?: FinancialData[];
  randomData?: RandomCompanyData;
}

export default function FinancialScoreCard({
  supplierId,
  supplier,
  financialData,
  randomData,
}: FinancialScoreCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [score, setScore] = useState<Score | null>(null);

  const calculateScoreMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest(
        "POST",
        `/api/suppliers/${supplierId}/calculate-score`
      );
      return await response.json();
    },
    onSuccess: (data) => {
      setScore(data);
      queryClient.invalidateQueries({
        queryKey: ["/api/suppliers", supplierId, "score"],
      });
      toast({
        title: "Score Calculated",
        description: "Financial score has been successfully calculated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to calculate financial score.",
        variant: "destructive",
      });
    },
  });

  const latestFinancial = financialData?.sort((a, b) => b.year - a.year)[0];

  const getGradeBadge = (grade: string) => {
    const gradeColors: Record<string, string> = {
      AAA: "bg-green-100 text-green-800",
      AA: "bg-green-100 text-green-800",
      A: "bg-green-100 text-green-800",
      "B+": "bg-blue-100 text-blue-800",
      B: "bg-blue-100 text-blue-800",
      "C+": "bg-yellow-100 text-yellow-800",
      C: "bg-yellow-100 text-yellow-800",
      "D+": "bg-orange-100 text-orange-800",
      D: "bg-orange-100 text-orange-800",
      F: "bg-red-100 text-red-800",
    };

    return (
      <Badge
        className={`${
          gradeColors[grade] || "bg-slate-100 text-slate-800"
        } hover:${gradeColors[grade] || "bg-slate-100"}`}
      >
        {grade}
      </Badge>
    );
  };

  const checkCriteria = () => {
    if (!supplier || !latestFinancial) return [];

    const revenue = parseFloat(latestFinancial.salesRevenue);
    const deRatio =
      parseFloat(latestFinancial.totalDebt) /
      parseFloat(latestFinancial.totalEquity);
    const currentRatio =
      parseFloat(latestFinancial.currentAssets) /
      parseFloat(latestFinancial.currentLiabilities);
    const netIncome = parseFloat(latestFinancial.netIncome);

    return [
      {
        label: "Entity Type",
        value: supplier.registrationType,
        status: ["PLC", "Ltd", "LP"].includes(supplier.registrationType),
      },
      {
        label: "VAT Registration",
        value: supplier.vatRegistered ? "Registered ✓" : "Not Registered",
        status: supplier.vatRegistered,
      },
      {
        label: "Years of Operation",
        value: `${supplier.yearsOfOperation} years`,
        status: supplier.yearsOfOperation >= 2,
      },
      {
        label: "Sales Revenue",
        value: `${(revenue / 1000000).toFixed(1)}M THB`,
        status: revenue > 30000000,
      },
      {
        label: "Profitability",
        value: netIncome > 0 ? "Profitable ✓" : "Loss",
        status: netIncome > 0,
      },
      {
        label: "D/E Ratio",
        value: `${deRatio.toFixed(1)}x`,
        status: deRatio <= 4,
      },
      {
        label: "Current Ratio",
        value: `${currentRatio.toFixed(1)}x`,
        status: currentRatio > 1,
      },
    ];
  };

  const criteria = checkCriteria();

  return (
    <Card className="border-slate-200  h-full flex flex-col">
      <CardHeader>
        <CardTitle>F-Score</CardTitle>
      </CardHeader>
      <CardContent>
        {randomData ? (
          <>
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-4 mb-2">
                <div
                  className={`text-4xl font-bold px-3 py-1 rounded-lg ${(() => {
                    const gradeColors: Record<string, string> = {
                      AAA: "bg-green-100 text-green-800",
                      AA: "bg-green-100 text-green-800",
                      A: "bg-green-100 text-green-800",
                      "B+": "bg-yellow-100 text-yellow-800",
                      B: "bg-yellow-100 text-yellow-800",
                      "C+": "bg-yellow-100 text-yellow-800",
                      C: "bg-yellow-100 text-yellow-800",
                      "D+": "bg-yellow-100 text-yellow-800",
                      D: "bg-yellow-100 text-yellow-800",
                      F: "bg-red-100 text-red-800",
                    };
                    return (
                      gradeColors[randomData.financialGrade] ||
                      "bg-slate-100 text-slate-800"
                    );
                  })()}`}
                >
                  {randomData.financialGrade}
                </div>
                <div className="text-4xl font-bold text-financial-primary">
                  {randomData.qualificationTotalScore}%
                </div>
              </div>
              <div
                className={`text-sm font-medium ${(() => {
                  const score = randomData.qualificationTotalScore;
                  if (score >= 80) return "text-green-600";
                  if (score >= 31) return "text-yellow-600";
                  return "text-red-600";
                })()}`}
              >
                {(() => {
                  const score = randomData.qualificationTotalScore;
                  if (score >= 80) return "Pass";
                  if (score >= 31) return "Pending";
                  return "Not Pass";
                })()}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <Calculator className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">Financial score loading...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
