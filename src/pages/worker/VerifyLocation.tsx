
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { userWorkerApi } from '@/lib/api/user';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const VerifyLocation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await userWorkerApi.verifyLocationCode(code, phone);
      const { job } = response.data;
      toast({ title: 'Verification successful!' });
      navigate(`/worker/track-job/${job.id}`);
    } catch (error: any) {
      toast({ 
        title: 'Verification failed',
        description: error?.response?.data?.message || 'An error occurred',
        variant: 'destructive' 
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Enter Security Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="phone">Your Phone Number</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="code">Security Code</Label>
              <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} />
            </div>
            <Button className="w-full" onClick={handleSubmit}>Verify and Start</Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default VerifyLocation;
