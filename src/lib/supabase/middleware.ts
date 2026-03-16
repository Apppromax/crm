import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

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

    // Use getUser() for production reliability — it validates with Supabase Auth server
    // getSession() was causing auth failures on Vercel because expired JWT still decoded
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Public routes
    const publicPaths = ['/login', '/register', '/forgot-password']
    const isPublicPath = publicPaths.some(path =>
        pathname.startsWith(path)
    )

    if (!user && !isPublicPath) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    if (user && isPublicPath) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
    }

    // Pass supabase user ID to server components (skip duplicate auth call)
    if (user) {
        supabaseResponse.headers.set('x-supabase-uid', user.id)
    }

    return supabaseResponse
}

