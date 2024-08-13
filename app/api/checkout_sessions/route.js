import { Stripe, loadStripe } from '@stripe/stripe-js';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const formatAmountForStripe = (amount) => {
    return Math.round(amount*100)
}
export async function POST(req){
    // const stripe = new loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

    const params = {
        submit_type: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data : {
                currency: 'usd',
                product_data:{
                    name:"Pro Subscription",
                },
                unit_amount : formatAmountForStripe(10),
                recurring : {
                    interval: 'month',
                    interval_count: 1,
                }
            },
            // name: 'Custom amount donation',
            // amount: formatAmountForStripe(amount, CURRENCY),
            // currency: CURRENCY,
            quantity: 1,
          },
        ],
        success_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
      };
      const checkoutSession = await stripe.checkout.sessions.create(params);

      return NextResponse.json(checkoutSession, {status: 200})
}