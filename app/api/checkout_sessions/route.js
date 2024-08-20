import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const formatAmountForStripe = (amount) => {
    return Math.round(amount * 100);
};

export async function POST(req) {
    const origin = req.headers.get('origin') || 'http://localhost:3000';
    const { userId } = await req.json(); // Get the user ID from the request body

    const params = {
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: "Pro Subscription",
                    },
                    unit_amount: formatAmountForStripe(10),
                    recurring: {
                        interval: 'month',
                        interval_count: 1,
                    }
                },
                quantity: 1,
            },
        ],
        success_url: `${origin}/result?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/payment-status?status=canceled`,
        client_reference_id: userId, // Add the user ID as a reference
    };

    try {
        const checkoutSession = await stripe.checkout.sessions.create(params);
        return NextResponse.json({ sessionId: checkoutSession.id }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Error creating checkout session' }, { status: 500 });
    }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
      return NextResponse.json({ error: 'Missing session_id parameter' }, { status: 400 });
  }

  try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      return NextResponse.json(session);
  } catch (error) {
      console.error('Error retrieving session:', error);
      return NextResponse.json({ error: 'Error retrieving session' }, { status: 500 });
  }
}