import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { contractorJobsApi } from '@/lib/api/contractor';
import { useToast } from '@/hooks/use-toast';

interface QuoteSubmissionModalProps {
  jobId: string;
  job: any;
  onSuccess: () => void;
  onClose: () => void;
}

const QuoteSubmissionModal = ({ jobId, job, onSuccess, onClose }: QuoteSubmissionModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    totalAmount: '',
    estimatedArrival: '',
    notes: '',
    meetingScheduledOn: '',
    addOns: [] as Array<{ description: string; amount: string }>,
    documents: [] as string[]
  });
  const [newAddOn, setNewAddOn] = useState({ description: '', amount: '' });
  const [uploadingFiles, setUploadingFiles] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        amount: parseFloat(formData.amount),
        totalAmount: formData.totalAmount ? parseFloat(formData.totalAmount) : undefined,
        estimatedArrival: formData.estimatedArrival || undefined,
        notes: formData.notes || undefined,
        meetingScheduledOn: formData.meetingScheduledOn ? new Date(formData.meetingScheduledOn).toISOString() : undefined,
        addOns: formData.addOns.length > 0 ? formData.addOns.map(a => ({
          description: a.description,
          amount: parseFloat(a.amount)
        })) : undefined,
        documents: formData.documents
      };

      await contractorJobsApi.submitQuote(jobId, payload);
      toast({ title: 'Quote submitted successfully!' });
      onSuccess();
    } catch (e: any) {
      toast({ 
        title: 'Failed to submit quote', 
        description: e?.response?.data?.message || 'An error occurred',
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  const addAddOn = () => {
    if (newAddOn.description && newAddOn.amount) {
      setFormData(prev => ({
        ...prev,
        addOns: [...prev.addOns, newAddOn]
      }));
      setNewAddOn({ description: '', amount: '' });
    }
  };

  const removeAddOn = (index: number) => {
    setFormData(prev => ({
      ...prev,
      addOns: prev.addOns.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingFiles(true);
    try {
      // TODO: Implement file upload to S3/Cloudinary
      // For now, we'll use a placeholder - this needs backend file upload endpoint
      const fileUrls: string[] = [];
      
      // Placeholder: In production, upload files to S3/Cloudinary and get URLs
      for (let i = 0; i < files.length; i++) {
        // This should call an upload API endpoint
        // const uploadResult = await uploadFile(files[i]);
        // fileUrls.push(uploadResult.url);
        
        // Temporary: show file names (will need backend upload endpoint)
        fileUrls.push(`placeholder_${files[i].name}`);
      }

      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...fileUrls]
      }));
      
      toast({ title: 'Files selected', description: 'Note: File upload functionality requires backend implementation' });
    } catch (error) {
      toast({ 
        title: 'File upload failed', 
        description: 'Please try again or contact support',
        variant: 'destructive'
      });
    } finally {
      setUploadingFiles(false);
    }
  };

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Quote</DialogTitle>
          <DialogDescription>
            Submit your quote for this job
            {job.quoteSubmissionDeadline && (
              <span className="block mt-1 text-orange-600">
                Deadline: {new Date(job.quoteSubmissionDeadline).toLocaleDateString()}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Base Amount (INR) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="totalAmount">Total Amount (INR)</Label>
              <Input
                id="totalAmount"
                type="number"
                step="0.01"
                value={formData.totalAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, totalAmount: e.target.value }))}
                placeholder="Leave empty to use base amount"
              />
            </div>
          </div>

          {job.siteVisitDeadline && (
            <div>
              <Label htmlFor="meetingScheduledOn">Site Visit Date</Label>
              <Input
                id="meetingScheduledOn"
                type="datetime-local"
                max={job.siteVisitDeadline ? new Date(job.siteVisitDeadline).toISOString().slice(0, 16) : undefined}
                value={formData.meetingScheduledOn}
                onChange={(e) => setFormData(prev => ({ ...prev, meetingScheduledOn: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Must be before {new Date(job.siteVisitDeadline).toLocaleDateString()}
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="estimatedArrival">Estimated Arrival</Label>
            <Input
              id="estimatedArrival"
              value={formData.estimatedArrival}
              onChange={(e) => setFormData(prev => ({ ...prev, estimatedArrival: e.target.value }))}
              placeholder="e.g., 30 minutes"
            />
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          <div>
            <Label>Documents</Label>
            <div className="space-y-2">
              <Input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                disabled={uploadingFiles}
              />
              <p className="text-xs text-muted-foreground">
                Upload quote documents (PDF, Word, Images). Max 10MB per file.
              </p>
              {formData.documents.length > 0 && (
                <div className="space-y-1">
                  {formData.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                      <span>{doc.replace('placeholder_', '')}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <Label>Add-ons</Label>
            <div className="space-y-2">
              {formData.addOns.map((addOn, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded">
                  <div className="flex-1">
                    <p className="font-medium">{addOn.description}</p>
                    <p className="text-sm text-muted-foreground">₹{addOn.amount}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAddOn(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  placeholder="Add-on description"
                  value={newAddOn.description}
                  onChange={(e) => setNewAddOn(prev => ({ ...prev, description: e.target.value }))}
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Amount"
                  value={newAddOn.amount}
                  onChange={(e) => setNewAddOn(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-32"
                />
                <Button type="button" onClick={addAddOn} variant="outline">
                  Add
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.amount}>
              {loading ? 'Submitting...' : 'Submit Quote'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteSubmissionModal;

