import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Plans & Pricing',
}

export default function PlansLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
