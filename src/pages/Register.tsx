import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { authApi, RegisterData } from '@/lib/api/auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';

const Register = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<RegisterData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    role: (searchParams.get('role')?.toUpperCase() as 'USER' | 'CONTRACTOR') || 'USER',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authApi.register(formData);
      toast({
        title: 'Success!',
        description: response.message || 'Registration successful. Please verify your phone number.',
      });
      // Navigate to OTP verification with phone number
      navigate(`/verify-otp?phone=${formData.phone}`);
    } catch (error: any) {
      toast({
        title: 'Registration Failed',
        description: error.response?.data?.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-fit -ml-2"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <CardTitle className="text-2xl font-bold">
              Create an account
            </CardTitle>
            <CardDescription>
              Register as a {formData.role === 'USER' ? 'Customer' : 'Contractor'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  maxLength={10}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                />
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters
                </p>
              </div>

              <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                <input
                  type="radio"
                  id="user"
                  name="role"
                  value="USER"
                  checked={formData.role === 'USER'}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                <Label htmlFor="user" className="flex-1 cursor-pointer">
                  I need workers (Customer)
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                <input
                  type="radio"
                  id="contractor"
                  name="role"
                  value="CONTRACTOR"
                  checked={formData.role === 'CONTRACTOR'}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                <Label htmlFor="contractor" className="flex-1 cursor-pointer">
                  I'm a contractor (Service Provider)
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => navigate('/login')}
                  type="button"
                >
                  Login
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
