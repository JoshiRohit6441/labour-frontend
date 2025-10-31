import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { userJobsApi } from '@/lib/api/user';
import RazorpayButton from '@/components/payments/RazorpayButton';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['user-job-details', jobId],
    queryFn: () => userJobsApi.details(jobId as string),
    enabled: !!jobId,
  });

  const job = data?.data as any;
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const acceptQuote = async (quoteId: string) => {
    try {
      await userJobsApi.acceptQuote(jobId as string, quoteId);
      toast({ title: 'Quote accepted' });
      refetch();
    } catch (e: any) {
      toast({ title: 'Failed to accept quote', description: e?.response?.data?.message, variant: 'destructive' });
    }
  };

  const startEdit = () => {
    setTitle(job?.title || '');
    setDescription(job?.description || '');
    setEditing(true);
  };

  const saveEdit = async () => {
    try {
      await userJobsApi.update(jobId as string, { title, description });
      toast({ title: 'Job updated' });
      setEditing(false);
      refetch();
    } catch (e: any) {
      toast({ title: 'Failed to update', description: e?.response?.data?.message, variant: 'destructive' });
    }
  };

  const submitReview = async () => {
    try {
      await userJobsApi.submitReview(jobId as string, { rating, comment });
      toast({ title: 'Review submitted' });
      setComment('');
    } catch (e: any) {
      toast({ title: 'Failed to submit review', description: e?.response?.data?.message, variant: 'destructive' });
    }
  };

  const cancelJob = async () => {
    try {
      await userJobsApi.cancel(jobId as string);
      toast({ title: 'Job cancelled' });
      navigate('/user/jobs');
    } catch (e: any) {
      toast({ title: 'Failed to cancel job', description: e?.response?.data?.message, variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">Back</Button>
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>{isLoading ? 'Loading...' : job?.title}</CardTitle>
              <CardDescription>{job?.status}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-2">
                  {!editing && (
                    <Button variant="secondary" onClick={startEdit}>Edit</Button>
                  )}
                  {editing && (
                    <>
                      <Button onClick={saveEdit}>Save</Button>
                      <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                    </>
                  )}
                  <Button variant="outline" onClick={cancelJob}>Cancel Job</Button>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  {!editing ? (
                    <p>{job?.description}</p>
                  ) : (
                    <div className="space-y-2">
                      <input className="border rounded px-3 py-2 w-full" value={title} onChange={(e) => setTitle(e.target.value)} />
                      <textarea className="border rounded px-3 py-2 w-full" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quotes</p>
                  {job?.quotes?.length ? (
                    <div className="space-y-3">
                      {job.quotes.map((q: any) => (
                        <div key={q.id} className="flex items-center justify-between py-2 border-b last:border-0">
                          <div>
                            <p className="font-medium">₹{q.amount}</p>
                            <p className="text-sm text-muted-foreground">By: {q.contractor?.businessName || q.contractor?.id}</p>
                          </div>
                          <Button size="sm" onClick={() => acceptQuote(q.id)}>Accept</Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No quotes yet.</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Make a payment</p>
                  <RazorpayButton amount={job?.budget || 1} jobId={jobId as string} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Leave a review</p>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm">Rating</label>
                    <input type="number" min={1} max={5} className="border rounded px-2 py-1 w-20" value={rating} onChange={(e) => setRating(Number(e.target.value))} />
                  </div>
                  <textarea className="border rounded px-3 py-2 w-full mb-2" placeholder="Comment" value={comment} onChange={(e) => setComment(e.target.value)} />
                  <Button size="sm" onClick={submitReview}>Submit Review</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JobDetails;


