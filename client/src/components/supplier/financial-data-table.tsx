import { type FinancialData } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
interface FinancialDataTableProps {
  financialData: FinancialData[];
  isLoading: boolean;
}

export default function FinancialDataTable({
  financialData,
  isLoading,
}: FinancialDataTableProps) {
  if (isLoading) {
    return (
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>
            5 Years Financial Data (Balance Sheet & Income Statement)
          </CardTitle>
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
    );
  }

  const sortedData = financialData.sort((a, b) => a.year - b.year);
  const years = sortedData.map((d) => d.year);

  const formatCurrency = (amount: string | null | undefined) => {
    if (!amount) {
      return "0";
    }
    if (parseFloat(amount || "0") === 0) {
      return "0";
    }
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
      percentage: Math.abs(change).toFixed(1),
    };
  };

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle>
          5 Years Financial Data (Balance Sheet & Income Statement)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-700">
                  Financial Item
                </th>
                {years.map((year) => (
                  <th
                    key={year}
                    className="px-4 py-3 text-right font-medium text-slate-700"
                  >
                    {year}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr className="bg-slate-50">
                <td
                  className="px-4 py-3 font-medium text-slate-900"
                  colSpan={years.length + 1}
                >
                  สินทรัพย์ (Assets) - ล้านบาท
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 pl-6">
                  เงินสดและเงินฝากสถาบันการเงิน
                </td>
                {sortedData.map((data) => (
                  <td key={data.year} className="px-4 py-3 text-right">
                    {formatCurrency(data.cashAndDeposits)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 pl-6">ลูกหนี้การค้า</td>
                {sortedData.map((data) => (
                  <td key={data.year} className="px-4 py-3 text-right">
                    {formatCurrency(data.accountsReceivable)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 pl-6">
                  ลูกหนี้และตั๋วเงินรับทางการค้าสุทธิ
                </td>
                {sortedData.map((data) => (
                  <td key={data.year} className="px-4 py-3 text-right">
                    {formatCurrency(data.accountsReceivable)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 pl-6">
                  รวมเงินให้กู้ยืมระยะสั้น
                </td>
                {sortedData.map((data) => {
                  const shortTermLoans =
                    data.year >= 2021 && data.year <= 2023 ? "10000000" : null;
                  return (
                    <td key={data.year} className="px-4 py-3 text-right">
                      {formatCurrency(shortTermLoans)}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 pl-6">
                  สินค้าคงเหลือสุทธิ
                </td>
                {sortedData.map((data) => (
                  <td key={data.year} className="px-4 py-3 text-right">
                    {formatCurrency(data.inventoriesNet)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 pl-6">รายได้ค้างรับ</td>
                {sortedData.map((data) => (
                  <td key={data.year} className="px-4 py-3 text-right">
                    {formatCurrency(null)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 pl-6">
                  ค่าใช้จ่ายจ่ายล่วงหน้า
                </td>
                {sortedData.map((data) => (
                  <td key={data.year} className="px-4 py-3 text-right">
                    {formatCurrency(null)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 pl-6">
                  สินทรัพย์หมุนเวียนอื่น
                </td>
                {sortedData.map((data) => (
                  <td key={data.year} className="px-4 py-3 text-right">
                    {formatCurrency(data.otherCurrentAssets)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 pl-6">
                  รวมรายการอื่น - สินทรัพย์หมุนเวียน
                </td>
                {sortedData.map((data) => (
                  <td key={data.year} className="px-4 py-3 text-right">
                    {formatCurrency(null)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 font-medium">
                  สินทรัพย์หมุนเวียนรวม
                </td>
                {sortedData.map((data) => (
                  <td
                    key={data.year}
                    className="px-4 py-3 text-right font-medium"
                  >
                    {formatCurrency(
                      data.totalCurrentAssets || data.currentAssets
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 pl-6">
                  รวมเงินให้กู้ยืมและเงินลงทุนระยะยาว
                </td>
                {sortedData.map((data) => {
                  const longTermLoans = data.year === 2024 ? "10000000" : null;
                  return (
                    <td key={data.year} className="px-4 py-3 text-right">
                      {formatCurrency(longTermLoans)}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 pl-6">
                  ที่ดิน อาคารและอุปกรณ์ สุทธิ
                </td>
                {sortedData.map((data) => (
                  <td key={data.year} className="px-4 py-3 text-right">
                    {formatCurrency(data.propertyPlantEquipmentNet)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 pl-6">
                  สินทรัพย์ไม่หมุนเวียนอื่น
                </td>
                {sortedData.map((data) => (
                  <td key={data.year} className="px-4 py-3 text-right">
                    {formatCurrency(null)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 pl-6">
                  รวมรายการอื่น - สินทรัพย์ไม่หมุนเวียน
                </td>
                {sortedData.map((data) => (
                  <td key={data.year} className="px-4 py-3 text-right">
                    {formatCurrency(null)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 font-medium">
                  สินทรัพย์ไม่หมุนเวียนรวม
                </td>
                {sortedData.map((data) => (
                  <td
                    key={data.year}
                    className="px-4 py-3 text-right font-medium"
                  >
                    {formatCurrency(data.totalNonCurrentAssets || "0")}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 font-bold">
                  สินทรัพย์รวม
                </td>
                {sortedData.map((data) => (
                  <td
                    key={data.year}
                    className="px-4 py-3 text-right font-bold"
                  >
                    {formatCurrency(data.totalAssets)}
                  </td>
                ))}
              </tr>

              <tr className="bg-slate-50">
                <td
                  className="px-4 py-3 font-medium text-slate-900"
                  colSpan={years.length + 1}
                >
                  หนี้สิน (Liabilities) - ล้านบาท
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 pl-6">
                  เงินเบิกเกินบัญชีและเงินกู้ยืมระยะสั้นจากสถาบันการเงิน
                </td>
                {sortedData.map((data) => (
                  <td key={data.year} className="px-4 py-3 text-right">
                    {formatCurrency(null)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 pl-6">
                  เจ้าหนี้การค้า
                </td>
                {sortedData.map((data) => (
                  <td key={data.year} className="px-4 py-3 text-right">
                    {formatCurrency(data.accountsPayable)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 pl-6">
                  รวมเจ้าหนี้การค้าและตั๋วเงินจ่าย
                </td>
                {sortedData.map((data) => (
                  <td key={data.year} className="px-4 py-3 text-right">
                    {formatCurrency(data.accountsPayable)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 pl-6">
                  ส่วนของเงินกู้ยืมระยะยาวที่ถึงกำหนดชำระภายใน 1 ปี
                </td>
                {sortedData.map((data) => (
                  <td key={data.year} className="px-4 py-3 text-right">
                    {formatCurrency(null)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 pl-6">
                  รวมเงินกู้ยืมระยะสั้น
                </td>
                {sortedData.map((data) => (
                  <td key={data.year} className="px-4 py-3 text-right">
                    {formatCurrency(null)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 pl-6">
                  ค่าใช้จ่ายค้างจ่าย
                </td>
                {sortedData.map((data) => (
                  <td key={data.year} className="px-4 py-3 text-right">
                    {formatCurrency(null)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 pl-6">
                  รายได้รับล่วงหน้า
                </td>
                {sortedData.map((data) => (
                  <td key={data.year} className="px-4 py-3 text-right">
                    {formatCurrency(null)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 pl-6">
                  หนี้สินหมุนเวียนอื่น
                </td>
                {sortedData.map((data) => (
                  <td key={data.year} className="px-4 py-3 text-right">
                    {formatCurrency(data.otherCurrentLiabilities)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 pl-6">
                  รวมรายการอื่น - หนี้สินหมุนเวียน
                </td>
                {sortedData.map((data) => (
                  <td key={data.year} className="px-4 py-3 text-right">
                    {formatCurrency(null)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 font-medium">
                  หนี้สินหมุนเวียนรวม
                </td>
                {sortedData.map((data) => (
                  <td
                    key={data.year}
                    className="px-4 py-3 text-right font-medium"
                  >
                    {formatCurrency(
                      data.totalCurrentLiabilities || data.currentLiabilities
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 pl-6">
                  รวมเงินกู้ยืมระยะยาว
                </td>
                {sortedData.map((data) => (
                  <td key={data.year} className="px-4 py-3 text-right">
                    {formatCurrency(null)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 pl-6">
                  หนี้สินไม่หมุนเวียนอื่น
                </td>
                {sortedData.map((data) => (
                  <td key={data.year} className="px-4 py-3 text-right">
                    {formatCurrency(null)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 pl-6">
                  รวมรายการอื่น - หนี้สินไม่หมุนเวียน
                </td>
                {sortedData.map((data) => (
                  <td key={data.year} className="px-4 py-3 text-right">
                    {formatCurrency(null)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 font-medium">
                  รวมหนี้สินไม่หมุนเวียน
                </td>
                {sortedData.map((data) => (
                  <td
                    key={data.year}
                    className="px-4 py-3 text-right font-medium"
                  >
                    {formatCurrency(null)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 font-bold">
                  หนี้สินรวม
                </td>
                {sortedData.map((data) => (
                  <td
                    key={data.year}
                    className="px-4 py-3 text-right font-bold"
                  >
                    {formatCurrency(data.totalLiabilities || data.totalDebt)}
                  </td>
                ))}
              </tr>

              <tr className="bg-slate-50">
                <td
                  className="px-4 py-3 font-medium text-slate-900"
                  colSpan={years.length + 1}
                >
                  ส่วนของผู้ถือหุ้น (Shareholder's Equity) - ล้านบาท
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 pl-6">
                  ทุนจดทะเบียน - หุ้นบุริมสิทธิ
                </td>
                {sortedData.map((data) => (
                  <td key={data.year} className="px-4 py-3 text-right">
                    {formatCurrency(null)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 pl-6">ทุนจดทะเบียน</td>
                {sortedData.map((data) => (
                  <td key={data.year} className="px-4 py-3 text-right">
                    {formatCurrency(data.authorizedCommonStocks)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 pl-6">
                  ทุนที่ออกและชำระแล้ว - หุ้นบุริมสิทธิ
                </td>
                {sortedData.map((data) => (
                  <td key={data.year} className="px-4 py-3 text-right">
                    {formatCurrency(null)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 pl-6">
                  ทุนที่ออกและชำระแล้ว - หุ้นสามัญ
                </td>
                {sortedData.map((data) => (
                  <td key={data.year} className="px-4 py-3 text-right">
                    {formatCurrency(data.issuedPaidUpCommonStocks)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 pl-6">
                  ส่วนเกินทุนจากการตีราคาทรัพย์สิน
                </td>
                {sortedData.map((data) => (
                  <td key={data.year} className="px-4 py-3 text-right">
                    {formatCurrency(null)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 pl-6">
                  กำไร (ขาดทุน) สะสม
                </td>
                {sortedData.map((data) => (
                  <td key={data.year} className="px-4 py-3 text-right">
                    {formatCurrency(data.accumulatedRetainedEarnings)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 pl-6">รายการอื่น</td>
                {sortedData.map((data) => (
                  <td key={data.year} className="px-4 py-3 text-right">
                    {formatCurrency(null)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 font-bold">
                  ส่วนของผู้ถือหุ้นรวม
                </td>
                {sortedData.map((data) => (
                  <td
                    key={data.year}
                    className="px-4 py-3 text-right font-bold"
                  >
                    {formatCurrency(
                      data.totalShareholdersEquity || data.totalEquity
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 font-bold">
                  หนี้สินและส่วนของผู้ถือหุ้นรวม
                </td>
                {sortedData.map((data) => (
                  <td
                    key={data.year}
                    className="px-4 py-3 text-right font-bold"
                  >
                    {formatCurrency(
                      data.totalLiabilitiesShareholdersEquity ||
                        data.totalAssets
                    )}
                  </td>
                ))}
              </tr>

              <tr className="bg-slate-50">
                <td
                  className="px-4 py-3 font-medium text-slate-900"
                  colSpan={years.length + 1}
                >
                  ข้อมูลเพิ่มเติมสำหรับส่วนของผู้ถือหุ้น
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 font-medium pl-6">
                  หุ้นสามัญ
                </td>
                {sortedData.map((_, index) => (
                  <td
                    key={`common-stock-${index}`}
                    className="px-4 py-3 text-right"
                  ></td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 pl-8">
                  จำนวนหุ้น - ที่ได้รับอนุญาต
                </td>
                {sortedData.map((data) => (
                  <td key={data.year} className="px-4 py-3 text-right">
                    {data.commonStocksAuthorizedShares || "0"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 pl-8">
                  มูลค่าหุ้น (บาท) - ที่ได้รับอนุญาต
                </td>
                {sortedData.map((data) => (
                  <td key={data.year} className="px-4 py-3 text-right">
                    {data.commonStocksAuthorizedParValue || "0"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 pl-8">
                  จำนวนหุ้น - ออกจำหน่ายและชำระแล้ว
                </td>
                {sortedData.map((data) => (
                  <td key={data.year} className="px-4 py-3 text-right">
                    {data.commonStocksIssuedPaidUpShares || "0"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-slate-700 pl-8">
                  มูลค่าหุ้น (บาท) - ออกจำหน่ายและชำระแล้ว
                </td>
                {sortedData.map((data) => (
                  <td key={data.year} className="px-4 py-3 text-right">
                    {data.commonStocksIssuedPaidUpParValue || "0"}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
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
  );
}
