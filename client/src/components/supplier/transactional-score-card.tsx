import { useQuery } from "@tanstack/react-query";
import { type Transaction } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

interface TransactionalScoreCardProps {
  supplierId: string;
}

export default function TransactionalScoreCard({ supplierId }: TransactionalScoreCardProps) {
  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/suppliers", supplierId, "transactions"],
    enabled: !!supplierId,
  });

  // Calculate transactional score using proprietary RFM Model
  const calculateTransactionalScore = (transactions: Transaction[]) => {
    if (!transactions || transactions.length === 0) return { score: 50, recency: 3, frequency: 1, monetary: 1 };

    // Recency (1-5): How recently they made transactions
    const latestTransaction = Math.max(...transactions.map(t => new Date(t.paymentDate || t.invoiceDate || t.poDate).getTime()));
    const daysSinceLatest = Math.floor((Date.now() - latestTransaction) / (1000 * 60 * 60 * 24));
    const recency = daysSinceLatest <= 30 ? 5 : daysSinceLatest <= 90 ? 4 : daysSinceLatest <= 180 ? 3 : daysSinceLatest <= 365 ? 2 : 1;

    // Frequency (1-5): How often they make transactions
    const frequency = transactions.length >= 20 ? 5 : transactions.length >= 10 ? 4 : transactions.length >= 5 ? 3 : transactions.length >= 2 ? 2 : 1;

    // Monetary (1-5): Total transaction value
    const totalValue = transactions.reduce((sum, t) => sum + parseFloat(t.poNetAmount), 0);
    const monetary = totalValue >= 50000000 ? 5 : totalValue >= 20000000 ? 4 : totalValue >= 10000000 ? 3 : totalValue >= 5000000 ? 2 : 1;

    const score = Math.round(((recency + frequency + monetary) / 15) * 100);
    return { score, recency, frequency, monetary };
  };

  const scoreData = calculateTransactionalScore(transactions || []);
  const avgPaymentTerm = transactions?.length ? 
    Math.round(transactions.reduce((sum, t) => sum + t.poPaymentTerm, 0) / transactions.length) : 0;

  if (isLoading) {
    return (
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Document Completeness</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded"></div>
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 bg-slate-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle>Document Completeness</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <div className={`text-4xl font-bold mb-2 ${
            scoreData.score >= 80 ? 'text-green-600' : 
            scoreData.score >= 31 ? 'text-yellow-600' : 
            'text-red-600'
          }`}>
            {scoreData.score}%
          </div>
          <Badge className={`${
            scoreData.score >= 80 ? 'bg-green-100 text-green-800' : 
            scoreData.score >= 31 ? 'bg-yellow-100 text-yellow-800' : 
            'bg-red-100 text-red-800'
          }`}>
            {scoreData.score >= 80 ? 'Pass' : scoreData.score >= 31 ? 'Pending' : 'Not Pass'}
          </Badge>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Total Transactions:</span>
            <span className="font-medium">{transactions?.length || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Avg Payment Terms:</span>
            <span className={`font-medium ${avgPaymentTerm <= 180 ? 'text-green-600' : 'text-red-600'}`}>
              {avgPaymentTerm} days {avgPaymentTerm <= 180 ? '✓' : ''}
            </span>
          </div>
        </div>
        
        {transactions && transactions.length === 0 && (
          <div className="text-center py-4">
            <TrendingUp className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-600">No transaction history available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
