# Subscription & Feature Gating System

## Overview
Founder's Route now has a **4-tier subscription system** with automatic feature gating. Users start with **No Access** by default and must upgrade to access premium features.

## Pricing Tiers

### 1. **No Access** (Default - $0/month)
- **Access:** Very limited, personal features only
- **Features:**
  - Basic Dashboard
  - Personal Habits
  - Simple Roadmap
- **Routes:** `/`, `/habits`, `/roadmap`

### 2. **Basic** ($5/month)
- **Access:** Individual productivity features
- **Features:**
  - Everything in No Access
  - Performance Tracking
  - Journal & Reflections
  - Inbox Management
  - Basic Analytics
- **Routes:** All No Access routes + `/performance`, `/journal`, `/inbox`

### 3. **Small Business** ($15/month)
- **Access:** Business and design tools
- **Features:**
  - Everything in Basic
  - Brand Lab
  - Design Lab (Penpot)
  - Client Management
  - Project Tracking
  - Resource Library
- **Routes:** All Basic routes + `/brand`, `/design-lab`, `/clients`, `/projects`, `/resources`

### 4. **Pro** ($10/month) ⭐
- **Access:** Full platform access including AI
- **Features:**
  - Everything in Small Business
  - **AI Library (TTS)**
  - AI-Powered Insights
  - Advanced Analytics
  - Priority Support
  - Unlimited Storage
  - Custom Integrations
- **Routes:** All routes including `/ai-tools`

## How It Works

### 1. **User State Management**
- Uses React Context (`UserPlanProvider`) with localStorage persistence
- Default plan: `no-access`
- Hook: `useUserPlan()` to access/update plan

```tsx
import { useUserPlan } from '@/hooks/useUserPlan'

function MyComponent() {
    const { plan, setPlan } = useUserPlan()
    
    // Upgrade user
    setPlan('pro')
}
```

### 2. **Route Protection**
Wrap any page with `<RouteGuard>` to require a specific plan:

```tsx
import { RouteGuard } from '@/components/RouteGuard'

export default function AIToolsPage() {
    return (
        <RouteGuard featureName="AI Library">
            {/* Your page content */}
        </RouteGuard>
    )
}
```

**What happens:**
- ✅ If user has access → Page loads normally
- ❌ If user lacks access → Shows upgrade modal with blurred background
- User can't interact with page until they upgrade or go back

### 3. **Upgrade Modal**
Beautiful, premium modal that shows:
- Plan name and pricing
- All included features with animated checkmarks
- Gradient CTA button
- "Maybe Later" option (redirects to dashboard)

### 4. **Manual Feature Checks**
For inline feature gating within a page:

```tsx
import { hasAccessToRoute } from '@/lib/plans'
import { useUserPlan } from '@/hooks/useUserPlan'

function MyComponent() {
    const { plan } = useUserPlan()
    const canUseAI = hasAccessToRoute(plan, '/ai-tools')
    
    return (
        <button disabled={!canUseAI}>
            {canUseAI ? 'Generate' : 'Upgrade to Pro'}
        </button>
    )
}
```

## Implementation Checklist

### ✅ Already Implemented
- [x] Plans configuration (`src/lib/plans.ts`)
- [x] User plan hook (`src/hooks/useUserPlan.tsx`)
- [x] Upgrade modal component (`src/components/UpgradeModal.tsx`)
- [x] Route guard component (`src/components/RouteGuard.tsx`)
- [x] AI Tools page protected

### 🔲 Next Steps
1. **Wrap the root layout** with `UserPlanProvider`:
   ```tsx
   // src/app/layout.tsx
   import { UserPlanProvider } from '@/hooks/useUserPlan'
   
   export default function RootLayout({ children }) {
       return (
           <html>
               <body>
                   <UserPlanProvider>
                       {children}
                   </UserPlanProvider>
               </body>
           </html>
       )
   }
   ```

2. **Protect other routes** by wrapping pages with `<RouteGuard>`:
   - `/brand` → Small Business
   - `/design-lab` → Small Business
   - `/clients` → Small Business
   - `/projects` → Small Business
   - `/performance` → Basic
   - `/journal` → Basic
   - `/inbox` → Basic

3. **Create upgrade/payment page** at `/upgrade`:
   - Show all plans side-by-side
   - Integrate with payment processor (Stripe, etc.)
   - Update user plan on successful payment

4. **Update Sidebar** to show lock icons on restricted routes

5. **Add plan badge** to user profile/settings

## Testing

### Test Different Plans
```tsx
// In browser console or a test component
import { useUserPlan } from '@/hooks/useUserPlan'

const { setPlan } = useUserPlan()

// Test No Access
setPlan('no-access')

// Test Basic
setPlan('basic')

// Test Small Business
setPlan('small-business')

// Test Pro
setPlan('pro')
```

### Expected Behavior
1. Set plan to `no-access`
2. Try to visit `/ai-tools`
3. Should see upgrade modal
4. Set plan to `pro`
5. Refresh `/ai-tools`
6. Should see page normally

## Files Created

```
src/
├── lib/
│   └── plans.ts                    # Plan configurations & utilities
├── hooks/
│   └── useUserPlan.tsx             # User plan state management
└── components/
    ├── RouteGuard.tsx              # Route protection wrapper
    └── UpgradeModal.tsx            # Premium upgrade modal
```

## Design Notes

- **Upgrade Modal** uses the same premium aesthetic as other modals (Stone-900 bg, glassmorphism)
- **Pro plan** gets special gradient treatment (purple/pink)
- **Other plans** use blue gradient
- **Smooth animations** with Framer Motion
- **Blurred background** when modal is shown (prevents interaction)

## Future Enhancements

1. **Server-side validation** - Verify plan on API routes
2. **Usage limits** - Track API calls, storage, etc.
3. **Trial periods** - 14-day free trial for Pro
4. **Team plans** - Multi-user subscriptions
5. **Annual billing** - Discounted yearly plans
6. **Feature usage analytics** - Track which features drive upgrades
