import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { type Supplier, type Score } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, TriangleAlert, InfoIcon, Clock } from "lucide-react";
import { useState } from "react";

import CreditScoreCircle from "@/components/credit/credit-score-circle";

export default function CreditReport() {
  const [location] = useLocation();
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const initialSupplierId = urlParams.get('id') || '';
  
  const [selectedSupplierId, setSelectedSupplierId] = useState(initialSupplierId);

  const { data: suppliers } = useQuery<Supplier[]>({
    queryKey: ["/api/suppliers"],
  });

  const { data: supplier } = useQuery<Supplier>({
    queryKey: ["/api/suppliers", selectedSupplierId],
    enabled: !!selectedSupplierId,
  });

  const { data: score } = useQuery<Score>({
    queryKey: ["/api/suppliers", selectedSupplierId, "score"],
    enabled: !!selectedSupplierId,
  });

  const getRecommendationStatus = (recommendation: string) => {
    switch (recommendation) {
      case "approved":
        return {
          text: "Recommended for Approval",
          className: "bg-green-100 text-green-800",
          icon: <CheckCircle className="h-4 w-4" />
        };
      case "pending":
        return {
          text: "Conditional Approval",
          className: "bg-yellow-100 text-yellow-800",
          icon: <Clock className="h-4 w-4" />
        };
      case "rejected":
        return {
          text: "Not Recommended",
          className: "bg-red-100 text-red-800",
          icon: <TriangleAlert className="h-4 w-4" />
        };
      default:
        return {
          text: "Under Review",
          className: "bg-slate-100 text-slate-800",
          icon: <InfoIcon className="h-4 w-4" />
        };
    }
  };

  const getCreditStanding = (score: number) => {
    if (score >= 85) return "Excellent Credit Standing";
    if (score >= 75) return "Good Credit Standing";
    if (score >= 65) return "Fair Credit Standing";
    if (score >= 55) return "Poor Credit Standing";
    return "Very Poor Credit Standing";
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Credit Report</h2>
        <p className="text-slate-600 mt-1">Comprehensive credit assessment combining all scoring models</p>
      </div>

      {/* Supplier Selection */}
      <Card className="border-slate-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Select Supplier</h3>
          <Select value={selectedSupplierId} onValueChange={setSelectedSupplierId}>
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

      {selectedSupplierId && score ? (
        <>
          {/* Overall Credit Score */}
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Overall Credit Score (Average %)</h3>
                <CreditScoreCircle score={parseFloat(score.overallCreditScore)} />
                <div className="text-sm text-slate-500 mb-2 mt-2">
                  ({score.financialScore}% + {score.transactionalScore}% + {score.aScore}%) ÷ 3 = {score.overallCreditScore}%
                </div>
                <div className="text-lg font-medium text-slate-900 mb-2">
                  {getCreditStanding(parseFloat(score.overallCreditScore))}
                </div>
                <Badge className={getRecommendationStatus(score.recommendation).className}>
                  <span className="flex items-center gap-1">
                    {getRecommendationStatus(score.recommendation).icon}
                    {getRecommendationStatus(score.recommendation).text}
                  </span>
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Score Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-slate-900">Financial Score</h4>
                  <span className="text-2xl font-bold text-financial-primary">{score.financialScore}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${score.financialScore}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Grade: {score.financialGrade}</span>
                  <span className="text-slate-600">Weight: 33.3%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-slate-900">Transactional Score</h4>
                  <span className="text-2xl font-bold text-financial-primary">{score.transactionalScore}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
                  <div 
                    className="bg-blue-500 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${score.transactionalScore}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Transaction Analysis</span>
                  <span className="text-slate-600">Weight: 33.3%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-slate-900">A-Score</h4>
                  <span className="text-2xl font-bold text-financial-warning">{score.aScore}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
                  <div 
                    className="bg-yellow-500 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${score.aScore}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Documents</span>
                  <span className="text-slate-600">Weight: 33.3%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Assessment */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-slate-900 mb-3">Strengths</h4>
                  <ul className="space-y-2 text-sm">
                    {parseFloat(score.financialScore) >= 70 && (
                      <li className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Strong financial performance ({score.financialGrade} grade)
                      </li>
                    )}
                    {supplier?.vatRegistered && (
                      <li className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        VAT registered and established entity
                      </li>
                    )}
                    {supplier?.yearsOfOperation && supplier.yearsOfOperation >= 2 && (
                      <li className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Established business ({supplier.yearsOfOperation} years of operation)
                      </li>
                    )}
                    {parseFloat(score.transactionalScore) >= 70 && (
                      <li className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Good transaction history
                      </li>
                    )}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 mb-3">Areas of Concern</h4>
                  <ul className="space-y-2 text-sm">
                    {parseFloat(score.aScore) < 80 && (
                      <li className="flex items-center text-yellow-600">
                        <TriangleAlert className="h-4 w-4 mr-2" />
                        Incomplete documentation ({score.aScore}% complete)
                      </li>
                    )}
                    {parseFloat(score.financialScore) < 70 && (
                      <li className="flex items-center text-red-600">
                        <TriangleAlert className="h-4 w-4 mr-2" />
                        Below minimum financial requirements
                      </li>
                    )}
                    {parseFloat(score.transactionalScore) < 60 && (
                      <li className="flex items-center text-yellow-600">
                        <TriangleAlert className="h-4 w-4 mr-2" />
                        Limited transaction history
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendation */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Recommendation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${
                  score.recommendation === 'approved' ? 'bg-green-100' :
                  score.recommendation === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                }`}>
                  <Clock className={`text-xl ${
                    score.recommendation === 'approved' ? 'text-green-600' :
                    score.recommendation === 'pending' ? 'text-yellow-600' : 'text-red-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900 mb-2">
                    {getRecommendationStatus(score.recommendation).text}
                  </h4>
                  <p className="text-slate-600 mb-4">
                    {score.recommendation === 'approved' 
                      ? "The supplier meets all requirements and demonstrates strong financial performance. Recommended for immediate approval."
                      : score.recommendation === 'pending'
                      ? "While the supplier shows potential, some criteria require attention before final approval."
                      : "The supplier does not meet minimum requirements for approval at this time."
                    }
                  </p>
                  <div className={`border rounded-lg p-4 ${
                    score.recommendation === 'approved' ? 'bg-green-50 border-green-200' :
                    score.recommendation === 'pending' ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'
                  }`}>
                    <h5 className={`font-medium mb-2 ${
                      score.recommendation === 'approved' ? 'text-green-800' :
                      score.recommendation === 'pending' ? 'text-yellow-800' : 'text-red-800'
                    }`}>
                      Next Steps:
                    </h5>
                    <ul className={`text-sm space-y-1 ${
                      score.recommendation === 'approved' ? 'text-green-700' :
                      score.recommendation === 'pending' ? 'text-yellow-700' : 'text-red-700'
                    }`}>
                      {score.recommendation === 'approved' ? (
                        <>
                          <li>• Proceed with supplier onboarding</li>
                          <li>• Set appropriate credit limits</li>
                          <li>• Schedule regular performance reviews</li>
                        </>
                      ) : score.recommendation === 'pending' ? (
                        <>
                          <li>• Request completion of remaining documents</li>
                          <li>• Verify financial statements with auditor confirmation</li>
                          <li>• Review payment history with other buyers</li>
                          <li>• Set conditional credit limit based on improvements</li>
                        </>
                      ) : (
                        <>
                          <li>• Request updated financial statements</li>
                          <li>• Require business improvement plan</li>
                          <li>• Consider re-evaluation in 6-12 months</li>
                          <li>• Recommend alternative financing options</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : selectedSupplierId ? (
        <Card className="border-slate-200">
          <CardContent className="p-12 text-center">
            <TriangleAlert className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">Score Not Available</h3>
            <p className="text-slate-600 mb-4">
              Credit score has not been calculated for this supplier yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-slate-200">
          <CardContent className="p-12 text-center">
            <InfoIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No Supplier Selected</h3>
            <p className="text-slate-600">Please select a supplier to view their credit report.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
