# Netlify Deployment Guide for Founder's Route

## 🚀 Quick Deploy via GitHub

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit with founder codes"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Deploy on Netlify
1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub" and select your repository
4. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - **Node version:** 18

### Step 3: Add Environment Variables
In Netlify Dashboard → Site settings → Environment variables, add:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_URL` (your Netlify URL)
- `BETA_KEY`
- `GEMINI_API_KEY`
- `INWORLD_API_KEY`

### Step 4: Deploy!
Click "Deploy site" and Netlify will build and deploy automatically.

---

## 🎯 Valid Founder Codes (Already Hardcoded)

1. **FOUNDER2025** - General founder access
2. **STARTUP2025** - Startup founder access  
3. **CEO2025** - CEO/Executive access
4. **code-found-nye-2026** ⭐ - Special NYE 2026 code

All codes grant instant **Founder-tier** access with:
- ✅ Unlimited Everything
- ✅ All Pro Features
- ✅ Lifetime Access
- ✅ Priority Support
- ✅ Early Access to New Features
- ✅ No locks anywhere in the app

---

## 📊 Database Setup

Run `supabase_plans_update.sql` in your Supabase SQL Editor to:
- Add 'founder' tier to enum
- Create subscription_plans table
- Set up RLS policies (including UPDATE policy)
- Enable plan upgrades to save to database

---

## 🎨 Your Live Site

Once deployed, your site will be at:
**https://founders-route.netlify.app**

Users can:
1. Sign up/Login
2. Go to `/plans`
3. Enter any founder code
4. Get instant unlimited access!
