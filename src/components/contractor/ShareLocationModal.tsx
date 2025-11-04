
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { contractorLocationApi } from '@/lib/api/contractor';

interface ShareLocationModalProps {
  jobId: string;
  onSuccess: (code: string) => void;
  onClose: () => void;
}

export const ShareLocationModal = ({ jobId, onSuccess, onClose }: ShareLocationModalProps) => {
  const { toast } = useToast();
  const [workerPhone, setWorkerPhone] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await contractorLocationApi.share(jobId, workerPhone);
      const securityCode = response.data.securityCode;
      toast({ 
        title: 'Security Code Generated',
        description: `Share this code with the worker: ${securityCode}`,
      });
      onSuccess(securityCode);
    } catch (error: any) {
      toast({ 
        title: 'Failed to share location',
        description: error?.response?.data?.message || 'An error occurred',
        variant: 'destructive' 
      });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Location with Worker</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="workerPhone">Worker's Phone Number</Label>
            <Input id="workerPhone" value={workerPhone} onChange={(e) => setWorkerPhone(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Generate Code</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
