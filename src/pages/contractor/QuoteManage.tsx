import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { contractorJobsApi } from '@/lib/api/contractor';
import { useToast } from '@/hooks/use-toast';

const QuoteManage = () => {
  const { toast } = useToast();
  const [jobId, setJobId] = useState('');
  const [quoteId, setQuoteId] = useState('');
  const [amount, setAmount] = useState('');

  const updateQuote = async () => {
    try {
      await contractorJobsApi.updateQuote(jobId, quoteId, { amount: Number(amount) });
      toast({ title: 'Quote updated' });
    } catch (e: any) {
      toast({ title: 'Failed to update', description: e?.response?.data?.message, variant: 'destructive' });
    }
  };

  const cancelQuote = async () => {
    try {
      await contractorJobsApi.cancelQuote(jobId, quoteId);
      toast({ title: 'Quote cancelled' });
    } catch (e: any) {
      toast({ title: 'Failed to cancel', description: e?.response?.data?.message, variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <Card className="max-w-2xl mx-auto border-0 shadow-md">
            <CardHeader>
              <CardTitle>Manage Quote</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Input placeholder="Job ID" value={jobId} onChange={(e) => setJobId(e.target.value)} />
                <Input placeholder="Quote ID" value={quoteId} onChange={(e) => setQuoteId(e.target.value)} />
                <Input placeholder="Amount (INR)" value={amount} onChange={(e) => setAmount(e.target.value)} />
                <div className="flex gap-2">
                  <Button onClick={updateQuote}>Update</Button>
                  <Button variant="destructive" onClick={cancelQuote}>Cancel</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuoteManage;


