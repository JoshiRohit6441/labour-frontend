import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { contractorJobsApi } from '@/lib/api/contractor';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

import { useAppDispatch, setActiveJob, clearActiveJob } from '@/store';

const MyJobs = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['contractor-jobs', 1],
    queryFn: () => contractorJobsApi.list(1, 10),
  });

  const items = data?.data?.items || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>My Jobs</CardTitle>
              <CardDescription>Jobs you are assigned to</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-muted-foreground">Loading...</div>
              ) : items.length === 0 ? (
                <div className="text-muted-foreground">No jobs.</div>
              ) : (
                <div className="space-y-3">
                  {items.map((j: any) => (
                    <div key={j.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">{j.title}</p>
                        <p className="text-sm text-muted-foreground">Status: {j.status}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={async () => {
                          try { 
                            await contractorJobsApi.start(j.id); 
                            toast({ title: 'Job started' }); 
                            dispatch(setActiveJob(j));
                            refetch(); 
                          } catch {}
                        }}>Start</Button>
                        <Button size="sm" variant="secondary" onClick={async () => {
                          try { 
                            await contractorJobsApi.complete(j.id); 
                            toast({ title: 'Job completed' }); 
                            dispatch(clearActiveJob());
                            refetch(); 
                          } catch {}
                        }}>Complete</Button>
                        <Button size="sm" variant="outline" onClick={async () => {
                          const ids = prompt('Assign worker IDs (comma separated)') || '';
                          const workerIds = ids.split(',').map(s => s.trim()).filter(Boolean);
                          if (workerIds.length === 0) return;
                          try { await contractorJobsApi.assignWorkers(j.id, workerIds); toast({ title: 'Workers assigned' }); refetch(); } catch {}
                        }}>Assign</Button>
                      </div>
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

export default MyJobs;


