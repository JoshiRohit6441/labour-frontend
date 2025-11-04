
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Map from '@/components/ui/Map';
import { contractorJobsApi } from '@/lib/api/contractor';
import { useEffect, useState } from 'react';
import { Job } from '@/types';

interface CustomWindow extends Window {
  socketService: {
    socket: any;
  };
}

declare const window: CustomWindow;

const TrackWorkerPage = () => {
  const { jobId } = useParams();
  const [workerLocation, setWorkerLocation] = useState<{ lat: number; lng: number } | null>(null);

  const { data: jobData, isLoading: isJobLoading } = useQuery({
    queryKey: ['job-details', jobId],
    queryFn: () => contractorJobsApi.details(jobId as string),
    enabled: !!jobId,
  });

  const job: Job | undefined = jobData?.data?.job;

  useEffect(() => {
    const socket = window.socketService.socket;
    if (socket && job) {
      socket.on('location_update', (data: { jobId: string; latitude: number; longitude: number }) => {
        if (data.jobId === jobId) {
          setWorkerLocation({ lat: data.latitude, lng: data.longitude });
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('location_update');
      }
    };
  }, [job, jobId]);

  if (isJobLoading) {
    return <div>Loading...</div>;
  }

  if (!job) {
    return <div>Job not found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <Card>
            <CardHeader>
              <CardTitle>Track Worker</CardTitle>
              <CardDescription>{job.title} - {job.address}</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ height: '500px' }}>
                <Map
                  center={[job.latitude, job.longitude]}
                  zoom={13}
                  marker={workerLocation ? { position: [workerLocation.lat, workerLocation.lng] } : undefined}
                  destination={{ lat: job.latitude, lng: job.longitude }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TrackWorkerPage;
