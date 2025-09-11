"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const stripe_1 = __importDefault(require("stripe"));
const headers_1 = require("next/headers");
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-12-18.acacia',
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
async function POST(request) {
    const body = await request.text();
    const headersList = (0, headers_1.headers)();
    const signature = headersList.get('stripe-signature');
    if (!signature) {
        return server_1.NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
    }
    let event;
    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    }
    catch (err) {
        console.error('Webhook signature verification failed:', err);
        return server_1.NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
    try {
        switch (event.type) {
            case 'customer.subscription.created':
                await handleSubscriptionCreated(event.data.object);
                break;
            case 'customer.subscription.updated':
                await handleSubscriptionUpdated(event.data.object);
                break;
            case 'customer.subscription.deleted':
                await handleSubscriptionDeleted(event.data.object);
                break;
            case 'invoice.payment_succeeded':
                await handlePaymentSucceeded(event.data.object);
                break;
            case 'invoice.payment_failed':
                await handlePaymentFailed(event.data.object);
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
        return server_1.NextResponse.json({ received: true });
    }
    catch (error) {
        console.error('Webhook handler error:', error);
        return server_1.NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
    }
}
async function handleSubscriptionCreated(subscription) {
    console.log('Subscription created:', subscription.id);
    // Update database with new subscription
    // This would typically update your Supabase database
}
async function handleSubscriptionUpdated(subscription) {
    console.log('Subscription updated:', subscription.id);
    // Update database with subscription changes
}
async function handleSubscriptionDeleted(subscription) {
    console.log('Subscription deleted:', subscription.id);
    // Mark subscription as cancelled in database
}
async function handlePaymentSucceeded(invoice) {
    console.log('Payment succeeded:', invoice.id);
    // Update subscription status and extend period
}
async function handlePaymentFailed(invoice) {
    console.log('Payment failed:', invoice.id);
    // Handle failed payment (notify user, suspend service, etc.)
}
//# sourceMappingURL=route.js.map