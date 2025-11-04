
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { contractorJobsApi } from '@/lib/api/contractor';

interface RequestAdvanceModalProps {
  job: any;
  quote: any;
  onSuccess: () => void;
  onClose: () => void;
}

export const RequestAdvanceModal = ({ job, quote, onSuccess, onClose }: RequestAdvanceModalProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const maxAdvance = (quote.totalAmount || quote.amount) * 0.20;

  const advanceSchema = z.object({
    amount: z.preprocess(
      (a) => parseFloat(z.string().parse(a)),
      z.number().positive('Amount must be positive').max(maxAdvance, `Advance cannot exceed 20% (₹${maxAdvance.toFixed(2)})`)
    ),
  });

  const form = useForm<z.infer<typeof advanceSchema>>({
    resolver: zodResolver(advanceSchema),
    defaultValues: { amount: Number(maxAdvance.toFixed(2)) },
  });

  const onSubmit = async (values: z.infer<typeof advanceSchema>) => {
    setIsSubmitting(true);
    try {
      await contractorJobsApi.requestAdvance(job.id, quote.id, values.amount);
      toast({ title: 'Advance payment requested successfully!' });
      onSuccess();
    } catch (e: any) {
      toast({
        title: 'Failed to request advance',
        description: e?.response?.data?.message || 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Advance Payment</DialogTitle>
          <DialogDescription>
            You can request up to 20% (₹{maxAdvance.toFixed(2)}) of the total quote amount.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount to Request</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
