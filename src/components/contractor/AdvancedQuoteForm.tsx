
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { contractorJobsApi } from '@/lib/api/contractor';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const quoteSchema = z.object({
  totalAmount: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive("Total amount must be positive")
  ),
  notes: z.string().optional(),
  addOns: z.string().optional(),
  documents: z.instanceof(FileList).optional(),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

interface AdvancedQuoteFormProps {
  job: any;
}

export const AdvancedQuoteForm = ({ job }: AdvancedQuoteFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      totalAmount: 0,
      notes: '',
      addOns: '',
    },
  });

  const documentRef = form.register("documents");

  const onSubmit = async (values: QuoteFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('totalAmount', values.totalAmount.toString());
      if (values.notes) formData.append('notes', values.notes);
      if (values.addOns) formData.append('addOns', values.addOns);
      
      if (values.documents) {
        Array.from(values.documents).forEach((file) => {
          formData.append('documents', file);
        });
      }

      await contractorJobsApi.submitAdvancedQuote(job.id, formData);

      toast({ title: 'Quote submitted successfully!' });
      navigate(`/contractor/jobs/${job.id}`);
    } catch (e: any) {
      toast({
        title: 'Failed to submit quote',
        description: e?.response?.data?.message || 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="totalAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Amount (INR)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 5000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="addOns"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add-ons / Extra Charges</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe any additional services or charges (e.g., Material transport: 500, Site cleaning: 1000)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Provide any additional details or terms for the client" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="documents"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supporting Documents</FormLabel>
              <FormControl>
                <Input type="file" multiple {...documentRef} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Quote'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
