import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Security headers middleware.
 * Applied to all routes via Next.js middleware chain.
 */
export function applySecurityHeaders(response: NextResponse, request: NextRequest) {
    // Content Security Policy
    response.headers.set(
        'Content-Security-Policy',
        [
            "default-src 'self'",
            "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.vercel-insights.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: blob: https:",
            "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://generativelanguage.googleapis.com",
            "frame-ancestors 'none'",
        ].join('; ')
    )

    // Prevent clickjacking
    response.headers.set('X-Frame-Options', 'DENY')

    // Prevent MIME type sniffing
    response.headers.set('X-Content-Type-Options', 'nosniff')

    // Referrer Policy
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

    // Permissions Policy
    response.headers.set(
        'Permissions-Policy',
        'camera=(), microphone=(self), geolocation=(), payment=()'
    )

    // Strict Transport Security (HSTS)
    response.headers.set(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains'
    )

    return response
}

/**
 * Rate limiting based on IP address.
 * Simple in-memory store — for production use Redis or Vercel KV.
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
    request: NextRequest,
    maxRequests = 100,
    windowMs = 60000
): boolean {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const key = `${ip}:${request.nextUrl.pathname.split('/')[1]}`

    const now = Date.now()
    const entry = rateLimitMap.get(key)

    if (!entry || now > entry.resetTime) {
        rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
        return true
    }

    entry.count++

    if (entry.count > maxRequests) {
        return false // Rate limited
    }

    return true
}
