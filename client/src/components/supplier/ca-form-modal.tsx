import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  registrationNumber: z.string().min(1, "Registration number is required"),
  taxId: z.string().min(1, "Tax ID is required"),
  vatRegistered: z.boolean(),
  
  // Contact Information
  address: z.string().min(1, "Address is required"),
  district: z.string().min(1, "District is required"),
  province: z.string().min(1, "Province is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  email: z.string().email("Valid email is required"),
  website: z.string().optional(),
  
  // Business Information
  businessType: z.string().min(1, "Business type is required"),
  industry: z.string().min(1, "Industry is required"),
  yearsOfOperation: z.number().min(0, "Years of operation must be positive"),
  numberOfEmployees: z.number().min(1, "Number of employees is required"),
  
  // Financial Information
  annualRevenue: z.number().min(0, "Annual revenue must be positive"),
  majorCustomers: z.string().min(1, "Major customers information is required"),
  bankName: z.string().min(1, "Bank name is required"),
  bankAccountNumber: z.string().min(1, "Bank account number is required"),
  
  // Additional Information
  businessDescription: z.string().min(1, "Business description is required"),
  keyProducts: z.string().min(1, "Key products/services is required"),
  competitiveAdvantages: z.string().optional(),
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
      registrationNumber: supplier?.taxId || "", // Use taxId as registration number
      taxId: supplier?.taxId || "",
      vatRegistered: supplier?.vatRegistered || false,
      address: supplier?.address || "",
      district: "",
      province: "",
      postalCode: "",
      phoneNumber: "", // This is required field that user needs to fill
      email: "", // Not available in current supplier schema
      website: "", // Not available in current supplier schema
      businessType: supplier?.businessType || "",
      industry: "", // Not available in current supplier schema
      yearsOfOperation: supplier?.yearsOfOperation || 0,
      numberOfEmployees: 0, // Not available in current supplier schema
      annualRevenue: 0,
      majorCustomers: "",
      bankName: "",
      bankAccountNumber: "",
      businessDescription: "",
      keyProducts: "",
      competitiveAdvantages: "",
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
          <DialogTitle>CA Form - Supplier Information</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Company Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                
                <FormField
                  control={form.control}
                  name="registrationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registration Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
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
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
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
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
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

            {/* Business Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Business Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                          <Input {...field} />
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
                        <Textarea {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="businessDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="keyProducts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key Products/Services</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="competitiveAdvantages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Competitive Advantages</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={2} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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