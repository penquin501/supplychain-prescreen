import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { type Supplier, type FinancialData, type Document } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Building, Plus } from "lucide-react";
import { useState } from "react";

import FinancialScoreCard from "@/components/supplier/financial-score-card";
import TransactionalScoreCard from "@/components/supplier/transactional-score-card";
import AScoreCard from "@/components/supplier/a-score-card";
import BusinessProfile from "@/components/supplier/business-profile";
import FinancialDataTable from "@/components/supplier/financial-data-table";

export default function SupplierProfile() {
  const [location] = useLocation();
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const initialSupplierId = urlParams.get('id') || '';
  
  const [selectedSupplierId, setSelectedSupplierId] = useState(initialSupplierId);

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
        <p className="text-slate-600 mt-1">Comprehensive supplier evaluation and scoring</p>
      </div>

      {/* Supplier Selection */}
      <Card className="border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Select Supplier</h3>
            <Button className="bg-financial-primary hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Supplier
            </Button>
          </div>
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

      {selectedSupplierId && supplier ? (
        <>
          {/* Business Profile */}
          <BusinessProfile supplier={supplier} />

          {/* Scoring Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <AScoreCard 
              supplierId={selectedSupplierId}
              documents={documents}
            />
            <TransactionalScoreCard supplierId={selectedSupplierId} />
            <FinancialScoreCard 
              supplierId={selectedSupplierId} 
              supplier={supplier}
              financialData={financialData}
            />
          </div>

          {/* Qualification Criteria Assessment */}
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
                      <th className="border border-slate-300 px-4 py-3 text-center text-sm font-semibold">Value</th>
                      <th className="border border-slate-300 px-4 py-3 text-center text-sm font-semibold">Weight</th>
                      <th className="border border-slate-300 px-4 py-3 text-center text-sm font-semibold">Scoring</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 px-4 py-2 text-sm">1</td>
                      <td className="border border-slate-300 px-4 py-2 text-sm">Registered Entity</td>
                      <td className="border border-slate-300 px-4 py-2 text-sm">Public Company (PLC) / Limited Company (Ltd.) / Limited Partnership (LP)</td>
                      <td className="border border-slate-300 px-4 py-2 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Yes
                        </span>
                      </td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">1</td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">5.00%</td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">0.05</td>
                    </tr>
                    <tr className="bg-slate-25">
                      <td className="border border-slate-300 px-4 py-2 text-sm">2</td>
                      <td className="border border-slate-300 px-4 py-2 text-sm">Registered in the VAT System</td>
                      <td className="border border-slate-300 px-4 py-2 text-sm">Registered for VAT</td>
                      <td className="border border-slate-300 px-4 py-2 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Yes
                        </span>
                      </td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">1</td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">5.00%</td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">0.05</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 px-4 py-2 text-sm">3</td>
                      <td className="border border-slate-300 px-4 py-2 text-sm">Years of Operation</td>
                      <td className="border border-slate-300 px-4 py-2 text-sm">In business for at least 2 years</td>
                      <td className="border border-slate-300 px-4 py-2 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Yes
                        </span>
                      </td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">1</td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">5.00%</td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">0.05</td>
                    </tr>
                    <tr className="bg-slate-25">
                      <td className="border border-slate-300 px-4 py-2 text-sm">4</td>
                      <td className="border border-slate-300 px-4 py-2 text-sm">Sales Revenue</td>
                      <td className="border border-slate-300 px-4 py-2 text-sm">&gt; 30 million THB</td>
                      <td className="border border-slate-300 px-4 py-2 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Yes
                        </span>
                      </td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">1</td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">5.00%</td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">0.05</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 px-4 py-2 text-sm">5</td>
                      <td className="border border-slate-300 px-4 py-2 text-sm">Credit Term</td>
                      <td className="border border-slate-300 px-4 py-2 text-sm">≤ 180 days</td>
                      <td className="border border-slate-300 px-4 py-2 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Yes
                        </span>
                      </td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">1</td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">5.00%</td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">0.05</td>
                    </tr>
                    <tr className="bg-slate-25">
                      <td className="border border-slate-300 px-4 py-2 text-sm">6</td>
                      <td className="border border-slate-300 px-4 py-2 text-sm">Business Performance</td>
                      <td className="border border-slate-300 px-4 py-2 text-sm">Profitable in the latest year or in 2 of the last 3 years</td>
                      <td className="border border-slate-300 px-4 py-2 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          No
                        </span>
                      </td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">0</td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">5.00%</td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">0.00</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 px-4 py-2 text-sm">7</td>
                      <td className="border border-slate-300 px-4 py-2 text-sm">Equity</td>
                      <td className="border border-slate-300 px-4 py-2 text-sm">No accumulated losses exceeding paid-up capital*</td>
                      <td className="border border-slate-300 px-4 py-2 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Yes
                        </span>
                      </td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">1</td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">15.00%</td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">0.15</td>
                    </tr>
                    <tr className="bg-slate-25">
                      <td className="border border-slate-300 px-4 py-2 text-sm">8</td>
                      <td className="border border-slate-300 px-4 py-2 text-sm">D/E Ratio</td>
                      <td className="border border-slate-300 px-4 py-2 text-sm">Not more than 4 times</td>
                      <td className="border border-slate-300 px-4 py-2 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          No
                        </span>
                      </td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">0</td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">20.00%</td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">0.00</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 px-4 py-2 text-sm">9</td>
                      <td className="border border-slate-300 px-4 py-2 text-sm">DSCR</td>
                      <td className="border border-slate-300 px-4 py-2 text-sm">Not less than 1.2 times</td>
                      <td className="border border-slate-300 px-4 py-2 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          No
                        </span>
                      </td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">0</td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">15.00%</td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">0.00</td>
                    </tr>
                    <tr className="bg-slate-25">
                      <td className="border border-slate-300 px-4 py-2 text-sm">10</td>
                      <td className="border border-slate-300 px-4 py-2 text-sm">Current Ratio</td>
                      <td className="border border-slate-300 px-4 py-2 text-sm">Greater than 1 time</td>
                      <td className="border border-slate-300 px-4 py-2 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Yes
                        </span>
                      </td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">1</td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">10.00%</td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">0.10</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 px-4 py-2 text-sm">11</td>
                      <td className="border border-slate-300 px-4 py-2 text-sm">Interest Coverage Ratio</td>
                      <td className="border border-slate-300 px-4 py-2 text-sm">Greater than 1 time</td>
                      <td className="border border-slate-300 px-4 py-2 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          No
                        </span>
                      </td>
                      <td className="border border-slate-300 px-4 py-2 text-center text-sm">0</td>
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
              <div className="space-y-6">
                {/* Client Information */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Client Name</span>
                      <div className="font-medium">GADHOUSE CO.,LTD.</div>
                    </div>
                    <div>
                      <span className="text-slate-600">Business Unit</span>
                      <div className="font-medium">Factoring</div>
                    </div>
                    <div>
                      <span className="text-slate-600">Approval Authority</span>
                      <div className="font-medium">Executive Committee</div>
                    </div>
                    <div>
                      <span className="text-slate-600">Business</span>
                      <div className="font-medium">HOME</div>
                    </div>
                    <div>
                      <span className="text-slate-600">Industry</span>
                      <div className="font-medium">Growth</div>
                    </div>
                    <div>
                      <span className="text-slate-600">Registered Capital</span>
                      <div className="font-medium">10</div>
                    </div>
                    <div>
                      <span className="text-slate-600">Client Status</span>
                      <div className="font-medium">Existing Client</div>
                    </div>
                    <div>
                      <span className="text-slate-600">Additional Credit Line</span>
                      <div className="font-medium">-</div>
                    </div>
                    <div>
                      <span className="text-slate-600">Credit Line</span>
                      <div className="font-medium"></div>
                    </div>
                  </div>
                </div>

                {/* Financial Performance Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border border-slate-300 px-3 py-2 text-left">Financial Performance (Last 3 Years) (Million THB)</th>
                        <th className="border border-slate-300 px-3 py-2 text-right">2024</th>
                        <th className="border border-slate-300 px-3 py-2 text-right">2023</th>
                        <th className="border border-slate-300 px-3 py-2 text-right">2022</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-300 px-3 py-2">Sales Revenue</td>
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
                        <td className="border border-slate-300 px-3 py-2">Depreciation and amortization</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">-</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">-</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">-</td>
                      </tr>
                      <tr className="bg-slate-25">
                        <td className="border border-slate-300 px-3 py-2">Interest</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">1.98</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">2.13</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">0.13</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-3 py-2">Taxes</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">0.06</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">0.14</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">0.34</td>
                      </tr>
                      <tr className="bg-slate-25">
                        <td className="border border-slate-300 px-3 py-2">Net Profit (Loss)</td>
                        <td className="border border-slate-300 px-3 py-2 text-right text-red-600">-0.56</td>
                        <td className="border border-slate-300 px-3 py-2 text-right text-red-600">-0.32</td>
                        <td className="border border-slate-300 px-3 py-2 text-right text-green-600">0.12</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-3 py-2">Current Assets</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">59.12</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">64.31</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">45.61</td>
                      </tr>
                      <tr className="bg-slate-25">
                        <td className="border border-slate-300 px-3 py-2">Total Assets</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">61.09</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">66.85</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">48.48</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-3 py-2">Debt Principle Payment</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">14.04</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">13.80</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">14.55</td>
                      </tr>
                      <tr className="bg-slate-25">
                        <td className="border border-slate-300 px-3 py-2">Current Liabilities</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">44.10</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">58.07</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">40.12</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-3 py-2">Total Liabilities</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">49.83</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">58.92</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">41.09</td>
                      </tr>
                      <tr className="bg-slate-25">
                        <td className="border border-slate-300 px-3 py-2">Retained Earning</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">6.26</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">6.82</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">7.14</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-3 py-2">Shareholders' Equity</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">11.26</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">7.93</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">7.39</td>
                      </tr>
                      <tr className="bg-slate-25">
                        <td className="border border-slate-300 px-3 py-2">Gross Margin (%)</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">43.6%</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">38.4%</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">45.3%</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-3 py-2">Net Profit (%)</td>
                        <td className="border border-slate-300 px-3 py-2 text-right text-red-600">-1.3%</td>
                        <td className="border border-slate-300 px-3 py-2 text-right text-red-600">-0.4%</td>
                        <td className="border border-slate-300 px-3 py-2 text-right text-green-600">0.2%</td>
                      </tr>
                      <tr className="bg-slate-25">
                        <td className="border border-slate-300 px-3 py-2">Current Ratio (times)</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">1.34</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">1.11</td>
                        <td className="border border-slate-300 px-3 py-2 text-right">1.14</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-3 py-2">DSCR</td>
                        <td className="border border-slate-300 px-3 py-2 text-right text-red-600">0.09</td>
                        <td className="border border-slate-300 px-3 py-2 text-right text-red-600">0.12</td>
                        <td className="border border-slate-300 px-3 py-2 text-right text-red-600">0.04</td>
                      </tr>
                      <tr className="bg-slate-25">
                        <td className="border border-slate-300 px-3 py-2">Interest Coverage Ratio</td>
                        <td className="border border-slate-300 px-3 py-2 text-right text-red-600">0.75</td>
                        <td className="border border-slate-300 px-3 py-2 text-right text-red-600">0.91</td>
                        <td className="border border-slate-300 px-3 py-2 text-right text-green-600">4.58</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 px-3 py-2">Debt-to-Equity Ratio (D/E) (times)</td>
                        <td className="border border-slate-300 px-3 py-2 text-right text-red-600">4.43</td>
                        <td className="border border-slate-300 px-3 py-2 text-right text-red-600">7.43</td>
                        <td className="border border-slate-300 px-3 py-2 text-right text-red-600">5.56</td>
                      </tr>
                      <tr className="bg-slate-25">
                        <td className="border border-slate-300 px-3 py-2">Revenue CAGR</td>
                        <td className="border border-slate-300 px-3 py-2 text-right text-red-600">-50.8%</td>
                        <td className="border border-slate-300 px-3 py-2 text-right text-green-600">24.0%</td>
                        <td className="border border-slate-300 px-3 py-2 text-right text-green-600">38.9%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Data Table */}
          <FinancialDataTable 
            financialData={financialData || []}
            isLoading={!financialData}
          />

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
                      <th className="px-4 py-3 text-left font-medium text-slate-700">Income Statement Item</th>
                      {financialData?.sort((a, b) => a.year - b.year).map(data => (
                        <th key={data.year} className="px-4 py-3 text-right font-medium text-slate-700">
                          {data.year}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="px-4 py-3 text-slate-700 font-medium">Net Sales</td>
                      {financialData?.sort((a, b) => a.year - b.year).map(data => (
                        <td key={data.year} className="px-4 py-3 text-right font-medium">
                          {(parseFloat(data.netSales || data.salesRevenue) / 1000000).toFixed(1)}M
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-slate-25">
                      <td className="px-4 py-3 text-slate-700">Total Other Income</td>
                      {financialData?.sort((a, b) => a.year - b.year).map(data => (
                        <td key={data.year} className="px-4 py-3 text-right">
                          {(parseFloat(data.totalOtherIncome || "0") / 1000000).toFixed(1)}M
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-slate-700 font-medium">Total Revenue</td>
                      {financialData?.sort((a, b) => a.year - b.year).map(data => (
                        <td key={data.year} className="px-4 py-3 text-right font-medium">
                          {(parseFloat(data.totalRevenue || data.salesRevenue) / 1000000).toFixed(1)}M
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-slate-25">
                      <td className="px-4 py-3 text-slate-700">Cost of Sales/Services</td>
                      {financialData?.sort((a, b) => a.year - b.year).map(data => (
                        <td key={data.year} className="px-4 py-3 text-right">
                          {(parseFloat(data.costOfSalesServices || data.costOfGoodsSold) / 1000000).toFixed(1)}M
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-slate-700 font-medium">Gross Profit (Loss)</td>
                      {financialData?.sort((a, b) => a.year - b.year).map(data => {
                        const grossProfit = parseFloat(data.grossProfitLoss || data.grossProfit);
                        return (
                          <td key={data.year} className={`px-4 py-3 text-right font-medium ${grossProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {(grossProfit / 1000000).toFixed(1)}M
                          </td>
                        );
                      })}
                    </tr>
                    <tr className="bg-slate-25">
                      <td className="px-4 py-3 text-slate-700">Total Operating Expenses</td>
                      {financialData?.sort((a, b) => a.year - b.year).map(data => (
                        <td key={data.year} className="px-4 py-3 text-right">
                          {(parseFloat(data.totalOperatingExpenses || "0") / 1000000).toFixed(1)}M
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-slate-700">Operating Income (Loss)</td>
                      {financialData?.sort((a, b) => a.year - b.year).map(data => {
                        const operatingIncome = parseFloat(data.operatingIncomeLoss || "0");
                        return (
                          <td key={data.year} className={`px-4 py-3 text-right ${operatingIncome > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {(operatingIncome / 1000000).toFixed(1)}M
                          </td>
                        );
                      })}
                    </tr>
                    <tr className="bg-slate-25">
                      <td className="px-4 py-3 text-slate-700">Other Expenses</td>
                      {financialData?.sort((a, b) => a.year - b.year).map(data => (
                        <td key={data.year} className="px-4 py-3 text-right">
                          {(parseFloat(data.otherExpenses || "0") / 1000000).toFixed(1)}M
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-slate-700">Income (Loss) Before Depreciation and Amortization</td>
                      {financialData?.sort((a, b) => a.year - b.year).map(data => {
                        const incomeBeforeDA = parseFloat(data.incomeBeforeDepreciationAmortization || "0");
                        return (
                          <td key={data.year} className={`px-4 py-3 text-right ${incomeBeforeDA > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {(incomeBeforeDA / 1000000).toFixed(1)}M
                          </td>
                        );
                      })}
                    </tr>
                    <tr className="bg-slate-25">
                      <td className="px-4 py-3 text-slate-700">Income (Loss) Before Interest and Income Taxes</td>
                      {financialData?.sort((a, b) => a.year - b.year).map(data => {
                        const incomeBeforeIT = parseFloat(data.incomeBeforeInterestIncomeTaxes || "0");
                        return (
                          <td key={data.year} className={`px-4 py-3 text-right ${incomeBeforeIT > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {(incomeBeforeIT / 1000000).toFixed(1)}M
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-slate-700">Interest Expenses</td>
                      {financialData?.sort((a, b) => a.year - b.year).map(data => (
                        <td key={data.year} className="px-4 py-3 text-right">
                          {(parseFloat(data.interestExpenses || data.interestExpense) / 1000000).toFixed(1)}M
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-slate-25">
                      <td className="px-4 py-3 text-slate-700">Income Taxes</td>
                      {financialData?.sort((a, b) => a.year - b.year).map(data => (
                        <td key={data.year} className="px-4 py-3 text-right">
                          {(parseFloat(data.incomeTaxes || "0") / 1000000).toFixed(1)}M
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-slate-700">Extraordinary Items</td>
                      {financialData?.sort((a, b) => a.year - b.year).map(data => (
                        <td key={data.year} className="px-4 py-3 text-right">
                          {(parseFloat(data.extraordinaryItems || "0") / 1000000).toFixed(1)}M
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-slate-25">
                      <td className="px-4 py-3 text-slate-700">Others</td>
                      {financialData?.sort((a, b) => a.year - b.year).map(data => (
                        <td key={data.year} className="px-4 py-3 text-right">
                          {(parseFloat(data.othersIncomeStatement || "0") / 1000000).toFixed(1)}M
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-slate-700 font-bold">Net Income (Loss)</td>
                      {financialData?.sort((a, b) => a.year - b.year).map(data => {
                        const netIncome = parseFloat(data.netIncomeLoss || data.netIncome);
                        return (
                          <td key={data.year} className={`px-4 py-3 text-right font-bold ${netIncome > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {(netIncome / 1000000).toFixed(1)}M
                          </td>
                        );
                      })}
                    </tr>
                    <tr className="bg-slate-25">
                      <td className="px-4 py-3 text-slate-700">Earnings (Loss) per Share</td>
                      {financialData?.sort((a, b) => a.year - b.year).map(data => {
                        const eps = parseFloat(data.earningsLossPerShare || "0");
                        return (
                          <td key={data.year} className={`px-4 py-3 text-right ${eps > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {eps.toFixed(2)}
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-slate-700">Number of Weighted Average Ordinary Shares</td>
                      {financialData?.sort((a, b) => a.year - b.year).map(data => (
                        <td key={data.year} className="px-4 py-3 text-right">
                          {parseInt(data.numberOfWeightedAverageOrdinaryShares || "0").toLocaleString()}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="border-slate-200">
          <CardContent className="p-12 text-center">
            <Building className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No Supplier Selected</h3>
            <p className="text-slate-600">Please select a supplier to view their profile and scoring information.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
