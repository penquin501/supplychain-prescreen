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
  const [selectedBuyer, setSelectedBuyer] = useState<string | null>(null);

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

          {/* Buyer Performance Analysis */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Buyer Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-slate-900 mb-3">Top Buyers</h4>
                  <div className="space-y-3">
                    {[
                      { 
                        id: "ptt",
                        name: "PTT Public Company Limited", 
                        volume: "45.2M THB", 
                        transactions: 24, 
                        paymentDays: 45, 
                        status: "excellent",
                        details: {
                          industry: "Oil & Gas",
                          relationship: "3 years",
                          avgOrderSize: "1.9M THB",
                          paymentHistory: "99.2%",
                          creditLimit: "60M THB",
                          riskLevel: "Low",
                          lastTransaction: "Dec 2024",
                          growthRate: "+12%"
                        }
                      },
                      { 
                        id: "cpall",
                        name: "CP All Public Company Limited", 
                        volume: "32.8M THB", 
                        transactions: 18, 
                        paymentDays: 38, 
                        status: "good",
                        details: {
                          industry: "Retail",
                          relationship: "2 years",
                          avgOrderSize: "1.8M THB",
                          paymentHistory: "97.8%",
                          creditLimit: "45M THB",
                          riskLevel: "Low",
                          lastTransaction: "Dec 2024",
                          growthRate: "+8%"
                        }
                      },
                      { 
                        id: "true",
                        name: "True Corporation Public Company Limited", 
                        volume: "28.5M THB", 
                        transactions: 15, 
                        paymentDays: 52, 
                        status: "average",
                        details: {
                          industry: "Telecommunications",
                          relationship: "1.5 years",
                          avgOrderSize: "1.9M THB",
                          paymentHistory: "92.1%",
                          creditLimit: "35M THB",
                          riskLevel: "Medium",
                          lastTransaction: "Nov 2024",
                          growthRate: "+5%"
                        }
                      },
                      { 
                        id: "central",
                        name: "Central Retail Corporation Public Company Limited", 
                        volume: "19.3M THB", 
                        transactions: 12, 
                        paymentDays: 41, 
                        status: "good",
                        details: {
                          industry: "Retail",
                          relationship: "4 years",
                          avgOrderSize: "1.6M THB",
                          paymentHistory: "96.5%",
                          creditLimit: "25M THB",
                          riskLevel: "Low",
                          lastTransaction: "Dec 2024",
                          growthRate: "+15%"
                        }
                      }
                    ].map((buyer, index) => (
                      <div key={index}>
                        <div 
                          className="border rounded-lg p-3 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
                          onClick={() => setSelectedBuyer(selectedBuyer === buyer.id ? null : buyer.id)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-slate-900 text-sm">{buyer.name}</span>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2 py-1 rounded ${
                                buyer.status === 'excellent' ? 'bg-green-100 text-green-800' :
                                buyer.status === 'good' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {buyer.status}
                              </span>
                              <span className="text-xs text-slate-400">
                                {selectedBuyer === buyer.id ? '▼' : '▶'}
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs text-slate-600">
                            <div>
                              <span className="block">Volume</span>
                              <span className="font-medium text-slate-900">{buyer.volume}</span>
                            </div>
                            <div>
                              <span className="block">Transactions</span>
                              <span className="font-medium text-slate-900">{buyer.transactions}</span>
                            </div>
                            <div>
                              <span className="block">Avg Payment</span>
                              <span className="font-medium text-slate-900">{buyer.paymentDays} days</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Expanded Details */}
                        {selectedBuyer === buyer.id && (
                          <div className="mt-2 ml-4 p-3 border-l-2 border-blue-200 bg-blue-50 rounded-r-lg">
                            <h5 className="font-medium text-slate-900 mb-3">Detailed Performance</h5>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Industry:</span>
                                  <span className="font-medium">{buyer.details.industry}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Relationship:</span>
                                  <span className="font-medium">{buyer.details.relationship}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Avg Order Size:</span>
                                  <span className="font-medium">{buyer.details.avgOrderSize}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Payment History:</span>
                                  <span className="font-medium text-green-600">{buyer.details.paymentHistory}</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Credit Limit:</span>
                                  <span className="font-medium">{buyer.details.creditLimit}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Risk Level:</span>
                                  <span className={`font-medium ${
                                    buyer.details.riskLevel === 'Low' ? 'text-green-600' :
                                    buyer.details.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                                  }`}>{buyer.details.riskLevel}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Last Transaction:</span>
                                  <span className="font-medium">{buyer.details.lastTransaction}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Growth Rate:</span>
                                  <span className="font-medium text-blue-600">{buyer.details.growthRate}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-900 mb-3">Buyer Relationship Quality</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Payment Reliability</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-slate-200 rounded-full">
                          <div className="w-20 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">85%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Dispute Rate</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-slate-200 rounded-full">
                          <div className="w-1 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">2%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Repeat Business</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-slate-200 rounded-full">
                          <div className="w-22 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">92%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Growth Trend</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-slate-200 rounded-full">
                          <div className="w-18 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">+15%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Post-Factoring Performance */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Post-Factoring Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">98.5%</div>
                  <div className="text-sm text-slate-600">Collection Rate</div>
                  <div className="text-xs text-slate-500 mt-1">Last 12 months</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">42 days</div>
                  <div className="text-sm text-slate-600">Avg Collection Period</div>
                  <div className="text-xs text-slate-500 mt-1">Target: 45 days</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">125M</div>
                  <div className="text-sm text-slate-600">Total Factored (THB)</div>
                  <div className="text-xs text-slate-500 mt-1">Since inception</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <div className="text-3xl font-bold text-green-600">+7</div>
                    <div className="text-lg text-green-600">points</div>
                  </div>
                  <div className="text-sm text-slate-600">Score Change</div>
                  <div className="text-xs text-slate-500 mt-1">Last 12 months</div>
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                    <div className="text-xs text-green-700">
                      <div className="font-medium">Growth Factors:</div>
                      <div>• Improved payment collection</div>
                      <div>• Stronger buyer relationships</div>
                      <div>• Enhanced operational efficiency</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h4 className="font-medium text-slate-900 mb-4">Performance Analysis After Factoring</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-sm font-medium text-slate-700 mb-3">Positive Developments</h5>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Cash flow improved by 35%
                      </li>
                      <li className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Working capital increased 28%
                      </li>
                      <li className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Payment collection rate improved
                      </li>
                      <li className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Expanded to 2 new markets
                      </li>
                      <li className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Reduced operational risks
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-slate-700 mb-3">Areas for Monitoring</h5>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center text-blue-600">
                        <InfoIcon className="h-4 w-4 mr-2" />
                        Debt-to-equity ratio stable at 2.1x
                      </li>
                      <li className="flex items-center text-blue-600">
                        <InfoIcon className="h-4 w-4 mr-2" />
                        Market competition increasing
                      </li>
                      <li className="flex items-center text-yellow-600">
                        <TriangleAlert className="h-4 w-4 mr-2" />
                        Seasonal demand fluctuations
                      </li>
                      <li className="flex items-center text-blue-600">
                        <InfoIcon className="h-4 w-4 mr-2" />
                        Staff increased from 85 to 112
                      </li>
                    </ul>
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                      <div className="text-xs text-green-800">
                        <div className="font-medium">Score Improvement Drivers:</div>
                        <div>• Enhanced collection efficiency: +4 points</div>
                        <div>• Stronger buyer relationships: +2 points</div>
                        <div>• Operational improvements: +1 point</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Monitoring & Alerts */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Risk Monitoring & Early Warning Indicators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-slate-900 mb-3">Current Risk Status</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50 border-green-200">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-sm font-medium">Payment Behavior</span>
                      </div>
                      <span className="text-sm text-green-600">Low Risk</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50 border-green-200">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-sm font-medium">Financial Stability</span>
                      </div>
                      <span className="text-sm text-green-600">Low Risk</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50 border-yellow-200">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                        <span className="text-sm font-medium">Market Exposure</span>
                      </div>
                      <span className="text-sm text-yellow-600">Medium Risk</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-slate-900 mb-3">Monitoring Alerts</h4>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg bg-blue-50 border-blue-200">
                      <div className="flex items-center mb-1">
                        <InfoIcon className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="text-sm font-medium text-blue-800">Quarterly Review Due</span>
                      </div>
                      <p className="text-xs text-blue-700">Financial statements review scheduled for next month</p>
                    </div>
                    <div className="p-3 border rounded-lg bg-green-50 border-green-200">
                      <div className="flex items-center mb-1">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-green-800">Payment Performance</span>
                      </div>
                      <p className="text-xs text-green-700">Consistent on-time payments for 8 consecutive months</p>
                    </div>
                    <div className="p-3 border rounded-lg bg-slate-50 border-slate-200">
                      <div className="flex items-center mb-1">
                        <InfoIcon className="h-4 w-4 text-slate-600 mr-2" />
                        <span className="text-sm font-medium text-slate-800">Market Update</span>
                      </div>
                      <p className="text-xs text-slate-700">Industry outlook remains positive with 8% growth forecast</p>
                    </div>
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
