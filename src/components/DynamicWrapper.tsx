'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import { SpiralAnimation } from './SpiralAnimation'
import { CommandPalette } from './CommandPalette'
import { supabase } from '@/lib/supabase'

import { TextShimmer } from './TextShimmer'

export const DynamicWrapper = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname()
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(true)
    const [isAuthChecking, setIsAuthChecking] = React.useState(true)

    React.useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession()

            const publicRoutes = ['/login', '/register', '/terms', '/privacy', '/', '/guide']
            const isPublicRoute = publicRoutes.includes(pathname)

            if (!session && !isPublicRoute) {
                router.push('/login')
            } else if (session && (pathname === '/login' || pathname === '/register')) {
                router.push('/dashboard')
            }

            setIsAuthChecking(false)
        }

        checkAuth()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const publicRoutes = ['/login', '/register', '/terms', '/privacy', '/', '/guide']
            const isPublicRoute = publicRoutes.includes(pathname)

            if (!session && !isPublicRoute) {
                router.push('/login')
            }
        })

        return () => subscription.unsubscribe()
    }, [pathname, router])

    React.useEffect(() => {
        setIsLoading(true)
        const timer = setTimeout(() => setIsLoading(false), 1500)
        return () => clearTimeout(timer)
    }, [pathname])

    return (
        <div className="app-dynamic-container">
            <CommandPalette />
            {/* Dynamic Animated Mesh Background */}
            <div className="dynamic-background">
                <div className="mesh-gradient mesh-1" />
                <div className="mesh-gradient mesh-2" />
                <div className="mesh-gradient mesh-3" />
            </div>

            <AnimatePresence mode="wait">
                {(isLoading || isAuthChecking) ? (
                    <motion.div
                        key="loader"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[9999]"
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(5,5,5,0.95)',
                            backdropFilter: 'blur(20px)',
                            zIndex: 9999,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '2rem',
                            width: '100vw',
                            height: '100vh'
                        }}
                    >
                        <div style={{ width: 360, height: 360 }}>
                            <SpiralAnimation
                                size={360}
                                totalDots={250}
                                duration={1.5}
                                dotColor="#ffffff"
                            />
                        </div>
                        <TextShimmer
                            duration={1.5}
                            className='text-xl font-medium [--base-color:#a1a1aa] [--base-gradient-color:#ffffff]'
                        >
                            Loading Your Founder's Route...
                        </TextShimmer>
                    </motion.div>
                ) : (
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        style={{ width: '100%', height: '100%' }}
                    >
                        <div className="page-transition-wrapper">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
