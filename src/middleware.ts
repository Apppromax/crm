import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // TODO: Re-enable Supabase auth when ready
    // return await updateSession(request)

    // For now, allow all routes
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
