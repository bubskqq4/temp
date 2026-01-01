import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Brand Lab',
}

export default function BrandLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
