'use client';

import { useEffect, useState } from 'react';
import { Order } from '@/types/order';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Package, Truck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface OrderStatusStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'complete' | 'current' | 'upcoming';
}

export default function OrderDetailsPage({
  params
}: {
  params: { id: string }
}) {
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders?id=${params.id}`);
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
  }, [params.id]);

  const getOrderSteps = (order: Order): OrderStatusStep[] => {
    const steps: OrderStatusStep[] = [
      {
        id: 'payment',
        title: 'Payment',
        description: 'Payment has been processed',
        icon: <CheckCircle2 className="w-6 h-6" />,
        status: order.paymentStatus === 'completed' ? 'complete' : 'current'
      },
      {
        id: 'processing',
        title: 'Processing',
        description: 'Your order is being processed',
        icon: <Package className="w-6 h-6" />,
        status: order.status === 'processing' ? 'current' : 
                order.status === 'completed' ? 'complete' : 'upcoming'
      },
      {
        id: 'completed',
        title: 'Completed',
        description: 'Your order has been completed',
        icon: <Truck className="w-6 h-6" />,
        status: order.status === 'completed' ? 'complete' : 'upcoming'
      }
    ];

    return steps;
  };

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

  const steps = getOrderSteps(order);

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-2xl font-bold mb-6">Order Details</h1>

      <div className="mb-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                    step.status === 'complete'
                      ? 'border-green-500 bg-green-500 text-white'
                      : step.status === 'current'
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-300 bg-white text-gray-500'
                  }`}
                >
                  {step.icon}
                </div>
                <div className="mt-2 text-sm font-medium text-gray-900">
                  {step.title}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {step.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Order ID:</span> {order.id}</p>
            <p><span className="font-medium">Status:</span> {order.status}</p>
            <p><span className="font-medium">Payment Status:</span> {order.paymentStatus}</p>
            <p><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Name:</span> {order.customerInfo.name}</p>
            <p><span className="font-medium">Email:</span> {order.customerInfo.email}</p>
            <p><span className="font-medium">Phone:</span> {order.customerInfo.phone}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.name} x {item.quantity}</span>
                <span>Rp {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>Rp {order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Method:</span> {order.paymentMethod}</p>
            <p><span className="font-medium">Status:</span> {order.paymentStatus}</p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 text-center">
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
} 