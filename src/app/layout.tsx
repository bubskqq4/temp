import type { Metadata } from 'next'
import './globals.css'
import { DynamicWrapper } from '@/components/DynamicWrapper'
import { UserPlanProvider } from '@/hooks/useUserPlan'

export const metadata: Metadata = {
    title: {
        template: "Founder's Route | %s",
        default: "Founder's Route | Visionary Productivity"
    },
    description: "Manage your life and projects with Founder's Route",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap" rel="stylesheet" />
            </head>
            <body>
                <UserPlanProvider>
                    <DynamicWrapper>
                        {children}
                    </DynamicWrapper>
                </UserPlanProvider>
            </body>
        </html>
    )
}
