import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authApi } from '@/lib/api/auth';
import { 
  Search, 
  Briefcase, 
  Users, 
  DollarSign, 
  TrendingUp,
  MapPin,
  Star
} from 'lucide-react';

const ContractorDashboard = () => {
  const navigate = useNavigate();
  const user = authApi.getCurrentUser();

  const stats = [
    {
      icon: Briefcase,
      label: 'Active Jobs',
      value: '0',
      color: 'text-primary'
    },
    {
      icon: Users,
      label: 'Workers',
      value: '0',
      color: 'text-secondary'
    },
    {
      icon: Star,
      label: 'Rating',
      value: '0.0',
      color: 'text-accent'
    },
    {
      icon: DollarSign,
      label: 'Earnings',
      value: '₹0',
      color: 'text-success'
    }
  ];

  const nearbyJobs = [
    // Placeholder for when we implement job fetching
  ];

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
                Find jobs and grow your business
              </p>
            </div>
            <Button
              size="lg"
              className="gap-2"
              onClick={() => navigate('/contractor/jobs')}
            >
              <Search className="h-5 w-5" />
              Browse Jobs
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="border-0 shadow-md">
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
            <Card className="border-0 shadow-md hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/contractor/jobs')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  Find Jobs
                </CardTitle>
                <CardDescription>
                  Browse available jobs in your area
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/contractor/workers')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-secondary" />
                  My Workers
                </CardTitle>
                <CardDescription>
                  Manage your team of workers
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/contractor/earnings')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-accent" />
                  Earnings
                </CardTitle>
                <CardDescription>
                  View your earnings and payouts
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Nearby Jobs */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Nearby Jobs
              </CardTitle>
              <CardDescription>Job opportunities in your area</CardDescription>
            </CardHeader>
            <CardContent>
              {nearbyJobs.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No jobs available</h3>
                  <p className="text-muted-foreground mb-4">
                    Check back later for new opportunities
                  </p>
                  <Button onClick={() => navigate('/contractor/profile')}>
                    Complete Your Profile
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Jobs will be listed here */}
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

export default ContractorDashboard;
