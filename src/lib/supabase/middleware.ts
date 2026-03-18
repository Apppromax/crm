import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/login', '/register', '/forgot-password']
const PROTECTED_PREFIXES = ['/sale', '/manager', '/ceo']

export async function updateSession(request: NextRequest) {
    const { pathname } = request.nextUrl

    // FAST PATH: skip auth entirely for static assets, API routes, and _next
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.') // static files like .ico, .png, etc.
    ) {
        return NextResponse.next()
    }

    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({ request })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path))
    const isProtectedPath = PROTECTED_PREFIXES.some(path => pathname.startsWith(path))

    // For public paths (login, register, etc.):
    // Use getSession() first (local JWT decode, no network call) for speed.
    // Only redirect logged-in users away from public pages.
    if (isPublicPath) {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
            const url = request.nextUrl.clone()
            url.pathname = '/'
            return NextResponse.redirect(url)
        }
        return supabaseResponse
    }

    // For protected paths: validate with getUser() (network call to Supabase Auth)
    // This ensures the token is still valid server-side.
    if (isProtectedPath) {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }

        supabaseResponse.headers.set('x-supabase-uid', user.id)
        return supabaseResponse
    }

    // For root `/` and other non-protected, non-public paths:
    // Use getSession() (fast, local decode) to check auth state.
    // If no session, redirect to login. No network call needed.
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    if (session.user) {
        supabaseResponse.headers.set('x-supabase-uid', session.user.id)
    }

    return supabaseResponse
}
