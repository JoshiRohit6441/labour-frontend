
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Map from '@/components/ui/Map';
import { useGeolocation } from '@/hooks/useGeolocation';
import { userWorkerApi } from '@/lib/api/user'; // Updated import
import { useQuery } from '@tanstack/react-query';
import { contractorJobsApi } from '@/lib/api/contractor';

const WorkerJourney = () => {
  const { jobId } = useParams();
  const [isTraveling, setIsTraveling] = useState(false);
  const location = useGeolocation();
  const [token, setToken] = useState<string | null>(null); // Added token state

  const { data: jobData } = useQuery({
    queryKey: ['job-details-for-worker', jobId],
    queryFn: () => contractorJobsApi.details(jobId as string),
    enabled: !!jobId,
  });

  const job = jobData?.data?.job;

  useEffect(() => {
    // Retrieve token from local storage or context if available
    const storedToken = localStorage.getItem('workerToken'); // Assuming token is stored
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (isTraveling && location.latitude && location.longitude && token) {
      const interval = setInterval(() => {
        userWorkerApi.updateLocation(token, location.latitude!, location.longitude!); // Updated usage
      }, 5000); // Send location every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isTraveling, location, jobId, token]); // Added token to dependency array

  const handleStartTravel = () => {
    setIsTraveling(true);
    // Notify user
    const socketService = (window as any).socketService;
    if (socketService) {
      socketService.emit('location:start', { jobId });
    }
  };

  const handleEndTravel = () => {
    setIsTraveling(false);
    // Notify user
    const socketService = (window as any).socketService;
    if (socketService) {
      socketService.emit('location:end', { jobId });
    }
  };

  if (!job) {
    return <div>Loading job details...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Job Journey: {job.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {location.latitude && location.longitude && (
            <Map 
              center={[location.latitude, location.longitude]} 
              zoom={13} 
              marker={{ position: [location.latitude, location.longitude], popupContent: "Your Location" }} 
            />
          )}
          <div className="flex gap-4">
            {!isTraveling ? (
              <Button className="w-full" onClick={handleStartTravel}>Start Journey</Button>
            ) : (
              <Button className="w-full" variant="destructive" onClick={handleEndTravel}>End Journey</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkerJourney;
