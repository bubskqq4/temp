/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
    },
    async rewrites() {
        return [
            {
                source: '/design-lab',
                destination: 'http://localhost:9005',
            },
            {
                source: '/design-lab/:path*',
                destination: 'http://localhost:9005/:path*',
            },
            // Penpot Assets - Critical for it to load
            {
                source: '/assets/:path*',
                destination: 'http://localhost:9005/assets/:path*',
            },
            // Penpot-specific API endpoints (not our Next.js API routes)
            {
                source: '/api/rpc/:path*',
                destination: 'http://localhost:9005/api/rpc/:path*',
            },
            {
                source: '/api/export/:path*',
                destination: 'http://localhost:9005/api/export/:path*',
            },
            {
                source: '/js/:path*',
                destination: 'http://localhost:9005/js/:path*',
            },
            {
                source: '/css/:path*',
                destination: 'http://localhost:9005/css/:path*',
            },
            {
                source: '/images/:path*',
                destination: 'http://localhost:9005/images/:path*',
            },
            {
                source: '/fonts/:path*',
                destination: 'http://localhost:9005/fonts/:path*',
            },
            {
                source: '/wasm/:path*',
                destination: 'http://localhost:9005/wasm/:path*',
            }
        ]
    },
}

module.exports = nextConfig
