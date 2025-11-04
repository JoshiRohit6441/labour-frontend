
import { useMutation } from '@tanstack/react-query';
import { userJobsApi } from '@/lib/api/user';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface QuoteListProps {
  quotes: any[];
  jobId: string;
  onQuoteAccepted: () => void;
}

export const QuoteList = ({ quotes, jobId, onQuoteAccepted }: QuoteListProps) => {
  const { toast } = useToast();

  const { mutate: acceptQuote, isPending } = useMutation({
    mutationFn: (quoteId: string) => userJobsApi.acceptQuote(jobId, quoteId),
    onSuccess: () => {
      toast({ title: 'Quote accepted successfully!' });
      onQuoteAccepted();
    },
    onError: (e: any) => {
      toast({
        title: 'Failed to accept quote',
        description: e?.response?.data?.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  if (quotes.length === 0) {
    return <p className="text-muted-foreground">No quotes have been submitted for this job yet.</p>;
  }

  return (
    <div className="space-y-4">
      {quotes.map((quote) => (
        <Card key={quote.id}>
          <CardHeader>
            <CardTitle>Quote from {quote.contractor.businessName}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₹{quote.totalAmount || quote.amount}</p>
            {quote.notes && <p className="text-muted-foreground mt-2">{quote.notes}</p>}
            {quote.documents && quote.documents.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold">Documents:</h4>
                <ul className="list-disc list-inside">
                  {quote.documents.map((doc: string, i: number) => (
                    <li key={i}><a href={doc} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Document {i + 1}</a></li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={() => acceptQuote(quote.id)} disabled={isPending}>
              {isPending ? 'Accepting...' : 'Accept Quote'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
