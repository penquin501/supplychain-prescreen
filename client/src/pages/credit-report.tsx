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
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Overall Credit Score</h3>
                <CreditScoreCircle score={parseFloat(score.overallCreditScore)} />
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
                  <span className={`text-2xl font-bold ${
                    parseInt(score.financialScore) >= 80 ? 'text-green-600' : 
                    parseInt(score.financialScore) >= 31 ? 'text-yellow-600' : 
                    'text-red-600'
                  }`}>{score.financialScore}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      parseInt(score.financialScore) >= 80 ? 'bg-green-500' : 
                      parseInt(score.financialScore) >= 31 ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`}
                    style={{ width: `${score.financialScore}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Grade: {score.financialGrade}</span>
                  <span className="text-slate-600">Weight: 33.3%</span>
                </div>
                <div className={`text-center text-sm font-medium mt-2 ${
                  parseInt(score.financialScore) >= 80 ? 'text-green-600' : 
                  parseInt(score.financialScore) >= 31 ? 'text-yellow-600' : 
                  'text-red-600'
                }`}>
                  {parseInt(score.financialScore) >= 80 ? 'Pass' : parseInt(score.financialScore) >= 31 ? 'Pending' : 'Not Pass'}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-slate-900">Transactional Score</h4>
                  <span className={`text-2xl font-bold ${
                    parseInt(score.transactionalScore) >= 80 ? 'text-green-600' : 
                    parseInt(score.transactionalScore) >= 31 ? 'text-yellow-600' : 
                    'text-red-600'
                  }`}>{score.transactionalScore}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      parseInt(score.transactionalScore) >= 80 ? 'bg-green-500' : 
                      parseInt(score.transactionalScore) >= 31 ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`}
                    style={{ width: `${score.transactionalScore}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Transaction Analysis</span>
                  <span className="text-slate-600">Weight: 33.3%</span>
                </div>
                <div className={`text-center text-sm font-medium mt-2 ${
                  parseInt(score.transactionalScore) >= 80 ? 'text-green-600' : 
                  parseInt(score.transactionalScore) >= 31 ? 'text-yellow-600' : 
                  'text-red-600'
                }`}>
                  {parseInt(score.transactionalScore) >= 80 ? 'Pass' : parseInt(score.transactionalScore) >= 31 ? 'Pending' : 'Not Pass'}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-slate-900">A-Score</h4>
                  <span className={`text-2xl font-bold ${
                    parseInt(score.aScore) >= 80 ? 'text-green-600' : 
                    parseInt(score.aScore) >= 31 ? 'text-yellow-600' : 
                    'text-red-600'
                  }`}>{score.aScore}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      parseInt(score.aScore) >= 80 ? 'bg-green-500' : 
                      parseInt(score.aScore) >= 31 ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`}
                    style={{ width: `${score.aScore}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Documents</span>
                  <span className="text-slate-600">Weight: 33.3%</span>
                </div>
                <div className={`text-center text-sm font-medium mt-2 ${
                  parseInt(score.aScore) >= 80 ? 'text-green-600' : 
                  parseInt(score.aScore) >= 31 ? 'text-yellow-600' : 
                  'text-red-600'
                }`}>
                  {parseInt(score.aScore) >= 80 ? 'Pass' : parseInt(score.aScore) >= 31 ? 'Pending' : 'Not Pass'}
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

          {/* Qualification Criteria Table */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Qualification Criteria Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="border border-slate-300 px-4 py-3 text-left text-sm font-semibold">Qualification</th>
                      <th className="border border-slate-300 px-4 py-3 text-left text-sm font-semibold">Criteria</th>
                      <th className="border border-slate-300 px-4 py-3 text-center text-sm font-semibold">Result</th>
                      <th className="border border-slate-300 px-4 py-3 text-center text-sm font-semibold">Weight</th>
                      <th className="border border-slate-300 px-4 py-3 text-center text-sm font-semibold">Scoring</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 px-4 py-2 text-sm">1. Registered Entity</td>
                      <td className="border border-slate-300 px-4 py-2 text-sm">Public Company (PLC) / Limited Company (Ltd.) / Limited Partnership (LP)</td>
                      <td className="border border-slate-300 px-4 py-2 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Yes
                        </span>
                      </td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">5.00%</td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">0.05</td>
                    </tr>
                    <tr className="bg-slate-25">
                      <td className="border border-slate-300 px-4 py-2 text-sm">2. Registered in the VAT System</td>
                      <td className="border border-slate-300 px-4 py-2 text-sm">Registered for VAT</td>
                      <td className="border border-slate-300 px-4 py-2 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Yes
                        </span>
                      </td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">5.00%</td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">0.05</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 px-4 py-2 text-sm">3. Years of Operation</td>
                      <td className="border border-slate-300 px-4 py-2 text-sm">In business for at least 2 years</td>
                      <td className="border border-slate-300 px-4 py-2 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Yes
                        </span>
                      </td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">5.00%</td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">0.05</td>
                    </tr>
                    <tr className="bg-slate-25">
                      <td className="border border-slate-300 px-4 py-2 text-sm">4. Sales Revenue</td>
                      <td className="border border-slate-300 px-4 py-2 text-sm">&gt; 30 million THB</td>
                      <td className="border border-slate-300 px-4 py-2 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Yes
                        </span>
                      </td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">5.00%</td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">0.05</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 px-4 py-2 text-sm">5. Credit Term</td>
                      <td className="border border-slate-300 px-4 py-2 text-sm">≤ 180 days</td>
                      <td className="border border-slate-300 px-4 py-2 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Yes
                        </span>
                      </td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">5.00%</td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">0.05</td>
                    </tr>
                    <tr className="bg-slate-25">
                      <td className="border border-slate-300 px-4 py-2 text-sm">6. Business Performance</td>
                      <td className="border border-slate-300 px-4 py-2 text-sm">Profitable in the latest year or in 2 of the last 3 years</td>
                      <td className="border border-slate-300 px-4 py-2 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          No
                        </span>
                      </td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">5.00%</td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">0.00</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 px-4 py-2 text-sm">7. Equity</td>
                      <td className="border border-slate-300 px-4 py-2 text-sm">No accumulated losses exceeding paid-up capital*</td>
                      <td className="border border-slate-300 px-4 py-2 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Yes
                        </span>
                      </td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">15.00%</td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">0.15</td>
                    </tr>
                    <tr className="bg-slate-25">
                      <td className="border border-slate-300 px-4 py-2 text-sm">8. D/E Ratio</td>
                      <td className="border border-slate-300 px-4 py-2 text-sm">Not more than 4 times</td>
                      <td className="border border-slate-300 px-4 py-2 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          No
                        </span>
                      </td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">20.00%</td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">0.00</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 px-4 py-2 text-sm">9. DSCR</td>
                      <td className="border border-slate-300 px-4 py-2 text-sm">Not less than 1.2 times</td>
                      <td className="border border-slate-300 px-4 py-2 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          No
                        </span>
                      </td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">15.00%</td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">0.00</td>
                    </tr>
                    <tr className="bg-slate-25">
                      <td className="border border-slate-300 px-4 py-2 text-sm">10. Current Ratio</td>
                      <td className="border border-slate-300 px-4 py-2 text-sm">Greater than 1 time</td>
                      <td className="border border-slate-300 px-4 py-2 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Yes
                        </span>
                      </td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">10.00%</td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">0.10</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 px-4 py-2 text-sm">11. Interest Coverage Ratio</td>
                      <td className="border border-slate-300 px-4 py-2 text-sm">Greater than 1 time</td>
                      <td className="border border-slate-300 px-4 py-2 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          No
                        </span>
                      </td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">10.00%</td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">0.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Financial Performance Summary */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Financial Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-slate-900 mb-3">Client Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-600">Client Name:</span>
                        <div className="font-medium">{supplier?.companyName}</div>
                      </div>
                      <div>
                        <span className="text-slate-600">Business Unit:</span>
                        <div className="font-medium">Factoring</div>
                      </div>
                      <div>
                        <span className="text-slate-600">Business:</span>
                        <div className="font-medium">{supplier?.businessType}</div>
                      </div>
                      <div>
                        <span className="text-slate-600">Industry:</span>
                        <div className="font-medium">Growth</div>
                      </div>
                      <div>
                        <span className="text-slate-600">Registered Capital:</span>
                        <div className="font-medium">10 Million THB</div>
                      </div>
                      <div>
                        <span className="text-slate-600">Client Status:</span>
                        <div className="font-medium">Existing Client</div>
                      </div>
                      <div>
                        <span className="text-slate-600">Approval Authority:</span>
                        <div className="font-medium">Executive Committee</div>
                      </div>
                      <div>
                        <span className="text-slate-600">Credit Line:</span>
                        <div className="font-medium">Under Review</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <h4 className="font-semibold text-slate-900 mb-3">Financial Performance (Last 3 Years)</h4>
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border border-slate-300 px-3 py-2 text-left">Metrics (Million THB)</th>
                        <th className="border border-slate-300 px-3 py-2 text-right">2024</th>
                        <th className="border border-slate-300 px-3 py-2 text-right">2023</th>
                        <th className="border border-slate-300 px-3 py-2 text-right">2022</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-300 px-3 py-2 font-medium">Sales Revenue</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">44.52</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">90.51</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">72.96</td>
                      </tr>
                      <tr className="bg-slate-25">
                        <td className="border border-slate-300 px-3 py-2">Cost of Sales</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">25.11</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">55.77</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">39.92</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-3 py-2">Gross Profit</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">19.41</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">34.74</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">33.04</td>
                      </tr>
                      <tr className="bg-slate-25">
                        <td className="border border-slate-300 px-3 py-2">OPEX</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">18.81</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">33.88</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">32.78</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-3 py-2">Operating Profit</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">0.60</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">0.86</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">0.25</td>
                      </tr>
                      <tr className="bg-slate-25">
                        <td className="border border-slate-300 px-3 py-2">EBITDA</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">1.48</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">1.94</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">0.59</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-3 py-2">Interest</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">1.98</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">2.13</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">0.13</td>
                      </tr>
                      <tr className="bg-slate-25">
                        <td className="border border-slate-300 px-3 py-2">Taxes</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">0.06</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">0.14</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">0.34</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-3 py-2 font-medium">Net Profit (Loss)</td>
                        <td className="border border-slate-300 px-3 py-2 text-right text-red-600 font-medium">-0.56</td>
                        <td className="border border-slate-300 px-3 py-2 text-right text-red-600 font-medium">-0.32</td>
                        <td className="border border-slate-300 px-3 py-2 text-right text-green-600 font-medium">0.12</td>
                      </tr>
                      <tr className="bg-slate-25">
                        <td className="border border-slate-300 px-3 py-2">Current Assets</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">59.12</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">64.31</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">45.61</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-3 py-2 font-medium">Total Assets</td>
                        <td className="border border-slate-300 px-3 py-2 text-right font-medium">61.09</td>
                        <td className="border border-slate-300 px-3 py-2 text-right font-medium">66.85</td>
                        <td className="border border-slate-300 px-3 py-2 text-right font-medium">48.48</td>
                      </tr>
                      <tr className="bg-slate-25">
                        <td className="border border-slate-300 px-3 py-2">Current Liabilities</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">44.10</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">58.07</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">40.12</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-3 py-2 font-medium">Total Liabilities</td>
                        <td className="border border-slate-300 px-3 py-2 text-right font-medium">49.83</td>
                        <td className="border border-slate-300 px-3 py-2 text-right font-medium">58.92</td>
                        <td className="border border-slate-300 px-3 py-2 text-right font-medium">41.09</td>
                      </tr>
                      <tr className="bg-slate-25">
                        <td className="border border-slate-300 px-3 py-2">Retained Earnings</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">6.26</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">6.82</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">7.14</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-3 py-2 font-medium">Shareholders' Equity</td>
                        <td className="border border-slate-300 px-3 py-2 text-right font-medium">11.26</td>
                        <td className="border border-slate-300 px-3 py-2 text-right font-medium">7.93</td>
                        <td className="border border-slate-300 px-3 py-2 text-right font-medium">7.39</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Ratios */}
              <div className="mt-6">
                <h4 className="font-semibold text-slate-900 mb-3">Key Financial Ratios</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border border-slate-300 px-3 py-2 text-left">Ratio</th>
                        <th className="border border-slate-300 px-3 py-2 text-right">2024</th>
                        <th className="border border-slate-300 px-3 py-2 text-right">2023</th>
                        <th className="border border-slate-300 px-3 py-2 text-right">2022</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-300 px-3 py-2">Gross Margin (%)</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">43.6%</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">38.4%</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">45.3%</td>
                      </tr>
                      <tr className="bg-slate-25">
                        <td className="border border-slate-300 px-3 py-2">Net Profit (%)</td>
                        <td className="border border-slate-300 px-3 py-2 text-right text-red-600">-1.3%</td>
                        <td className="border border-slate-300 px-3 py-2 text-right text-red-600">-0.4%</td>
                        <td className="border border-slate-300 px-3 py-2 text-right text-green-600">0.2%</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-3 py-2">Current Ratio (times)</td>
                        <td className="border border-slate-300 px-3 py-2 text-right text-green-600">1.34</td>
                        <td className="border border-slate-300 px-3 py-2 text-right text-green-600">1.11</td>
                        <td className="border border-slate-300 px-3 py-2 text-right text-green-600">1.14</td>
                      </tr>
                      <tr className="bg-slate-25">
                        <td className="border border-slate-300 px-3 py-2">DSCR</td>
                        <td className="border border-slate-300 px-3 py-2 text-right text-red-600">0.09</td>
                        <td className="border border-slate-300 px-3 py-2 text-right text-red-600">0.12</td>
                        <td className="border border-slate-300 px-3 py-2 text-right text-red-600">0.04</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-3 py-2">Interest Coverage Ratio</td>
                        <td className="border border-slate-300 px-3 py-2 text-right text-red-600">0.75</td>
                        <td className="border border-slate-300 px-3 py-2 text-right text-red-600">0.91</td>
                        <td className="border border-slate-300 px-3 py-2 text-right text-green-600">4.58</td>
                      </tr>
                      <tr className="bg-slate-25">
                        <td className="border border-slate-300 px-3 py-2">Debt-to-Equity Ratio (D/E)</td>
                        <td className="border border-slate-300 px-3 py-2 text-right text-red-600">4.43</td>
                        <td className="border border-slate-300 px-3 py-2 text-right text-red-600">7.43</td>
                        <td className="border border-slate-300 px-3 py-2 text-right text-red-600">5.56</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-3 py-2 font-medium">Revenue CAGR</td>
                        <td className="border border-slate-300 px-3 py-2 text-right text-red-600 font-medium">-50.8%</td>
                        <td className="border border-slate-300 px-3 py-2 text-right text-green-600 font-medium">24.0%</td>
                        <td className="border border-slate-300 px-3 py-2 text-right text-green-600 font-medium">38.9%</td>
                      </tr>
                    </tbody>
                  </table>
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
