# Supabase Environment Setup for SpeakersCircle

## 1. Set Environment Variables in Supabase Dashboard

Go to your Supabase Dashboard: https://supabase.com/dashboard/project/shxmbqdeesfglpbjvofc

### Navigate to: Settings > API > Environment Variables

Add these environment variables:

```
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## 2. Deploy Edge Functions

You need to install Supabase CLI and deploy the functions:

### Install Supabase CLI:
```bash
npm install -g supabase
```

### Login to Supabase:
```bash
supabase login
```

### Link your project:
```bash
supabase link --project-ref shxmbqdeesfglpbjvofc
```

### Deploy the functions:
```bash
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook
```

## 3. Set up Stripe Webhook

1. Go to Stripe Dashboard: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Use this URL: `https://shxmbqdeesfglpbjvofc.supabase.co/functions/v1/stripe-webhook`
4. Select these events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
5. Copy the webhook signing secret
6. Add it to Supabase environment variables as `STRIPE_WEBHOOK_SECRET`

## 4. Update Frontend Environment

Make sure your `.env` file has:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

## 5. Test the Integration

After completing steps 1-4:
1. Go to `/admin` (password: SCAdmin)
2. Add a test class
3. Try registering for the class
4. Test the payment flow

## Alternative: Simplified Payment Setup

If the Edge Functions are too complex for now, I can create a simpler payment integration that:
1. Uses Stripe Payment Links (no functions needed)
2. Manually tracks payments in the admin panel
3. Still provides full functionality

Let me know if you want the simplified version!