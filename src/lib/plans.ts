// Subscription Plans Configuration

export type PlanTier = 'no-access' | 'basic' | 'small-business' | 'pro' | 'founder'

export interface Plan {
    id: PlanTier
    name: string
    price: number
    interval: 'month' | 'year'
    features: string[]
    allowedRoutes: string[]
    description: string
}

export const PLANS: Record<PlanTier, Plan> = {
    'no-access': {
        id: 'no-access',
        name: 'No Access',
        price: 0,
        interval: 'month',
        description: 'Limited access to personal features only',
        features: [
            'Basic Dashboard',
            'Personal Habits',
            'Simple Roadmap'
        ],
        allowedRoutes: [
            '/',
            '/habits',
            '/roadmap'
        ]
    },
    'basic': {
        id: 'basic',
        name: 'Basic',
        price: 5,
        interval: 'month',
        description: 'Perfect for individuals getting started',
        features: [
            'Everything in No Access',
            'Performance Tracking',
            'Journal & Reflections',
            'Inbox Management',
            'Basic Analytics'
        ],
        allowedRoutes: [
            '/',
            '/habits',
            '/roadmap',
            '/performance',
            '/journal',
            '/inbox'
        ]
    },
    'small-business': {
        id: 'small-business',
        name: 'Small Business',
        price: 15,
        interval: 'month',
        description: 'For entrepreneurs and small teams',
        features: [
            'Everything in Basic',
            'Brand Lab',
            'Design Lab (Penpot)',
            'Client Management',
            'Project Tracking',
            'Resource Library'
        ],
        allowedRoutes: [
            '/',
            '/habits',
            '/roadmap',
            '/performance',
            '/journal',
            '/inbox',
            '/brand',
            '/design-lab',
            '/clients',
            '/projects',
            '/resources'
        ]
    },
    'pro': {
        id: 'pro',
        name: 'Pro',
        price: 10,
        interval: 'month',
        description: 'Full access to all features and AI tools',
        features: [
            'Everything in Small Business',
            'AI Library (TTS)',
            'AI-Powered Insights',
            'Advanced Analytics',
            'Priority Support',
            'Unlimited Storage',
            'Custom Integrations'
        ],
        allowedRoutes: [
            '/',
            '/habits',
            '/roadmap',
            '/performance',
            '/journal',
            '/inbox',
            '/brand',
            '/design-lab',
            '/clients',
            '/projects',
            '/resources',
            '/ai-tools'
        ]
    },
    'founder': {
        id: 'founder',
        name: 'Founder',
        price: 0,
        interval: 'month',
        description: 'Exclusive access for founders - CODE ONLY',
        features: [
            'Unlimited Everything',
            'All Pro Features',
            'Lifetime Access',
            'Priority Support',
            'Early Access to New Features',
            'Direct Line to Development Team'
        ],
        allowedRoutes: [
            '/',
            '/habits',
            '/roadmap',
            '/performance',
            '/journal',
            '/inbox',
            '/brand',
            '/design-lab',
            '/clients',
            '/projects',
            '/resources',
            '/ai-tools',
            '/ai-companion',
            '/business',
            '/knowledge-base',
            '/creative-studio',
            '/focus-room',
            '/network',
            '/spending',
            '/venture',
            '/marketing'
        ]
    }
}

export function hasAccessToRoute(userPlan: PlanTier, route: string): boolean {
    const plan = PLANS[userPlan]
    if (!plan) return false

    // Check if route is in allowed routes or is a sub-route
    return plan.allowedRoutes.some(allowedRoute =>
        route === allowedRoute || route.startsWith(allowedRoute + '/')
    )
}

export function getRequiredPlanForRoute(route: string): PlanTier | null {
    // Find the minimum plan that allows this route
    const planTiers: PlanTier[] = ['no-access', 'basic', 'small-business', 'pro']

    for (const tier of planTiers) {
        if (PLANS[tier].allowedRoutes.some(allowedRoute =>
            route === allowedRoute || route.startsWith(allowedRoute + '/')
        )) {
            return tier
        }
    }

    return 'pro' // Default to Pro if not found
}
