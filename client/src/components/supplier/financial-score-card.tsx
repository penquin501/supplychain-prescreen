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
  randomData 
}: FinancialScoreCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [score, setScore] = useState<Score | null>(null);

  const calculateScoreMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/suppliers/${supplierId}/calculate-score`);
      return await response.json();
    },
    onSuccess: (data) => {
      setScore(data);
      queryClient.invalidateQueries({ queryKey: ["/api/suppliers", supplierId, "score"] });
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
      'AAA': 'bg-green-100 text-green-800',
      'AA': 'bg-green-100 text-green-800',
      'A': 'bg-green-100 text-green-800',
      'B+': 'bg-blue-100 text-blue-800',
      'B': 'bg-blue-100 text-blue-800',
      'C+': 'bg-yellow-100 text-yellow-800',
      'C': 'bg-yellow-100 text-yellow-800',
      'D+': 'bg-orange-100 text-orange-800',
      'D': 'bg-orange-100 text-orange-800',
      'F': 'bg-red-100 text-red-800',
    };
    
    return (
      <Badge className={`${gradeColors[grade] || 'bg-slate-100 text-slate-800'} hover:${gradeColors[grade] || 'bg-slate-100'}`}>
        {grade}
      </Badge>
    );
  };

  const checkCriteria = () => {
    if (!supplier || !latestFinancial) return [];

    const revenue = parseFloat(latestFinancial.salesRevenue);
    const deRatio = parseFloat(latestFinancial.totalDebt) / parseFloat(latestFinancial.totalEquity);
    const currentRatio = parseFloat(latestFinancial.currentAssets) / parseFloat(latestFinancial.currentLiabilities);
    const netIncome = parseFloat(latestFinancial.netIncome);

    return [
      {
        label: "Entity Type",
        value: supplier.registrationType,
        status: ['PLC', 'Ltd', 'LP'].includes(supplier.registrationType),
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
    <Card className="border-slate-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Financial Score</CardTitle>
          {score ? getGradeBadge(score.financialGrade) : (
            <Button
              size="sm"
              onClick={() => calculateScoreMutation.mutate()}
              disabled={calculateScoreMutation.isPending}
              className="bg-financial-primary hover:bg-blue-700"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Calculate
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {randomData ? (
          <>
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-financial-primary mb-2">
                {randomData.qualificationTotalScore}%
              </div>
              <div className="text-lg font-semibold mb-1">
                {getGradeBadge(randomData.financialGrade)}
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="text-xs text-slate-500 mb-3">Based on qualification criteria scoring:</div>
              {randomData.qualificationResults.slice(0, 8).map((criterion) => (
                <div key={criterion.no} className="flex justify-between">
                  <span className="text-slate-600">{criterion.qualification}:</span>
                  <span className={`font-medium ${criterion.result === 'Yes' ? 'text-green-600' : 'text-red-600'}`}>
                    {criterion.result} ({criterion.weight})
                  </span>
                </div>
              ))}
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
