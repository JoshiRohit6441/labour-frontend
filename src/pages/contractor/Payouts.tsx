import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import apiClient from '@/lib/api/client';
import { useToast } from '@/hooks/use-toast';

const Payouts = () => {
  const { toast } = useToast();
  const [amount, setAmount] = useState('');

  const requestPayout = async () => {
    try {
      await apiClient.post('/api/contractor/payments/request-payout', { amount: Number(amount) });
      toast({ title: 'Payout requested' });
      setAmount('');
    } catch (e: any) {
      toast({ title: 'Failed to request payout', description: e?.response?.data?.message, variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <Card className="max-w-xl mx-auto border-0 shadow-md">
            <CardHeader>
              <CardTitle>Request Payout</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <input className="border rounded px-3 py-2 w-full" placeholder="Amount (INR)" value={amount} onChange={(e) => setAmount(e.target.value)} />
                <Button onClick={requestPayout}>Request</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Payouts;


