
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { contractorJobsApi } from '@/lib/api/contractor';
import { authApi } from '@/lib/api/auth';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import WorkerSelectionModal from '@/components/contractor/WorkerSelectionModal';
import { RequestAdvanceModal } from '@/components/contractor/RequestAdvanceModal';

import { ScheduleMeetingModal } from '@/components/contractor/ScheduleMeetingModal';

import { useAppDispatch, setActiveJob } from '@/store';

import { ShareLocationModal } from '@/components/contractor/ShareLocationModal';
import Map from '@/components/ui/Map';
import { useGeolocation } from '@/hooks/useGeolocation';
import { contractorLocationApi } from '@/lib/api/contractor';
import { Job, Quote } from '@/types';

const ContractorJobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [showAdvanceModal, setShowAdvanceModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showShareLocationModal, setShowShareLocationModal] = useState(false);
  const [isTraveling, setIsTraveling] = useState(false);
  const location = useGeolocation();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['contractor-job-details', jobId],
    queryFn: () => contractorJobsApi.details(jobId as string),
    enabled: !!jobId,
  });

  const job: Job | undefined = data?.data?.job;
  const user = authApi.getCurrentUser();
  const myQuote = job?.quotes?.find((q: Quote) => q.contractorId === user?.contractor?.id);

  useEffect(() => {
    if (isTraveling && location.latitude && location.longitude) {
      const interval = setInterval(() => {
        contractorLocationApi.update(jobId as string, location.latitude!, location.longitude!);
      }, 5000); // Send location every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isTraveling, location, jobId]);

  const handleAcceptJob = () => {
    if (job?.jobType === 'IMMEDIATE' || job?.jobType === 'SCHEDULED') {
      setShowWorkerModal(true);
    }
  };

  const handleWorkerSelect = async (workerIds: string[]) => {
    try {
      await contractorJobsApi.claimJob(jobId as string, workerIds);
      toast({ title: 'Job accepted successfully!' });
      dispatch(setActiveJob(job));
      refetch();
      setShowWorkerModal(false);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'An error occurred';
      toast({ 
        title: 'Failed to accept job', 
        description: message,
        variant: 'destructive' 
      });
    }
  };

  const handleScheduleMeeting = () => {
    setShowMeetingModal(true);
  };

  const handleMeetingSubmit = () => {
    setShowMeetingModal(false);
    refetch();
  };

  const handleCreateQuote = () => {
    navigate(`/contractor/jobs/${jobId}/submit-quote`);
  };

  const handleStartTravel = async () => {
    try {
      await contractorLocationApi.startTravel(jobId as string);
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

  const handleEndTravel = async () => {
    try {
      await contractorLocationApi.endTravel(jobId as string);
      setIsTraveling(false);
      toast({ title: 'Travel ended' });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'An error occurred';
      toast({ 
        title: 'Failed to end travel', 
        description: message,
        variant: 'destructive' 
      });
    }
  };

  const handleShareLocation = () => {
    setShowShareLocationModal(true);
  };

  const handleLocationShared = (code: string) => {
    setShowShareLocationModal(false);
    // The contractor now needs to share this code with the worker.
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-muted/30 flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
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

  const canAccept = (job.jobType === 'IMMEDIATE' || job.jobType === 'SCHEDULED') && 
                    job.status === 'PENDING' && 
                    !job.contractorId;
  const canScheduleMeeting = job.jobType === 'BIDDING' && job.status === 'PENDING';
  const canQuote = job.jobType === 'BIDDING' && job.status !== 'ACCEPTED' && job.status !== 'COMPLETED';
  const canRequestAdvance = job.status === 'ACCEPTED' && 
                          job.jobType === 'BIDDING' && 
                          job.contractorId === user?.contractor?.id &&
                          myQuote && !myQuote.advanceRequested && job.advancePaid === 0;
  const canTrackLocation = job.jobType === 'IMMEDIATE' && job.status === 'ACCEPTED';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
            ← Back
          </Button>

          {isTraveling && location.latitude && location.longitude && (
            <Map center={[location.latitude, location.longitude]} zoom={13} marker={{ position: [location.latitude, location.longitude] }} />
          )}

          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{job.title}</CardTitle>
                  <CardDescription>
                    {job.jobType} • {job.status} • {job.city}, {job.state}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">Actions</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {canScheduleMeeting && (
                        <DropdownMenuItem onClick={handleScheduleMeeting}>
                          Schedule Meeting
                        </DropdownMenuItem>
                      )}
                      {canAccept && (
                        <DropdownMenuItem onClick={handleAcceptJob}>
                          Accept Job
                        </DropdownMenuItem>
                      )}
                      {canQuote && (
                        <DropdownMenuItem onClick={handleCreateQuote}>
                          {myQuote ? 'Update Quote' : 'Create Quote'}
                        </DropdownMenuItem>
                      )}
                      {canRequestAdvance && (
                        <DropdownMenuItem onClick={() => setShowAdvanceModal(true)}>
                          Request Advance
                        </DropdownMenuItem>
                      )}
                      {canTrackLocation && !isTraveling && (
                        <DropdownMenuItem onClick={handleStartTravel}>Start Travel</DropdownMenuItem>
                      )}
                      {canTrackLocation && isTraveling && (
                        <DropdownMenuItem onClick={handleEndTravel}>End Travel</DropdownMenuItem>
                      )}
                      {canTrackLocation && (
                        <DropdownMenuItem onClick={handleShareLocation}>Share Location</DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Job Description</h3>
                <p className="text-sm text-muted-foreground">{job.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium">Number of Workers</h3>
                  <p className="text-sm text-muted-foreground">{job.numberOfWorkers}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills?.map((skill: string) => (
                      <Badge key={skill}>{skill}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />

      {showWorkerModal && (
        <WorkerSelectionModal
          jobId={jobId as string}
          workersNeeded={job.workersNeeded || job.numberOfWorkers || 1}
          scheduledDate={job.scheduledStartDate || job.scheduledDate}
          onSelect={handleWorkerSelect}
          onClose={() => setShowWorkerModal(false)}
        />
      )}

      {showAdvanceModal && myQuote && (
        <RequestAdvanceModal
          job={job}
          quote={myQuote}
          onSuccess={() => {
            setShowAdvanceModal(false);
            refetch();
          }}
          onClose={() => setShowAdvanceModal(false)}
        />
      )}

      {showMeetingModal && (
        <ScheduleMeetingModal 
          jobId={jobId as string} 
          onSuccess={handleMeetingSubmit} 
          onClose={() => setShowMeetingModal(false)} 
        />
      )}

      {showShareLocationModal && (
        <ShareLocationModal 
          jobId={jobId as string} 
          onSuccess={handleLocationShared} 
          onClose={() => setShowShareLocationModal(false)} 
        />
      )}
    </div>
  );
};

export default ContractorJobDetails;


