import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://tutorconnect-alb-1802029223.us-east-1.elb.amazonaws.com/api/:path*',
            },
        ]
    },
};

export default nextConfig;
