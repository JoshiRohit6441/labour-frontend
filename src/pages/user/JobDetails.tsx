
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { userJobsApi } from '@/lib/api/user';
import { QuoteList } from '@/components/user/QuoteList';
import RazorpayButton from '@/components/payments/RazorpayButton';

import { useJobSocket } from '@/hooks/useJobSocket';

import { useState, useEffect } from 'react';
import Map from '@/components/ui/Map';
import { getSocket } from '@/lib/socket/client';

const UserJobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [workerPosition, setWorkerPosition] = useState<{ latitude: number; longitude: number } | null>(null);

  useJobSocket(jobId as string);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['user-job-details', jobId],
    queryFn: () => userJobsApi.details(jobId as string),
    enabled: !!jobId,
  });

  useEffect(() => {
    const socket = getSocket();
    socket.connect();

    socket.on('location:update', (data) => {
      setWorkerPosition(data);
    });

    return () => {
      socket.off('location:update');
      socket.disconnect();
    };
  }, [jobId]);

  const job = data?.job as any;
  const acceptedQuote = job?.quotes?.find((q: any) => q.id === job.acceptedQuoteId);

  const canPayAdvance = acceptedQuote && acceptedQuote.advanceRequested && job.advancePaid === 0;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !job) {
    return <div>Error loading job details or job not found.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <Button variant="outline" onClick={() => navigate('/user/dashboard')} className="mb-4">
            ← Back to Dashboard
          </Button>

          {job.isLocationTracking && workerPosition && (
            <Map 
              center={[workerPosition.latitude, workerPosition.longitude]} 
              zoom={13} 
              marker={{ position: [workerPosition.latitude, workerPosition.longitude], popupContent: "Worker's Location" }} 
            />
          )}

          <Card className="border-0 shadow-md mb-8">
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>{job.title}</CardTitle>
                <CardDescription>
                  {job.jobType} • {job.status} • {job.city}, {job.state}
                </CardDescription>
              </div>
              {canPayAdvance && (
                <RazorpayButton 
                  amount={acceptedQuote.advanceAmount}
                  jobId={job.id}
                  paymentType="ADVANCE"
                  label={`Pay Advance: ₹${acceptedQuote.advanceAmount}`}
                />
              )}
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{job.description}</p>
            </CardContent>
          </Card>

          {job.jobType === 'BIDDING' && job.status !== 'ACCEPTED' && (
            <Card>
              <CardHeader>
                <CardTitle>Quotes Received</CardTitle>
              </CardHeader>
              <CardContent>
                <QuoteList quotes={job.quotes || []} jobId={job.id} onQuoteAccepted={refetch} />
              </CardContent>
            </Card>
          )}

          {job.status === 'ACCEPTED' && acceptedQuote && (
            <Card>
              <CardHeader>
                <CardTitle>Accepted Quote</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Details of the accepted quote from {acceptedQuote.contractor.businessName}...</p>
              </CardContent>
            </Card>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserJobDetails;