import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Marketing Hub',
}

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
