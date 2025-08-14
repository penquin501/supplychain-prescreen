import { type Document } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle, Clock, XCircle } from "lucide-react";

interface AScoreCardProps {
  supplierId: string;
  documents?: Document[];
}

export default function AScoreCard({ supplierId, documents }: AScoreCardProps) {
  const totalDocuments = documents?.length || 18; // Default to 18 required documents
  const submittedDocuments = documents?.filter(d => d.isSubmitted).length || 0;
  const aScore = Math.round((submittedDocuments / totalDocuments) * 100);

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

        {documents && documents.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="text-sm font-medium text-slate-900 mb-2">Recent Documents</div>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {documents.slice(0, 3).map((doc) => (
                <div key={doc.id} className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 truncate">{doc.documentType}</span>
                  {doc.isSubmitted ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : (
                    <XCircle className="h-3 w-3 text-red-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {(!documents || documents.length === 0) && (
          <div className="text-center py-4">
            <FileText className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-600">No documents submitted</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
