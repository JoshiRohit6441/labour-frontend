
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { contractorJobsApi } from '@/lib/api/contractor';
import { AdvancedQuoteForm } from '@/components/contractor/AdvancedQuoteForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const SubmitQuotePage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['contractor-job-details', jobId],
    queryFn: () => contractorJobsApi.details(jobId as string),
    enabled: !!jobId,
  });

  const job = data?.data?.job as any;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-muted/30 flex items-center justify-center">
          <div className="text-muted-foreground">Loading Job Details...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-muted/30 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Job not found</p>
              <Button className="w-full mt-4" onClick={() => navigate('/contractor/jobs')}>
                Back to Jobs
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <Button variant="outline" onClick={() => navigate(`/contractor/jobs/${jobId}`)} className="mb-4">
            ← Back to Job Details
          </Button>
          <Card className="max-w-3xl mx-auto border-0 shadow-md">
            <CardHeader>
              <CardTitle>Submit Quote</CardTitle>
              <CardDescription>For job: {job.title}</CardDescription>
            </CardHeader>
            <CardContent>
              <AdvancedQuoteForm job={job} />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SubmitQuotePage;
