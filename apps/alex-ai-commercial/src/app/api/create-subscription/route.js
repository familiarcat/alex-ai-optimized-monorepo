"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-12-18.acacia',
});
const PRICE_IDS = {
    basic: process.env.STRIPE_BASIC_PRICE_ID,
    premium: process.env.STRIPE_PREMIUM_PRICE_ID,
    enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID,
};
async function POST(request) {
    try {
        const { paymentMethodId, tier, price } = await request.json();
        if (!paymentMethodId || !tier || !price) {
            return server_1.NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        // Create customer
        const customer = await stripe.customers.create({
            payment_method: paymentMethodId,
            invoice_settings: {
                default_payment_method: paymentMethodId,
            },
        });
        // Create subscription
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [
                {
                    price: PRICE_IDS[tier],
                },
            ],
            payment_behavior: 'default_incomplete',
            payment_settings: { save_default_payment_method: 'on_subscription' },
            expand: ['latest_invoice.payment_intent'],
        });
        // Store subscription in database (Supabase)
        // This would typically be done here with your database
        return server_1.NextResponse.json({
            subscriptionId: subscription.id,
            client_secret: subscription.latest_invoice?.payment_intent?.client_secret,
        });
    }
    catch (error) {
        console.error('Subscription creation error:', error);
        return server_1.NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map