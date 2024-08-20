'use client'
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ResultPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session_id = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCheckoutSession = async () => {
      if (!session_id) {
        setError('No session ID provided');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/checkout_sessions?session_id=${session_id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch session');
        }
        const sessionData = await res.json();
        setSession(sessionData);
      } catch (err) {
        setError('An error occurred while retrieving the session.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCheckoutSession();
  }, [session_id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <h2 className="text-xl font-semibold mt-4">Loading...</h2>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-red-600">
              {error || 'Unable to retrieve session information'}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {session.payment_status === 'paid' ? 'Thank you for your purchase!' : 'Payment status'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4">Session ID: {session_id}</p>
          <p className="mb-4">
            {session.payment_status === 'paid' 
              ? 'We have received your payment. You will receive an email with the order details shortly.'
              : `Payment status: ${session.payment_status}`
            }
          </p>
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultPage;