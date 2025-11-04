import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { contractorWorkersApi } from '@/lib/api/contractor';
import { useToast } from '@/hooks/use-toast';

interface WorkerSelectionModalProps {
  jobId: string;
  workersNeeded: number;
  scheduledDate?: string | Date | null;
  onSelect: (workerIds: string[]) => void;
  onClose: () => void;
}

const WorkerSelectionModal = ({ jobId, workersNeeded, scheduledDate, onSelect, onClose }: WorkerSelectionModalProps) => {
  const { toast } = useToast();
  const [selectedWorkerIds, setSelectedWorkerIds] = useState<string[]>([]);

  const { data: workersData, isLoading } = useQuery({
    queryKey: ['contractor-workers', 'available', scheduledDate],
    queryFn: () => contractorWorkersApi.list(1, 100),
  });

  // Filter workers by availability if scheduledDate is provided
  const workers = (workersData?.workers || []).filter(worker => {
    if (!scheduledDate) return true; // For IMMEDIATE jobs, all workers available
    
    // For SCHEDULED jobs, we'll show all workers but indicate availability
    // The backend will validate availability during job acceptance
    return worker.isActive;
  });

  const toggleWorker = (workerId: string) => {
    setSelectedWorkerIds(prev => {
      if (prev.includes(workerId)) {
        return prev.filter(id => id !== workerId);
      }
      if (prev.length >= workersNeeded) {
        toast({ 
          title: 'Maximum workers selected', 
          description: `This job requires ${workersNeeded} worker(s).`,
          variant: 'destructive'
        });
        return prev;
      }
      return [...prev, workerId];
    });
  };

  const handleConfirm = () => {
    if (selectedWorkerIds.length < workersNeeded) {
      toast({ 
        title: 'Incomplete selection', 
        description: `Please select ${workersNeeded} worker(s).`,
        variant: 'destructive'
      });
      return;
    }
    onSelect(selectedWorkerIds);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Workers</DialogTitle>
          <DialogDescription>
            Select {workersNeeded} worker(s) for this job
            {scheduledDate && ` scheduled for ${new Date(scheduledDate).toLocaleDateString()}`}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading workers...</div>
        ) : workers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No workers available. Please add workers first.
          </div>
        ) : (
          <>
            <div className="space-y-3 mt-4">
              {workers
                .filter(w => w.isActive)
                .map(worker => (
                  <div
                    key={worker.id}
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer ${
                      selectedWorkerIds.includes(worker.id) ? 'bg-primary/10 border-primary' : ''
                    }`}
                    onClick={() => toggleWorker(worker.id)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Checkbox
                        checked={selectedWorkerIds.includes(worker.id)}
                        onCheckedChange={() => toggleWorker(worker.id)}
                      />
                      <div>
                        <p className="font-medium">
                          {worker.firstName} {worker.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {worker.skills?.join(', ') || 'No skills listed'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Rating: {worker.rating?.toFixed(1) || 'N/A'} • 
                          Jobs: {worker.completedJobs || 0}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {worker.dailyRate ? `₹${worker.dailyRate}/day` : worker.hourlyRate ? `₹${worker.hourlyRate}/hr` : ''}
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Selected: {selectedWorkerIds.length} / {workersNeeded}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleConfirm} disabled={selectedWorkerIds.length !== workersNeeded}>
                  Confirm & Assign
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WorkerSelectionModal;

