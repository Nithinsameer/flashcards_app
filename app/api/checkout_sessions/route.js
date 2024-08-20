import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const formatAmountForStripe = (amount) => {
    return Math.round(amount * 100);
};

export async function POST(req) {
    const origin = req.headers.get('origin') || 'http://localhost:3000'; // Fallback for local development

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
    };

    try {
        const checkoutSession = await stripe.checkout.sessions.create(params);
        return NextResponse.json({ sessionId: checkoutSession.id }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Error creating checkout session' }, { status: 500 });
    }
}