import { type FinancialData } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface FinancialDataTableProps {
  financialData: FinancialData[];
  isLoading: boolean;
}

export default function FinancialDataTable({ financialData, isLoading }: FinancialDataTableProps) {
  if (isLoading) {
    return (
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>5 Years Financial Data (Balance Sheet & Income Statement)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-slate-200 rounded mb-4"></div>
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 bg-slate-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const sortedData = financialData.sort((a, b) => a.year - b.year);
  const years = sortedData.map(d => d.year);

  const formatCurrency = (amount: string) => {
    return (parseFloat(amount) / 1000000).toFixed(1);
  };

  const getTrend = (currentValue: string, previousValue?: string) => {
    if (!previousValue) return null;
    const current = parseFloat(currentValue);
    const previous = parseFloat(previousValue);
    const change = ((current - previous) / previous) * 100;
    
    if (Math.abs(change) < 1) return null;
    
    return {
      isPositive: change > 0,
      percentage: Math.abs(change).toFixed(1)
    };
  };

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle>5 Years Financial Data (Balance Sheet & Income Statement)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-700">Financial Item</th>
                {years.map(year => (
                  <th key={year} className="px-4 py-3 text-right font-medium text-slate-700">
                    {year}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr className="bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900" colSpan={years.length + 1}>
                  Income Statement (Million THB)
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700">Sales Revenue</td>
                {sortedData.map((data, index) => {
                  const trend = index > 0 ? getTrend(data.salesRevenue, sortedData[index - 1]?.salesRevenue) : null;
                  return (
                    <td key={data.year} className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <span>{formatCurrency(data.salesRevenue)}</span>
                        {trend && (
                          <span className={`flex items-center text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {trend.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {trend.percentage}%
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700">Cost of Goods Sold</td>
                {sortedData.map(data => (
                  <td key={data.year} className="px-4 py-3 text-right">{formatCurrency(data.costOfGoodsSold)}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700">Gross Profit</td>
                {sortedData.map(data => (
                  <td key={data.year} className="px-4 py-3 text-right">{formatCurrency(data.grossProfit)}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700">Net Income</td>
                {sortedData.map(data => {
                  const netIncome = parseFloat(data.netIncome);
                  return (
                    <td key={data.year} className={`px-4 py-3 text-right ${netIncome > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(data.netIncome)}
                    </td>
                  );
                })}
              </tr>
              <tr className="bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900" colSpan={years.length + 1}>
                  Balance Sheet (Million THB)
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700">Total Assets</td>
                {sortedData.map(data => (
                  <td key={data.year} className="px-4 py-3 text-right">{formatCurrency(data.totalAssets)}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700">Total Debt</td>
                {sortedData.map(data => (
                  <td key={data.year} className="px-4 py-3 text-right">{formatCurrency(data.totalDebt)}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700">Total Equity</td>
                {sortedData.map(data => (
                  <td key={data.year} className="px-4 py-3 text-right">{formatCurrency(data.totalEquity)}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700">Current Assets</td>
                {sortedData.map(data => (
                  <td key={data.year} className="px-4 py-3 text-right">{formatCurrency(data.currentAssets)}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700">Current Liabilities</td>
                {sortedData.map(data => (
                  <td key={data.year} className="px-4 py-3 text-right">{formatCurrency(data.currentLiabilities)}</td>
                ))}
              </tr>
              <tr className="bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900" colSpan={years.length + 1}>
                  Key Ratios
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700">D/E Ratio</td>
                {sortedData.map(data => {
                  const ratio = parseFloat(data.totalDebt) / parseFloat(data.totalEquity);
                  return (
                    <td key={data.year} className={`px-4 py-3 text-right ${ratio <= 4 ? 'text-green-600' : 'text-red-600'}`}>
                      {ratio.toFixed(1)}x
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700">Current Ratio</td>
                {sortedData.map(data => {
                  const ratio = parseFloat(data.currentAssets) / parseFloat(data.currentLiabilities);
                  return (
                    <td key={data.year} className={`px-4 py-3 text-right ${ratio > 1 ? 'text-green-600' : 'text-red-600'}`}>
                      {ratio.toFixed(1)}x
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
