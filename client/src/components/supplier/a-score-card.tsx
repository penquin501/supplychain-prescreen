import { type Document } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, CheckCircle, Clock, XCircle, Eye } from "lucide-react";
import { useState } from "react";

interface AScoreCardProps {
  supplierId: string;
  documents?: Document[];
}

// Required documents list with English translations
const requiredDocuments = [
  { id: 1, thai: "Company Profile", english: "Company Profile" },
  { id: 2, thai: "ประวัติเจ้าของ / ผู้บริหารหลัก", english: "Owner/Key Executive History" },
  { id: 3, thai: "หนังสือรับรองบริษัท (ออกภายใน 1 เดือนล่าสุด)", english: "Company Certificate (Issued within the last month)" },
  { id: 4, thai: "บริคณห์สนธิ", english: "Articles of Association" },
  { id: 5, thai: "สำเนารายชื่อถือหุ้น (ล่าสุด)", english: "Copy of Shareholders List (Latest)" },
  { id: 6, thai: "หนังสือแสดงการจดทะเบียนหุ้นส่วนบริษัท", english: "Partnership Registration Certificate" },
  { id: 7, thai: "ภ.พ.20", english: "Por Por 20 (VAT Registration)" },
  { id: 8, thai: "บอจ.3 / ใบอนุญาตจัดตั้งโรงงาน", english: "Factory License (Bor Chor 3 / Factory Establishment Permit)" },
  { id: 9, thai: "งบภายในปี 68 และ ภ.พ.30 ย้อนหลัง ม.ค. 68 – ปัจจุบัน พร้อมใบเสร็จ", english: "Internal Financial Statements for 2025 and Por Por 30 (Jan 2025 - Present) with receipts" },
  { id: 10, thai: "งบการเงินย้อนหลัง 3 ปี (ล่าสุด) กรณียังไม่ปิดปี 67 ขอ ภ.พ.30 ม.ค.–ธ.ค. 67 พร้อมใบเสร็จ", english: "3-Year Financial Statements (Latest). If 2024 not closed, request Por Por 30 Jan-Dec 2024 with receipts" },
  { id: 11, thai: "Statement ธนาคารย้อนหลัง 1 ปี", english: "Bank Statements for the past 1 year" },
  { id: 12, thai: "สำเนาบัตรประจำตัวประชาชน และสำเนาทะเบียนบ้านกรรมการและคู่สมรสกรรมการ (รับรองสำเนาถูกต้อง)", english: "Copy of ID Cards and House Registration of Directors and Spouses (Certified copies)" },
  { id: 13, thai: "List รายชื่อลูกหนี้ที่ขออนุมัติวงเงิน", english: "List of Debtors for Credit Limit Approval" },
  { id: 14, thai: "ประวัติการเรียกเก็บเงินจากลูกหนี้การค้าที่เสนอขอวงเงินย้อนหลัง 1 ปี เอกสารประกอบได้แก่ ใบเสนอราคา, ใบสั่งซื้อ, ใบส่งของ, ใบวางบิล, ใบแจ้งหนี้ และภาพถ่ายหน้าเช็คลูกหนี้การค้าหรือเอกสารแสดงรายการโอนเงิน (Remittance) พร้อมแนับหน้า Statement ที่มียอดเงินรับชำระจากลูกค้าเข้ามา", english: "1-Year Collection History from Trade Debtors including: quotations, purchase orders, delivery notes, billing, invoices, check photos or remittance documents with statement pages showing customer payments" },
  { id: 15, thai: "PO งาน หรือ สัญญาที่ได้รับจากลูกหนี้", english: "Purchase Orders or Contracts from Debtors" },
  { id: 16, thai: "คาดการณ์ยอดขายลูกหนี้รายที่ขออนุมัติวงเงิน", english: "Sales Forecast for Debtors Requesting Credit Approval" },
  { id: 17, thai: "เอกสารเครดิตบูโร (บริษัท+กรรมการ+ผู้ค้ำประกัน) (ย้อนหลังไม่เกิน 1 เดือน)", english: "Credit Bureau Reports (Company + Directors + Guarantors) (Not older than 1 month)" },
  { id: 18, thai: "เงื่อนไขการวางบิลและชำระเงิน", english: "Billing and Payment Terms including: a) Billing schedule, b) Payment schedule, c) Payment type (check/transfer), d) Check receipt documents, e) Payment location, f) Billing/payment procedures (if any)" }
];

export default function AScoreCard({ supplierId, documents }: AScoreCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const totalDocuments = requiredDocuments.length; // Always 18 documents
  const submittedDocuments = documents?.filter(d => d.isSubmitted).length || 0;
  const aScore = Math.round((submittedDocuments / totalDocuments) * 100);

  // Create a map of submitted document types for easy lookup
  const submittedDocTypes = new Set(documents?.filter(d => d.isSubmitted).map(d => d.documentType) || []);

  const getStatusBadge = (score: number) => {
    if (score >= 80) {
      return { badge: "Pass", className: "bg-green-100 text-green-800 hover:bg-green-100", icon: CheckCircle };
    } else if (score >= 31) {
      return { badge: "Pending", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100", icon: Clock };
    } else {
      return { badge: "Not Pass", className: "bg-red-100 text-red-800 hover:bg-red-100", icon: XCircle };
    }
  };

  const status = getStatusBadge(aScore);
  const StatusIcon = status.icon;

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 31) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>A-Score</CardTitle>
          <Badge className={status.className}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {status.badge}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <div className="text-4xl font-bold text-financial-primary mb-2">{aScore}%</div>
          <div className="text-sm text-slate-600">Document Completion</div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Submitted:</span>
            <span className="font-medium">{submittedDocuments}/{totalDocuments} documents</span>
          </div>
          
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(aScore)}`}
              style={{ width: `${aScore}%` }}
            ></div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Required Documents Checklist</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-slate-300">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="border border-slate-300 px-4 py-2 text-left w-12">#</th>
                        <th className="border border-slate-300 px-4 py-2 text-left">Document Name (English)</th>
                        <th className="border border-slate-300 px-4 py-2 text-center w-20">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requiredDocuments.map((doc) => {
                        const isSubmitted = submittedDocTypes.has(doc.english) || submittedDocTypes.has(doc.thai);
                        return (
                          <tr key={doc.id} className="hover:bg-slate-50">
                            <td className="border border-slate-300 px-4 py-2 text-center font-medium">
                              {doc.id}
                            </td>
                            <td className="border border-slate-300 px-4 py-2">
                              <div className="text-sm">
                                <div className="font-medium text-slate-900">{doc.english}</div>
                                <div className="text-slate-500 text-xs mt-1">{doc.thai}</div>
                              </div>
                            </td>
                            <td className="border border-slate-300 px-4 py-2 text-center">
                              {isSubmitted ? (
                                <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Progress Summary:</span>
                    <span className="font-medium">
                      {submittedDocuments} of {totalDocuments} documents submitted ({aScore}%)
                    </span>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
