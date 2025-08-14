import { type Supplier } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import { type RandomCompanyData } from "@/lib/randomData";

interface BusinessProfileProps {
  supplier?: Supplier;
  randomData?: RandomCompanyData;
}

export default function BusinessProfile({ supplier, randomData }: BusinessProfileProps) {
  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle>Business Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
              <p className="text-slate-900">{randomData?.companyName || supplier?.companyName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Registration Type</label>
              <p className="text-slate-900">{randomData?.registrationType || supplier?.registrationType}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">VAT Registration</label>
              <p className={`font-medium flex items-center gap-1 ${(randomData?.vatRegistration === "Registered" || supplier?.vatRegistered) ? 'text-green-600' : 'text-red-600'}`}>
                {(randomData?.vatRegistration === "Registered" || supplier?.vatRegistered) ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Registered
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4" />
                    Not Registered
                  </>
                )}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Business Type</label>
              <p className="text-slate-900">{randomData?.businessType || supplier?.businessType}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tax ID</label>
              <p className="text-slate-900">{randomData?.taxId || supplier?.taxId}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Established Date</label>
              <p className="text-slate-900">{randomData?.establishedDate || supplier?.establishedDate}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Years of Operation</label>
              <p className={`font-medium ${(randomData?.yearsOfOperation || supplier?.yearsOfOperation || 0) >= 2 ? 'text-green-600' : 'text-red-600'}`}>
                {randomData?.yearsOfOperation || supplier?.yearsOfOperation} years {(randomData?.yearsOfOperation || supplier?.yearsOfOperation || 0) >= 2 ? '✓' : ''}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
              <p className="text-slate-900">{randomData?.address || supplier?.address}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contact Person</label>
              <p className="text-slate-900">{randomData?.contactPerson || supplier?.contactPerson}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
