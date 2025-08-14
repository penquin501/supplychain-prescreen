import { type Document } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, CheckCircle, Clock, XCircle, Eye, Upload, Image, FileIcon, ThumbsUp, ThumbsDown } from "lucide-react";
import { useState } from "react";
import { ObjectUploader } from "@/components/ObjectUploader";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AScoreCardProps {
  supplierId: string;
  documents?: Document[];
}

import { requiredDocuments } from "@/lib/randomData";

export default function AScoreCard({ supplierId, documents }: AScoreCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const totalDocuments = requiredDocuments.length; // Always 18 documents
  const submittedDocuments = documents?.filter(d => d.isSubmitted).length || 0;
  const aScore = Math.round((submittedDocuments / totalDocuments) * 100);

  // Create a map of submitted document types for easy lookup
  const submittedDocTypes = new Set(documents?.filter(d => d.isSubmitted).map(d => d.documentType) || []);
  
  // Create a map to find document ID by type
  const documentMap = new Map(documents?.map(doc => [doc.documentType, doc]) || []);

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async ({ documentId, fileURL }: { documentId: string; fileURL: string }) => {
      const response = await fetch(`/api/documents/${documentId}/upload`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileURL })
      });
      if (!response.ok) {
        throw new Error("Failed to upload document");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Document uploaded successfully!",
      });
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/suppliers', supplierId, 'documents'] });
      queryClient.invalidateQueries({ queryKey: ['/api/suppliers', supplierId, 'score'] });
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Approval mutation
  const approvalMutation = useMutation({
    mutationFn: async ({ documentId, approvalStatus }: { documentId: string; approvalStatus: "approved" | "rejected" }) => {
      const response = await fetch(`/api/documents/${documentId}/approval`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          approvalStatus, 
          reviewedBy: "Admin User" // In real app, this would come from authenticated user
        })
      });
      if (!response.ok) {
        throw new Error("Failed to update approval status");
      }
      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/suppliers", supplierId, "documents"] });
      toast({
        title: `Document ${variables.approvalStatus}`,
        description: `The document has been ${variables.approvalStatus}.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Approval failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

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
                        <th className="border border-slate-300 px-4 py-2 text-center w-24">Preview</th>
                        <th className="border border-slate-300 px-4 py-2 text-center w-32">Upload File</th>
                        <th className="border border-slate-300 px-4 py-2 text-center w-40">Approval Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requiredDocuments.map((doc) => {
                        const isSubmitted = submittedDocTypes.has(doc.english) || submittedDocTypes.has(doc.thai);
                        const existingDoc = documentMap.get(doc.english) || documentMap.get(doc.thai);
                        
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
                            <td className="border border-slate-300 px-4 py-2 text-center">
                              {existingDoc?.fileUrl ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.open(existingDoc.fileUrl, '_blank')}
                                  className="h-8 w-8 p-0"
                                >
                                  <Image className="h-4 w-4 text-blue-600" />
                                </Button>
                              ) : (
                                <span className="text-slate-400 text-xs">No file</span>
                              )}
                            </td>
                            <td className="border border-slate-300 px-4 py-2 text-center">
                              {existingDoc ? (
                                <ObjectUploader
                                  maxNumberOfFiles={1}
                                  maxFileSize={10485760} // 10MB
                                  onGetUploadParameters={async () => {
                                    const response = await fetch("/api/objects/upload", {
                                      method: "POST",
                                      headers: {
                                        "Content-Type": "application/json",
                                      }
                                    });
                                    if (!response.ok) {
                                      throw new Error("Failed to get upload URL");
                                    }
                                    const data = await response.json();
                                    return {
                                      method: "PUT" as const,
                                      url: data.uploadURL
                                    };
                                  }}
                                  onComplete={(result) => {
                                    if (result.successful && result.successful[0]) {
                                      const uploadURL = result.successful[0].uploadURL;
                                      uploadMutation.mutate({
                                        documentId: existingDoc.id,
                                        fileURL: uploadURL as string
                                      });
                                    }
                                  }}
                                  buttonClassName="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  <Upload className="h-3 w-3 mr-1" />
                                  {isSubmitted ? "Replace" : "Upload"}
                                </ObjectUploader>
                              ) : (
                                <span className="text-xs text-slate-400">No record</span>
                              )}
                            </td>
                            <td className="border border-slate-300 px-4 py-2 text-center">
                              {existingDoc?.fileUrl ? (
                                <div className="flex flex-col items-center gap-1">
                                  <div className="flex items-center gap-1">
                                    {existingDoc.approvalStatus === "approved" ? (
                                      <Badge className="bg-green-100 text-green-800 text-xs">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Approved
                                      </Badge>
                                    ) : existingDoc.approvalStatus === "rejected" ? (
                                      <Badge className="bg-red-100 text-red-800 text-xs">
                                        <XCircle className="h-3 w-3 mr-1" />
                                        Rejected
                                      </Badge>
                                    ) : (
                                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                        <Clock className="h-3 w-3 mr-1" />
                                        Pending
                                      </Badge>
                                    )}
                                  </div>
                                  {existingDoc.approvalStatus === "pending" && (
                                    <div className="flex gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => approvalMutation.mutate({
                                          documentId: existingDoc.id,
                                          approvalStatus: "approved"
                                        })}
                                        className="h-6 w-6 p-0 text-green-600 hover:bg-green-50"
                                        disabled={approvalMutation.isPending}
                                      >
                                        <ThumbsUp className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => approvalMutation.mutate({
                                          documentId: existingDoc.id,
                                          approvalStatus: "rejected"
                                        })}
                                        className="h-6 w-6 p-0 text-red-600 hover:bg-red-50"
                                        disabled={approvalMutation.isPending}
                                      >
                                        <ThumbsDown className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-slate-400 text-xs">-</span>
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
