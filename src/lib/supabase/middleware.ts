import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED_PREFIXES = ['/sale', '/manager', '/ceo']

export async function updateSession(request: NextRequest) {
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

    // FAST: getSession() validates JWT locally (0ms), no network call
    // getUser() calls Supabase Auth API over network (~300-500ms) — too slow for middleware
    // Role verification still happens in server components via Prisma (getUserByRole)
    const {
        data: { session },
    } = await supabase.auth.getSession()

    const user = session?.user ?? null

    // Public routes
    const publicPaths = ['/login', '/register', '/forgot-password']
    const isPublicPath = publicPaths.some(path =>
        request.nextUrl.pathname.startsWith(path)
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

