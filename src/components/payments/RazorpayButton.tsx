import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { userPaymentsApi } from '@/lib/api/user';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window { Razorpay: any }
}

interface Props {
  amount: number; // in INR rupees
  jobId?: string;
  label?: string;
  paymentType?: 'ADVANCE' | 'FINAL';
}

export const RazorpayButton = ({ amount, jobId, label = 'Pay with Razorpay', paymentType }: Props) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const pay = async () => {
    try {
      setLoading(true);
      const orderRes = await userPaymentsApi.createOrder(amount, 'INR', jobId, paymentType);
      const order = orderRes.data as any;

      const options = {
        key: order.key,
        amount: order.amount, // This amount is in paise, as returned by the backend
        currency: order.currency,
        order_id: order.orderId,
        handler: async (response: any) => {
          try {
            await userPaymentsApi.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              jobId,
            });
            toast({ title: 'Payment successful' });
          } catch (e: any) {
            toast({ title: 'Verification failed', description: e?.response?.data?.message, variant: 'destructive' });
          }
        },
        theme: { color: '#2563eb' },
      };

      if (!window.Razorpay) {
        const s = document.createElement('script');
        s.src = 'https://checkout.razorpay.com/v1/checkout.js';
        s.async = true;
        document.body.appendChild(s);
        await new Promise((res) => { s.onload = res; });
      }

      const rzp = new window.Razorpay(options);
      rzp.open();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={pay} disabled={loading}>{loading ? 'Processing...' : label}</Button>
  );
};

export default RazorpayButton;


