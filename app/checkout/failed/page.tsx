'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Order } from '@/types/order';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function FailedPage() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const orderId = searchParams.get('order_id');
    if (!orderId) {
      setError('Order ID not found');
      setIsLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders?id=${orderId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch order');
        }

        setOrder(data.order);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="container max-w-2xl py-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-2xl py-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container max-w-2xl py-8">
        <Alert>
          <AlertDescription>Order not found</AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-8">
      <div className="text-center mb-8">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
        <p className="text-gray-600">
          We couldn't process your payment. Please try again or choose a different payment method.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Order Information</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Order ID:</span> {order.id}</p>
              <p><span className="font-medium">Status:</span> {order.status}</p>
              <p><span className="font-medium">Payment Status:</span> {order.paymentStatus}</p>
              <p><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleString()}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Payment Information</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Method:</span> {order.paymentMethod}</p>
              <p><span className="font-medium">Status:</span> {order.paymentStatus}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 space-x-4 text-center">
        <Button asChild variant="outline">
          <Link href="/">Return to Home</Link>
        </Button>
        <Button asChild>
          <Link href="/checkout">Try Again</Link>
        </Button>
      </div>
    </div>
  );
} 