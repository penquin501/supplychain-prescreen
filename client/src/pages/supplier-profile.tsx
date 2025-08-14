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
          {/* Scoring Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <FinancialScoreCard 
              supplierId={selectedSupplierId} 
              supplier={supplier}
              financialData={financialData}
            />
            <TransactionalScoreCard supplierId={selectedSupplierId} />
            <AScoreCard 
              supplierId={selectedSupplierId}
              documents={documents}
            />
          </div>

          {/* Business Profile */}
          <BusinessProfile supplier={supplier} />

          {/* Financial Data Table */}
          <FinancialDataTable 
            financialData={financialData || []}
            isLoading={!financialData}
          />
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
