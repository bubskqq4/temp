-- SUPABASE SUBSCRIPTION SYSTEM SETUP
-- Run this in your Supabase SQL Editor

-- 1. Create Subscription Tiers Enum (with founder tier)
CREATE TYPE public.plan_tier_type AS ENUM ('no-access', 'basic', 'pro', 'small-business', 'founder');

-- 2. Update Users Table (Ensure it exists or create it)
-- Note: Assuming you already have a 'users' table from auth.users trigger
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS plan_tier plan_tier_type DEFAULT 'no-access',
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT,
ADD COLUMN IF NOT EXISTS subscription_ends_at TIMESTAMPTZ;

-- 3. Create Plans Metadata Table (Dynamic Plans)
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id TEXT PRIMARY KEY, -- e.g. 'basic', 'pro', 'founder'
    name TEXT NOT NULL,
    description TEXT,
    price_id TEXT, -- Stripe Price ID
    amount DECIMAL NOT NULL,
    currency TEXT DEFAULT 'USD',
    interval TEXT DEFAULT 'month',
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Insert Default Plans (including founder)
INSERT INTO public.subscription_plans (id, name, description, amount, price_id, features)
VALUES 
('basic', 'Basic', 'Essential toolkit for solo founders.', 5.00, 'price_basic_test', '["Daily Journals", "Habit Tracking", "Core Focus Room"]'),
('pro', 'Pro Professional', 'Advanced features for scaling builders.', 10.00, 'price_pro_test', '["All Basic features", "AI Companion", "Advanced Analytics", "Custom Roadmap"]'),
('small-business', 'Small Business', 'Scale your empire with team tools.', 15.00, 'price_smallbiz_test', '["Full Team Access", "Priority AI processing", "Strategic Dashboard", "Unlimited Workspaces"]'),
('founder', 'Founder', 'Exclusive access for founders - CODE ONLY', 0.00, NULL, '["Unlimited Everything", "All Pro Features", "Lifetime Access", "Priority Support", "Early Access to New Features"]')
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    amount = EXCLUDED.amount,
    price_id = EXCLUDED.price_id,
    features = EXCLUDED.features;

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies
-- Allow anyone to read plans
CREATE POLICY "Public can read plans" ON public.subscription_plans
    FOR SELECT USING (true);

-- Allow users to read their own data
CREATE POLICY "Users can read own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- CRITICAL: Allow users to update their own plan_tier
CREATE POLICY "Users can update own plan" ON public.users
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 7. Sync Trigger (Optional but good practice)
-- Ensures updated_at is refreshed
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.subscription_plans
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
