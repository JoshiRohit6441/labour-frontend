import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authApi } from '@/lib/api/auth';
import { userDashboardApi } from '@/lib/api/user';
import { useQuery } from '@tanstack/react-query';
import { 
  Plus, 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  TrendingUp,
  Calendar,
  DollarSign
} from 'lucide-react';

const UserDashboard = () => {
  const navigate = useNavigate();
  const user = authApi.getCurrentUser();

  const { data: statsData } = useQuery({
    queryKey: ['user-dashboard-stats'],
    queryFn: userDashboardApi.getStats,
  });

  const { data: recentJobsData } = useQuery({
    queryKey: ['user-dashboard-recent-jobs'],
    queryFn: userDashboardApi.getRecentJobs,
  });

  const stats = [
    {
      icon: Briefcase,
      label: 'Total Jobs',
      value: statsData?.stats?.totalJobs || 0,
      color: 'text-primary'
    },
    {
      icon: Clock,
      label: 'Active Jobs',
      value: statsData?.stats?.activeJobs || 0,
      color: 'text-secondary'
    },
    {
      icon: CheckCircle2,
      label: 'Completed',
      value: statsData?.stats?.completedJobs || 0,
      color: 'text-success'
    },
    {
      icon: DollarSign,
      label: 'Total Spent',
      value: `₹${statsData?.stats?.totalSpent || 0}`,
      color: 'text-accent'
    }
  ];

  const recentJobs = recentJobsData?.recentJobs || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-muted-foreground">
                Manage your jobs and find skilled contractors
              </p>
            </div>
            <Button
              size="lg"
              className="gap-2"
              onClick={() => navigate('/user/jobs/create')}
            >
              <Plus className="h-5 w-5" />
              Post New Job
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="border-0 shadow-lg bg-gradient-to-br from-card to-card-foreground/5">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`h-12 w-12 rounded-full bg-muted flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 shadow-md hover:shadow-lg transition-all cursor-pointer bg-primary/5" onClick={() => navigate('/user/jobs/create')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  Post a Job
                </CardTitle>
                <CardDescription>
                  Create a new job posting and receive quotes
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-all cursor-pointer bg-secondary/5" onClick={() => navigate('/user/jobs')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-secondary" />
                  My Jobs
                </CardTitle>
                <CardDescription>
                  View and manage your job postings
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-all cursor-pointer bg-accent/5" onClick={() => navigate('/user/payments')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-accent" />
                  Payments
                </CardTitle>
                <CardDescription>
                  View payment history and invoices
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Recent Jobs */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Recent Jobs</CardTitle>
              <CardDescription>Your latest job postings</CardDescription>
            </CardHeader>
            <CardContent>
              {recentJobs.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No jobs yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start by posting your first job
                  </p>
                  <Button onClick={() => navigate('/user/jobs/create')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Post a Job
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentJobs.map((job: any) => (
                    <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold">{job.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {job.contractor?.businessName || 'Not assigned'} • <span className={`font-medium ${job.status === 'COMPLETED' ? 'text-success' : 'text-secondary'}`}>{job.status}</span>
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => navigate(`/user/jobs/${job.id}`)}>View</Button>
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

export default UserDashboard;
