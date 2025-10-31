import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { contractorPaymentsApi } from '@/lib/api/contractor';

const Earnings = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['contractor-earnings'],
    queryFn: () => contractorPaymentsApi.earnings(),
  });

  const summary = data?.data || { total: 0, pending: 0, withdrawn: 0 };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Earnings</CardTitle>
              <CardDescription>Your earnings summary</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-muted-foreground">Loading...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">₹{summary.total}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold">₹{summary.pending}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Withdrawn</p>
                    <p className="text-2xl font-bold">₹{summary.withdrawn}</p>
                  </div>
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

export default Earnings;


