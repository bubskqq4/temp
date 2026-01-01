'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useUserPlan } from '@/hooks/useUserPlan'
import { hasAccessToRoute, getRequiredPlanForRoute } from '@/lib/plans'
import { UpgradeModal } from './UpgradeModal'

interface RouteGuardProps {
    children: React.ReactNode
    featureName?: string
}

export const RouteGuard = ({ children, featureName }: RouteGuardProps) => {
    const pathname = usePathname()
    const { plan } = useUserPlan()
    const [showUpgradeModal, setShowUpgradeModal] = useState(false)
    const [requiredPlan, setRequiredPlan] = useState<ReturnType<typeof getRequiredPlanForRoute>>(null)

    useEffect(() => {
        const hasAccess = hasAccessToRoute(plan, pathname)

        if (!hasAccess) {
            const required = getRequiredPlanForRoute(pathname)
            setRequiredPlan(required)
            setShowUpgradeModal(true)
        } else {
            setShowUpgradeModal(false)
        }
    }, [pathname, plan])

    if (showUpgradeModal && requiredPlan) {
        return (
            <>
                {/* Blurred background */}
                <div style={{ filter: 'blur(8px)', pointerEvents: 'none', userSelect: 'none' }}>
                    {children}
                </div>

                {/* Upgrade Modal */}
                <UpgradeModal
                    isOpen={showUpgradeModal}
                    onClose={() => {
                        // Redirect to dashboard if they close without upgrading
                        window.location.href = '/'
                    }}
                    requiredPlan={requiredPlan}
                    featureName={featureName}
                    currentPlan={plan}
                />
            </>
        )
    }

    return <>{children}</>
}
