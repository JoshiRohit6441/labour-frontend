import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { 
  Briefcase, 
  Users, 
  Clock, 
  Shield, 
  CheckCircle2, 
  Star,
  ArrowRight,
  Search,
  MessageSquare,
  CreditCard
} from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Search,
      title: 'Find Skilled Workers',
      description: 'Browse verified contractors with ratings and reviews'
    },
    {
      icon: MessageSquare,
      title: 'Direct Communication',
      description: 'Chat with contractors and negotiate terms'
    },
    {
      icon: CreditCard,
      title: 'Secure Payments',
      description: 'Safe and hassle-free payment processing'
    },
    {
      icon: Shield,
      title: 'Verified Profiles',
      description: 'All contractors are background checked'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Post Your Job',
      description: 'Describe the work you need done'
    },
    {
      number: '02',
      title: 'Get Quotes',
      description: 'Receive competitive quotes from contractors'
    },
    {
      number: '03',
      title: 'Hire & Pay',
      description: 'Choose your contractor and complete the job'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero z-0" />
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="container relative z-10 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center text-white animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Skilled Labour for Your Next Project
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/90">
              Connect with verified contractors and get your work done efficiently. 
              Post a job or find work in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="text-lg px-8"
                onClick={() => navigate('/register?role=user')}
              >
                I Need Workers
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg"
                className="text-lg px-8 bg-white text-primary hover:bg-white/90"
                onClick={() => navigate('/register?role=contractor')}
              >
                I'm a Contractor
                <Briefcase className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose LabourHire?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We make hiring and finding work simple, secure, and efficient
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                      <feature.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">Get started in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="border-0 shadow-md h-full">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary text-white text-2xl font-bold">
                        {step.number}
                      </div>
                      <h3 className="font-semibold text-xl">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </CardContent>
                </Card>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Active Contractors', value: '5,000+' },
              { label: 'Jobs Completed', value: '25,000+' },
              { label: 'Happy Customers', value: '10,000+' },
              { label: 'Cities Covered', value: '50+' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm md:text-base text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <Card className="border-0 shadow-xl bg-gradient-card">
            <CardContent className="py-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied users and contractors on our platform
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="text-lg px-8"
                  onClick={() => navigate('/register')}
                >
                  Sign Up Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="text-lg px-8"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
