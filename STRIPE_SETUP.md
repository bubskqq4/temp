# Stripe Integration Setup Guide

## Overview
The plans page now integrates with Stripe for payment processing. When users select a paid plan, they're redirected to Stripe Checkout, and upon successful payment, their plan is automatically updated in the database.

## Setup Steps

### 1. Install Stripe
```bash
npm install stripe @stripe/stripe-js
```

### 2. Get Stripe API Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Switch to **Test Mode** (toggle in top-right)
3. Go to **Developers** → **API keys**
4. Copy your **Secret key** and **Publishable key**

### 3. Add Environment Variables
Add to `.env.local`:

```env
# Stripe Keys (Test Mode)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Your app URL
NEXT_PUBLIC_URL=http://localhost:3000
```

### 4. Create Products & Prices in Stripe

1. Go to **Products** in Stripe Dashboard
2. Create 3 products:

#### Basic Plan
- Name: "Founder's Route - Basic"
- Price: $5/month
- Copy the **Price ID** (starts with `price_`)

#### Pro Plan  
- Name: "Founder's Route - Pro"
- Price: $10/month
- Copy the **Price ID**

#### Small Business Plan
- Name: "Founder's Route - Small Business"
- Price: $15/month
- Copy the **Price ID**

### 5. Update Price IDs in Code

Edit `src/app/plans/page.tsx` and update the `getPriceId` function:

```typescript
const getPriceId = (planId: PlanTier) => {
    const priceIds = {
        'basic': 'price_1ABC123...',  // Replace with your actual Price ID
        'small-business': 'price_1DEF456...',
        'pro': 'price_1GHI789...'
    }
    return priceIds[planId as keyof typeof priceIds] || ''
}
```

### 6. Database Schema

Ensure your `users` table has a `plan_tier` column:

```sql
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS plan_tier TEXT DEFAULT 'no-access';
```

Valid values: `'no-access'`, `'basic'`, `'small-business'`, `'pro'`

## Testing

### Test Cards (Stripe Test Mode)

**Successful Payment:**
- Card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

**Declined Payment:**
- Card: `4000 0000 0000 0002`

### Test Flow

1. Go to `/plans`
2. Click "Select Plan" on any paid plan
3. Fill in test card details
4. Complete checkout
5. You'll be redirected to `/checkout/success`
6. Your plan will be updated in the database
7. You'll be redirected to dashboard

## Production Deployment

### 1. Switch to Live Mode
1. Toggle to **Live Mode** in Stripe Dashboard
2. Get your **Live API keys**
3. Update `.env.local` with live keys

### 2. Create Live Products
Repeat step 4 above in Live Mode

### 3. Update Environment Variables
```env
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_URL=https://yourdomain.com
```

## Webhooks (Optional but Recommended)

For production, set up webhooks to handle:
- Subscription cancellations
- Payment failures
- Plan changes

1. Go to **Developers** → **Webhooks**
2. Add endpoint: `https://yourdomain.com/api/stripe-webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`

## Security Notes

- ✅ Stripe Secret Key is server-side only (never exposed to client)
- ✅ Payment processing happens on Stripe's servers
- ✅ User plan updates require authentication
- ✅ Test mode prevents real charges

## Troubleshooting

**"Invalid checkout session"**
- Check that Price IDs are correct
- Ensure Stripe keys are in `.env.local`

**"Failed to update plan"**
- Check Supabase connection
- Verify `users` table has `plan_tier` column
- Check user is authenticated

**Stripe checkout not loading**
- Verify `NEXT_PUBLIC_URL` is correct
- Check browser console for errors
- Ensure Stripe keys match (test/live)

## Current Implementation

- ✅ Plans page with Stripe integration
- ✅ Checkout session creation API
- ✅ Success page with database update
- ✅ Local state management
- ✅ Test mode ready
- 🔲 Webhook handling (optional)
- 🔲 Subscription management page (future)
