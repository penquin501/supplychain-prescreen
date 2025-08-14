import { type Supplier } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";

interface BusinessProfileProps {
  supplier: Supplier;
}

export default function BusinessProfile({ supplier }: BusinessProfileProps) {
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
              <p className="text-slate-900">{supplier.companyName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Registration Type</label>
              <p className="text-slate-900">{supplier.registrationType}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">VAT Registration</label>
              <p className={`font-medium flex items-center gap-1 ${supplier.vatRegistered ? 'text-green-600' : 'text-red-600'}`}>
                {supplier.vatRegistered ? (
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
              <p className="text-slate-900">{supplier.businessType}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tax ID</label>
              <p className="text-slate-900">{supplier.taxId}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Established Date</label>
              <p className="text-slate-900">{supplier.establishedDate}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Years of Operation</label>
              <p className={`font-medium ${supplier.yearsOfOperation >= 2 ? 'text-green-600' : 'text-red-600'}`}>
                {supplier.yearsOfOperation} years {supplier.yearsOfOperation >= 2 ? '✓' : ''}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
              <p className="text-slate-900">{supplier.address}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contact Person</label>
              <p className="text-slate-900">{supplier.contactPerson}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
