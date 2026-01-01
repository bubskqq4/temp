import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Business Hub',
}

export default function BusinessLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
