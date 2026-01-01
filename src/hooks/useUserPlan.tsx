'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { PlanTier } from '@/lib/plans'
import { supabase } from '@/lib/supabase'

interface UserPlanContextType {
    plan: PlanTier
    setPlan: (plan: PlanTier) => void
    email: string | null
    setEmail: (email: string | null) => void
    loading: boolean
    refreshPlan: () => Promise<void>
}

const UserPlanContext = createContext<UserPlanContextType | undefined>(undefined)

export function UserPlanProvider({ children }: { children: ReactNode }) {
    const [plan, setPlanState] = useState<PlanTier>('no-access')
    const [email, setEmailState] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchUserPlan = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                setEmailState(user.email || null)
                const { data, error } = await supabase
                    .from('users')
                    .select('plan_tier')
                    .eq('id', user.id)
                    .single()

                if (data?.plan_tier) {
                    setPlanState(data.plan_tier as PlanTier)
                }
            }
        } catch (e) {
            console.error('Error fetching user plan:', e)
        } finally {
            setLoading(false)
        }
    }

    // Load from Supabase and localStorage
    useEffect(() => {
        // Initial load from localStorage for speed
        const saved = localStorage.getItem('user-subscription')
        if (saved) {
            try {
                const data = JSON.parse(saved)
                if (data.plan) setPlanState(data.plan)
                if (data.email) setEmailState(data.email)
            } catch (e) { }
        }

        // Then verify with Supabase
        fetchUserPlan()
    }, [])

    const setPlan = (newPlan: PlanTier) => {
        setPlanState(newPlan)
        localStorage.setItem('user-subscription', JSON.stringify({ plan: newPlan, email }))
    }

    const setEmail = (newEmail: string | null) => {
        setEmailState(newEmail)
        localStorage.setItem('user-subscription', JSON.stringify({ plan, email: newEmail }))
    }

    return (
        <UserPlanContext.Provider value={{ plan, setPlan, email, setEmail, loading, refreshPlan: fetchUserPlan }}>
            {children}
        </UserPlanContext.Provider>
    )
}

export function useUserPlan() {
    const context = useContext(UserPlanContext)
    if (context === undefined) {
        throw new Error('useUserPlan must be used within a UserPlanProvider')
    }
    return context
}
