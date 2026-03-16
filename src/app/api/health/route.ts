import { NextResponse } from 'next/server'

// Health check + basic error monitoring endpoint
// Vercel automatically monitors this

export async function GET() {
    const status = {
        ok: true,
        timestamp: new Date().toISOString(),
        version: '0.2.0',
        uptime: process.uptime(),
        memory: {
            rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
            heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
            heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        },
        env: process.env.NODE_ENV,
    }

    return NextResponse.json(status)
}
