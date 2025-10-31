import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { contractorPaymentsApi } from '@/lib/api/contractor';

const ContractorPayments = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['contractor-payments', 1],
    queryFn: () => contractorPaymentsApi.history(1, 10),
  });

  const items = data?.data?.items || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Payments</CardTitle>
              <CardDescription>Your latest payments and payouts</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-muted-foreground">Loading...</div>
              ) : items.length === 0 ? (
                <div className="text-muted-foreground">No payments yet.</div>
              ) : (
                <div className="space-y-3">
                  {items.map((p: any) => (
                    <div key={p.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">{p.description || 'Payment'}</p>
                        <p className="text-sm text-muted-foreground">{p.status}</p>
                      </div>
                      <div className="font-semibold">₹{(p.amount / 100) || p.amount}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContractorPayments;


