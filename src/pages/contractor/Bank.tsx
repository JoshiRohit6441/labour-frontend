import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import apiClient from '@/lib/api/client';
import { useToast } from '@/hooks/use-toast';

const Bank = () => {
  const { toast } = useToast();
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');

  useEffect(() => {
    apiClient.get('/api/contractor/payments/bank-account').then((r) => {
      const d = r.data as any;
      if (d?.accountNumber) setAccountNumber(d.accountNumber);
      if (d?.ifsc) setIfsc(d.ifsc);
    }).catch(() => {});
  }, []);

  const save = async () => {
    try {
      await apiClient.put('/api/contractor/payments/bank-account', { accountNumber, ifsc });
      toast({ title: 'Bank details updated' });
    } catch (e: any) {
      toast({ title: 'Failed to update', description: e?.response?.data?.message, variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <Card className="max-w-2xl mx-auto border-0 shadow-md">
            <CardHeader>
              <CardTitle>Bank Account</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Account Number</Label>
                  <Input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
                </div>
                <div>
                  <Label>IFSC</Label>
                  <Input value={ifsc} onChange={(e) => setIfsc(e.target.value)} />
                </div>
                <Button onClick={save}>Save</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Bank;


