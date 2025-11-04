import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { userJobsApi } from '@/lib/api/user';
import { Plus, Briefcase } from 'lucide-react';

const UserJobs = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['user-jobs', page],
    queryFn: () => userJobsApi.list(page, limit),
    // keepPreviousData: true,
  });


  const items = data?.data?.jobs || [];
  const pagination = data?.data?.pagination || {};

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container py-8 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Jobs</h1>
              <p className="text-muted-foreground">View and manage your job postings</p>
            </div>
            <Button onClick={() => navigate('/user/jobs/create')} className="gap-2">
              <Plus className="h-4 w-4" /> New Job
            </Button>
          </div>

          {/* Jobs List */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Jobs</CardTitle>
              <CardDescription>Page {pagination.currentPage || 1} of {pagination.totalPages || 1}</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-muted-foreground">Loading...</div>
              ) : items.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="mb-4">No jobs posted yet.</p>
                  <Button onClick={() => navigate('/user/jobs/create')}>Post a Job</Button>
                </div>
              ) : (
                <>
                  {/* Job Cards */}
                  <div className="grid gap-4 mb-6">
                    {items.map((job) => (
                      <Card key={job.id} className="border">
                        <CardContent className="pt-6 flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{job.title}</p>
                            <p className="text-sm text-muted-foreground">
                              Status: {job.status}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              City: {job.city}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => navigate(`/user/jobs/${job.id}`)}
                          >
                            View
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      disabled={!pagination.hasPrevPage || isFetching}
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {pagination.currentPage || 1} of {pagination.totalPages || 1}
                    </span>
                    <Button
                      variant="outline"
                      disabled={!pagination.hasNextPage || isFetching}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserJobs;
