import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateUserSubscription } from '@/utils/user-subscription-handler';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_SECRET_KEY;

export async function POST(req) {
  const buf = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id;
    
    if (userId) {
      try {
        await updateUserSubscription(userId, 'pro');
        console.log(`Updated subscription status for user ${userId} to pro`);
      } catch (error) {
        console.error(`Error updating subscription status for user ${userId}:`, error);
      }
    }
  }

  return NextResponse.json({ received: true });
}