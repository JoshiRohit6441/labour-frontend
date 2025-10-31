import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { contractorJobsApi } from '@/lib/api/contractor';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const ContractorJobs = () => {
  const { toast } = useToast();

  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data: nearby, isLoading: loadingNearby, refetch } = useQuery({
    queryKey: ['contractor-nearby-jobs', 1],
    queryFn: () => contractorJobsApi.nearby(1, 10),
  });

  console.log(nearby);

  const items = nearby?.jobs || [];
  const pagination = nearby?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  };;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container py-8 space-y-6">
          <h1 className="text-3xl font-bold">Available Jobs</h1>
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Nearby Jobs</CardTitle>
              <CardDescription>Jobs around your service areas</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingNearby ? (
                <div className="text-muted-foreground">Loading...</div>
              ) : items.length === 0 ? (
                <div className="text-muted-foreground">No jobs available.</div>
              ) : (
                <div className="space-y-3">
                  {items.map((j: any) => (
                    <div key={j.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">{j.title}</p>
                        <p className="text-sm text-muted-foreground">Budget: ₹{j.budget || '—'}</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={async () => {
                        const amount = prompt('Enter quote amount (INR)')
                        if (!amount) return;
                        try {
                          await contractorJobsApi.submitQuote(j.id, { amount: Number(amount) });
                          toast({ title: 'Quote submitted' });
                          refetch();
                        } catch (e: any) {
                          toast({ title: 'Failed to submit quote', description: e?.response?.data?.message, variant: 'destructive' });
                        }
                      }}>Quote</Button>
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

export default ContractorJobs;


