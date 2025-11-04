
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { locationApi } from '@/lib/api/location';

const WorkerVerify = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [workerPhone, setWorkerPhone] = useState('');
  const [securityCode, setSecurityCode] = useState('');

  const handleVerify = async () => {
    try {
      const response = await locationApi.verify(workerPhone, securityCode);
      const { jobId } = response.data;
      toast({ title: 'Verification Successful' });
      navigate(`/worker/journey/${jobId}`);
    } catch (error: any) {
      toast({ 
        title: 'Verification Failed',
        description: error?.response?.data?.message || 'An error occurred',
        variant: 'destructive' 
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Worker Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="workerPhone">Your Phone Number</Label>
            <Input id="workerPhone" value={workerPhone} onChange={(e) => setWorkerPhone(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="securityCode">Security Code</Label>
            <Input id="securityCode" value={securityCode} onChange={(e) => setSecurityCode(e.target.value)} />
          </div>
          <Button className="w-full" onClick={handleVerify}>Verify and Start Journey</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkerVerify;
