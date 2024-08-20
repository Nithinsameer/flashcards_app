'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PaymentStatus() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState(null);

  useEffect(() => {
    setStatus(searchParams.get('status'));
  }, [searchParams]);

  useEffect(() => {
    if (status === 'canceled') {
      const timer = setTimeout(() => {
        router.push('/');
      }, 5000); // Redirect after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [status, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Payment Status</CardTitle>
        </CardHeader>
        <CardContent>
          {status === 'canceled' ? (
            <>
              <p className="text-red-500 mb-4">Payment failed or was canceled.</p>
              <p className="mb-4">You will be redirected to the home page in 5 seconds.</p>
            </>
          ) : (
            <p>Unknown payment status.</p>
          )}
          <Button onClick={() => router.push('/')} className="w-full">
            Return to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}