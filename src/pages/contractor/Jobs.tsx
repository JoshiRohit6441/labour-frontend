import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { contractorJobsApi } from '@/lib/api/contractor';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const ContractorJobs = () => {
  const navigate = useNavigate();
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
                      <div 
                        className="flex-1 cursor-pointer" 
                        onClick={() => navigate(`/contractor/jobs/${j.id}`)}
                      >
                        <p className="font-medium">{j.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {j.jobType} • {j.city}, {j.state} • Budget: ₹{j.budget || '—'}
                        </p>
                        {j.scheduledStartDate && (
                          <p className="text-xs text-muted-foreground">
                            Scheduled: {new Date(j.scheduledStartDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/contractor/jobs/${j.id}`);
                        }}
                      >
                        View Details
                      </Button>
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


