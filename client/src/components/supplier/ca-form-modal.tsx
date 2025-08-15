import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { type Supplier } from "@shared/schema";

const caFormSchema = z.object({
  // Company Information
  companyNameThai: z.string().min(1, "Thai company name is required"),
  companyNameEnglish: z.string().min(1, "English company name is required"),
  businessType: z.string().min(1, "Business type is required"),
  registeredCapital: z.number().min(0, "Registered capital must be positive"),
  
  // Registration Details
  taxId: z.string().min(1, "Tax ID is required"),
  vatRegistered: z.boolean(),
  establishedDate: z.string().min(1, "Established date is required"),
  
  // Address Information
  registeredAddress: z.string().min(1, "Registered address is required"),
  businessAddress: z.string().min(1, "Business address is required"),
  district: z.string().min(1, "District is required"),
  province: z.string().min(1, "Province is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  
  // Contact Information
  phoneNumber: z.string().min(1, "Phone number is required"),
  email: z.string().email("Valid email is required"),
  contactPerson: z.string().min(1, "Contact person is required"),
  
  // Business Information
  industry: z.string().min(1, "Industry is required"),
  businessDescription: z.string().min(1, "Business description is required"),
  yearsOfOperation: z.number().min(0, "Years of operation must be positive"),
  numberOfEmployees: z.number().min(1, "Number of employees is required"),
  
  // Financial Information
  annualRevenue: z.number().min(0, "Annual revenue must be positive"),
  bankName: z.string().min(1, "Primary bank name is required"),
  bankAccountNumber: z.string().min(1, "Bank account number is required"),
  
  // Factoring Information
  requestedCreditLimit: z.number().min(0, "Requested credit limit must be positive"),
  factoringPurpose: z.string().min(1, "Purpose of factoring is required"),
  majorCustomers: z.string().min(1, "Major customers information is required"),
  creditTerms: z.number().min(0, "Credit terms must be positive"),
  
  // Factoring Service Fees
  serviceFeeRate: z.number().min(0).max(10, "Service fee rate must be between 0-10%"),
  processingFee: z.number().min(0, "Processing fee must be positive"),
  maintenanceFeeMonthly: z.number().min(0, "Monthly maintenance fee must be positive"),
  documentationFee: z.number().min(0, "Documentation fee must be positive"),
  verificationFee: z.number().min(0, "Verification fee must be positive"),
  factoringInterestRate: z.number().min(0).max(25, "Interest rate must be between 0-25%"),
  
  // Guarantors Information
  guarantor1Name: z.string().optional(),
  guarantor1Position: z.string().optional(),
  guarantor2Name: z.string().optional(),
  guarantor2Position: z.string().optional(),
});

type CAFormData = z.infer<typeof caFormSchema>;

interface CAFormModalProps {
  supplier?: Supplier;
  onSubmit?: (data: CAFormData) => void;
  children: React.ReactNode;
}

export function CAFormModal({ supplier, onSubmit, children }: CAFormModalProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<CAFormData>({
    resolver: zodResolver(caFormSchema),
    defaultValues: {
      companyNameThai: supplier?.companyName || "",
      companyNameEnglish: supplier?.companyName || "",
      businessType: supplier?.businessType || "",
      registeredCapital: 0,
      taxId: supplier?.taxId || "",
      vatRegistered: supplier?.vatRegistered || false,
      establishedDate: supplier?.establishedDate || "",
      registeredAddress: supplier?.address || "",
      businessAddress: supplier?.address || "",
      district: "",
      province: "",
      postalCode: "",
      phoneNumber: "", // Required field for user input
      email: "", // Required field for user input
      contactPerson: supplier?.contactPerson || "",
      industry: "",
      businessDescription: "",
      yearsOfOperation: supplier?.yearsOfOperation || 0,
      numberOfEmployees: 0,
      annualRevenue: 0,
      bankName: "",
      bankAccountNumber: "",
      requestedCreditLimit: (() => {
        // Calculate intelligent default factoring credit limit
        if (!supplier) return 0;
        
        // Base factoring calculation
        let baseFactoringLimit = 15; // Default base factoring limit in millions THB
        let factoringAdjustment = 1.0;
        
        // Business maturity factor for factoring
        const yearsOfOperation = supplier.yearsOfOperation || 0;
        if (yearsOfOperation >= 10) factoringAdjustment *= 1.2;
        else if (yearsOfOperation >= 5) factoringAdjustment *= 1.1;
        else if (yearsOfOperation >= 2) factoringAdjustment *= 1.0;
        else factoringAdjustment *= 0.8; // Newer businesses have higher factoring risk
        
        // VAT registration bonus (important for invoice verification in factoring)
        if (supplier.vatRegistered) factoringAdjustment *= 1.15;
        
        // Business type factor for factoring
        const businessType = supplier.businessType?.toLowerCase() || '';
        if (businessType.includes('corporation') || businessType.includes('limited')) {
          factoringAdjustment *= 1.1; // Formal structure better for factoring
        }
        
        let factoringCreditLimit = Math.round(baseFactoringLimit * factoringAdjustment);
        
        // Apply factoring revenue cap: Maximum 2M THB per month of factored invoices
        // Conservative approach for CA form defaults
        if (yearsOfOperation >= 5 && supplier.vatRegistered) {
          factoringCreditLimit = Math.min(factoringCreditLimit, 36); // Max 36M for established factoring (2M × 18 months)
        } else if (yearsOfOperation >= 2) {
          factoringCreditLimit = Math.min(factoringCreditLimit, 24); // Max 24M for mature factoring (2M × 12 months)
        } else {
          factoringCreditLimit = Math.min(factoringCreditLimit, 12); // Max 12M for new factoring (2M × 6 months)
        }
        
        return factoringCreditLimit;
      })(),
      factoringPurpose: "",
      majorCustomers: "",
      creditTerms: 45, // Default credit terms from document
      
      // Factoring Service Fees defaults
      serviceFeeRate: 2.5, // Default 2.5% service fee
      processingFee: 5000, // Default 5,000 THB processing fee
      maintenanceFeeMonthly: 1000, // Default 1,000 THB monthly maintenance
      documentationFee: 2000, // Default 2,000 THB documentation fee
      verificationFee: 1500, // Default 1,500 THB verification fee
      factoringInterestRate: 12.0, // Default 12% annual interest rate
      
      guarantor1Name: "",
      guarantor1Position: "",
      guarantor2Name: "",
      guarantor2Position: "",
    },
  });

  const handleSubmit = (data: CAFormData) => {
    onSubmit?.(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>CA Form - Credit Application for Factoring</DialogTitle>
          <DialogDescription>
            Complete supplier information form for credit approval and factoring facility setup
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="companyNameThai"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name (Thai)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="companyNameEnglish"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name (English)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="businessType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select business type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="corporation">Corporation</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                            <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                            <SelectItem value="cooperative">Cooperative</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="registeredCapital"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registered Capital (THB)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="establishedDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Established Date</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="taxId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax ID</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="vatRegistered"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>VAT Registration</FormLabel>
                        <Select onValueChange={(value) => field.onChange(value === "true")} defaultValue={field.value ? "true" : "false"}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select VAT status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="true">VAT Registered</SelectItem>
                            <SelectItem value="false">Not VAT Registered</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Address Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="registeredAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registered Address</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={2} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="businessAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Address</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={2} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>District</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="province"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Province</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="contactPerson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Required field" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="Required field" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Business Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Business Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Food & Beverage, Manufacturing" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="yearsOfOperation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years of Operation</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="businessDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} placeholder="Describe the nature of your business and main activities" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="numberOfEmployees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Employees</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Financial Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Financial Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="annualRevenue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Annual Revenue (THB)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Bank</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Bangkok Bank, SCB" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="bankAccountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Account Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="majorCustomers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Major Customers</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} placeholder="List major customers and their relationship details" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Factoring Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Factoring Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="requestedCreditLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Requested Credit Limit (THB Million)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            placeholder="e.g., 8"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="creditTerms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Credit Terms (Days)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="factoringPurpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purpose of Factoring</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={2} placeholder="Explain the intended use of factoring facility" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Factoring Service Fees */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Factoring Service Fees</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Service fees and charges applicable to the factoring facility
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="serviceFeeRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Fee Rate (%)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            step="0.1"
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            placeholder="2.5"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="factoringInterestRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interest Rate (% p.a.)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            step="0.1"
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            placeholder="12.0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="processingFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Processing Fee (THB)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            placeholder="5,000"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="maintenanceFeeMonthly"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Maintenance Fee (THB)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            placeholder="1,000"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="documentationFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Documentation Fee (THB)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            placeholder="2,000"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="verificationFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Verification Fee (THB)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            placeholder="1,500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Fee Summary</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• Service Fee: {form.watch("serviceFeeRate") || 0}% per factored invoice</p>
                    <p>• Interest Rate: {form.watch("factoringInterestRate") || 0}% per annum</p>
                    <p>• One-time Setup: {((form.watch("processingFee") || 0) + (form.watch("documentationFee") || 0) + (form.watch("verificationFee") || 0)).toLocaleString()} THB</p>
                    <p>• Monthly Maintenance: {(form.watch("maintenanceFeeMonthly") || 0).toLocaleString()} THB</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guarantors Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Guarantors Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="guarantor1Name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Guarantor 1 - Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Optional" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="guarantor1Position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Guarantor 1 - Position</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Optional" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="guarantor2Name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Guarantor 2 - Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Optional" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="guarantor2Position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Guarantor 2 - Position</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Optional" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Separator />
            
            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Save CA Form
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}