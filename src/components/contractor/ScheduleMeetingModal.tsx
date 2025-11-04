
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { contractorJobsApi } from '@/lib/api/contractor';
import { useToast } from '@/hooks/use-toast';

interface ScheduleMeetingModalProps {
  jobId: string;
  onSuccess: () => void;
  onClose: () => void;
}

export const ScheduleMeetingModal = ({ jobId, onSuccess, onClose }: ScheduleMeetingModalProps) => {
  const { toast } = useToast();
  const [meetingTime, setMeetingTime] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async () => {
    try {
      await contractorJobsApi.scheduleMeeting(jobId, { meetingTime, location, notes });
      toast({ title: 'Meeting scheduled successfully!' });
      onSuccess();
    } catch (error: any) {
      toast({ 
        title: 'Failed to schedule meeting',
        description: error?.response?.data?.message || 'An error occurred',
        variant: 'destructive' 
      });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Meeting</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="meetingTime">Meeting Time</Label>
            <Input id="meetingTime" type="datetime-local" value={meetingTime} onChange={(e) => setMeetingTime(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Schedule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
