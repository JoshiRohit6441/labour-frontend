import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { contractorJobsApi } from '@/lib/api/contractor';
import Map from '@/components/ui/Map';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useQuery } from '@tanstack/react-query';
import { Job } from '@/types';
import { userWorkerApi } from '@/lib/api/user';

const WorkerTrackJob = () => {
  const { jobId } = useParams();
  const { toast } = useToast();
  const location = useGeolocation();
  const [securityCode, setSecurityCode] = useState('');
  const [workerPhone, setWorkerPhone] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isTraveling, setIsTraveling] = useState(false);

  const [token, setToken] = useState('');

  const { data: jobData, isLoading: isJobLoading } = useQuery({
    queryKey: ['job-details', jobId],
    queryFn: () => contractorJobsApi.details(jobId as string),
    enabled: !!jobId,
  });

  const job: Job | undefined = jobData?.data?.job;

  useEffect(() => {
    if (isTraveling && location.latitude && location.longitude && token) {
      const interval = setInterval(() => {
        userWorkerApi.updateLocation(token, location.latitude!, location.longitude!);
      }, 5000); // Send location every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isTraveling, location, token]);

  const handleVerifyCode = async () => {
    try {
      const response = await userWorkerApi.verifyLocationCode(jobId as string, securityCode, workerPhone);
      setToken(response.data.token);
      setIsVerified(true);
      toast({ title: 'Code verified successfully' });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'An error occurred';
      toast({ 
        title: 'Failed to verify code', 
        description: message,
        variant: 'destructive' 
      });
    }
  };

  const handleStartTravel = async () => {
    try {
      await userWorkerApi.startTravel(token);
      setIsTraveling(true);
      toast({ title: 'Travel started' });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'An error occurred';
      toast({ 
        title: 'Failed to start travel', 
        description: message,
        variant: 'destructive' 
      });
    }
  };

  if (isJobLoading) {
    return <div>Loading...</div>;
  }

  if (!job) {
    return <div>Job not found</div>;
  }

  if (!isVerified) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Verify Security Code</CardTitle>
            <CardDescription>Enter the security code and your phone number to start tracking your job.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="workerPhone">Your Phone Number</Label>
                <Input id="workerPhone" value={workerPhone} onChange={(e) => setWorkerPhone(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="securityCode">Security Code</Label>
                <Input id="securityCode" value={securityCode} onChange={(e) => setSecurityCode(e.target.value)} />
              </div>
              <Button onClick={handleVerifyCode} className="w-full">Verify</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="container py-8">
          <Card>
            <CardHeader>
              <CardTitle>Track Job</CardTitle>
              <CardDescription>{job.title} - {job.address}</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ height: '500px' }}>
                <Map
                  center={[job.latitude, job.longitude]}
                  zoom={13}
                  marker={location.latitude && location.longitude ? { position: [location.latitude, location.longitude] } : undefined}
                  destination={{ lat: job.latitude, lng: job.longitude }}
                />
              </div>
              {!isTraveling && (
                <Button onClick={handleStartTravel} className="w-full mt-4">Start Travel</Button>
              )}
              {isTraveling && (
                <Button onClick={() => setIsTraveling(false)} className="w-full mt-4" variant="destructive">Stop Travel</Button>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default WorkerTrackJob;