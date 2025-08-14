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
                <td className="px-4 py-3 text-slate-700">Net Sales</td>
                {sortedData.map((data, index) => {
                  const trend = index > 0 ? getTrend(data.netSales || data.salesRevenue, sortedData[index - 1]?.netSales || sortedData[index - 1]?.salesRevenue) : null;
                  return (
                    <td key={data.year} className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <span>{formatCurrency(data.netSales || data.salesRevenue)}</span>
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
                <td className="px-4 py-3 text-slate-700">Total Other Income</td>
                {sortedData.map(data => (
                  <td key={data.year} className="px-4 py-3 text-right">{formatCurrency(data.totalOtherIncome || "0")}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 font-medium">Total Revenue</td>
                {sortedData.map(data => (
                  <td key={data.year} className="px-4 py-3 text-right font-medium">{formatCurrency(data.totalRevenue || data.salesRevenue)}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700">Cost of Sales/Services</td>
                {sortedData.map(data => (
                  <td key={data.year} className="px-4 py-3 text-right">{formatCurrency(data.costOfSalesServices || data.costOfGoodsSold)}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 font-medium">Gross Profit (Loss)</td>
                {sortedData.map(data => {
                  const grossProfit = parseFloat(data.grossProfitLoss || data.grossProfit);
                  return (
                    <td key={data.year} className={`px-4 py-3 text-right font-medium ${grossProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(data.grossProfitLoss || data.grossProfit)}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700">Total Operating Expenses</td>
                {sortedData.map(data => (
                  <td key={data.year} className="px-4 py-3 text-right">{formatCurrency(data.totalOperatingExpenses || "0")}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700">Operating Income (Loss)</td>
                {sortedData.map(data => {
                  const operatingIncome = parseFloat(data.operatingIncomeLoss || "0");
                  return (
                    <td key={data.year} className={`px-4 py-3 text-right ${operatingIncome > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(data.operatingIncomeLoss || "0")}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700">Interest Expenses</td>
                {sortedData.map(data => (
                  <td key={data.year} className="px-4 py-3 text-right">{formatCurrency(data.interestExpenses || data.interestExpense)}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700">Income Taxes</td>
                {sortedData.map(data => (
                  <td key={data.year} className="px-4 py-3 text-right">{formatCurrency(data.incomeTaxes || "0")}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 font-medium">Net Income (Loss)</td>
                {sortedData.map(data => {
                  const netIncome = parseFloat(data.netIncomeLoss || data.netIncome);
                  return (
                    <td key={data.year} className={`px-4 py-3 text-right font-medium ${netIncome > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(data.netIncomeLoss || data.netIncome)}
                    </td>
                  );
                })}
              </tr>
              <tr className="bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900" colSpan={years.length + 1}>
                  Balance Sheet - Assets (Million THB)
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700">Cash and Deposits at Financial Institutions</td>
                {sortedData.map(data => (
                  <td key={data.year} className="px-4 py-3 text-right">{formatCurrency(data.cashAndDeposits || "0")}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700">Accounts Receivable</td>
                {sortedData.map(data => (
                  <td key={data.year} className="px-4 py-3 text-right">{formatCurrency(data.accountsReceivable || "0")}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700">Inventories - Net</td>
                {sortedData.map(data => (
                  <td key={data.year} className="px-4 py-3 text-right">{formatCurrency(data.inventoriesNet || "0")}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 font-medium">Total Current Assets</td>
                {sortedData.map(data => (
                  <td key={data.year} className="px-4 py-3 text-right font-medium">{formatCurrency(data.totalCurrentAssets || data.currentAssets)}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700">Property, Plant and Equipment - Net</td>
                {sortedData.map(data => (
                  <td key={data.year} className="px-4 py-3 text-right">{formatCurrency(data.propertyPlantEquipmentNet || "0")}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700">Total Non-Current Assets</td>
                {sortedData.map(data => (
                  <td key={data.year} className="px-4 py-3 text-right">{formatCurrency(data.totalNonCurrentAssets || "0")}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 font-bold">Total Assets</td>
                {sortedData.map(data => (
                  <td key={data.year} className="px-4 py-3 text-right font-bold">{formatCurrency(data.totalAssets)}</td>
                ))}
              </tr>
              
              <tr className="bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900" colSpan={years.length + 1}>
                  Balance Sheet - Liabilities (Million THB)
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700">Bank Overdrafts and Short-term Loans</td>
                {sortedData.map(data => (
                  <td key={data.year} className="px-4 py-3 text-right">{formatCurrency(data.bankOverdraftsShortTermLoans || "0")}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700">Accounts Payable</td>
                {sortedData.map(data => (
                  <td key={data.year} className="px-4 py-3 text-right">{formatCurrency(data.accountsPayable || "0")}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 font-medium">Total Current Liabilities</td>
                {sortedData.map(data => (
                  <td key={data.year} className="px-4 py-3 text-right font-medium">{formatCurrency(data.totalCurrentLiabilities || data.currentLiabilities)}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700">Total Long-term Loans</td>
                {sortedData.map(data => (
                  <td key={data.year} className="px-4 py-3 text-right">{formatCurrency(data.totalLongTermLoans || "0")}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700">Total Non-Current Liabilities</td>
                {sortedData.map(data => (
                  <td key={data.year} className="px-4 py-3 text-right">{formatCurrency(data.totalNonCurrentLiabilities || "0")}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 font-bold">Total Liabilities</td>
                {sortedData.map(data => (
                  <td key={data.year} className="px-4 py-3 text-right font-bold">{formatCurrency(data.totalLiabilities || data.totalDebt)}</td>
                ))}
              </tr>
              
              <tr className="bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900" colSpan={years.length + 1}>
                  Balance Sheet - Shareholders' Equity (Million THB)
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700">Issued and Paid-up Common Stocks</td>
                {sortedData.map(data => (
                  <td key={data.year} className="px-4 py-3 text-right">{formatCurrency(data.issuedPaidUpCommonStocks || "0")}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700">Accumulated Retained Earnings</td>
                {sortedData.map(data => (
                  <td key={data.year} className="px-4 py-3 text-right">{formatCurrency(data.accumulatedRetainedEarnings || "0")}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 font-bold">Total Shareholders' Equity</td>
                {sortedData.map(data => (
                  <td key={data.year} className="px-4 py-3 text-right font-bold">{formatCurrency(data.totalShareholdersEquity || data.totalEquity)}</td>
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
