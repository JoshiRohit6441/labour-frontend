import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { authApi } from '@/lib/api/auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const VerifyOtp = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [otp, setOtp] = useState('');
  const phone = searchParams.get('phone') || '';

  useEffect(() => {
    if (!phone) {
      navigate('/register');
    }
  }, [phone, navigate]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter a 6-digit OTP',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.verifyOtp({ phone, otp });
      toast({
        title: 'Success!',
        description: response.message || 'Phone number verified successfully',
      });
      navigate('/login');
    } catch (error: any) {
      toast({
        title: 'Verification Failed',
        description: error.response?.data?.message || 'Invalid OTP. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);

    try {
      const response = await authApi.resendOtp(phone);
      toast({
        title: 'OTP Sent',
        description: response.message || 'A new OTP has been sent to your phone',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to resend OTP',
        description: error.response?.data?.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setResending(false);
    }
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
              onClick={() => navigate('/register')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <CardTitle className="text-2xl font-bold">
              Verify your phone
            </CardTitle>
            <CardDescription>
              Enter the 6-digit code sent to {phone}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              onClick={handleVerify}
              className="w-full"
              disabled={loading || otp.length !== 6}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Didn't receive the code? </span>
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={handleResend}
                disabled={resending}
                type="button"
              >
                {resending ? 'Sending...' : 'Resend OTP'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyOtp;
