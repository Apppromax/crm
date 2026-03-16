import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { applySecurityHeaders, checkRateLimit } from '@/lib/security'

export async function middleware(request: NextRequest) {
    // Rate limit API routes
    if (request.nextUrl.pathname.startsWith('/api')) {
        if (!checkRateLimit(request, 100, 60000)) {
            return NextResponse.json(
                { error: 'Too many requests' },
                { status: 429 }
            )
        }
    }

    const response = await updateSession(request)

    // Apply security headers
    applySecurityHeaders(response, request)

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|manifest.json|icons/.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
