import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

import { AUTH_COOKIE_NAME, CSRF_COOKIE_NAME } from './lib/constants'

const secret = new TextEncoder().encode(process.env.JWT_SECRET)
const authRoutes = ['/signin', '/signup', '/register', '/forgot-password', '/reset-password']

function ensureCsrfCookie(response: NextResponse, existing: string | undefined): NextResponse {
    if (!existing) {
        response.cookies.set(CSRF_COOKIE_NAME, crypto.randomUUID(), {
            httpOnly: false, // must be readable by client JS
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24, // 24 hours
        })
    }
    return response
}

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
    const csrfToken = request.cookies.get(CSRF_COOKIE_NAME)?.value

    // --- 1. TOKEN EXPIRY CHECK ---
    if (token) {
        try {
            await jwtVerify(token, secret)
        } catch {
            const silentRefresh = new URL(
                `/api/auth/silent-refresh?redirect=${encodeURIComponent(pathname)}`,
                request.url,
            )
            const response = NextResponse.redirect(silentRefresh)
            response.cookies.delete(AUTH_COOKIE_NAME)
            return response
        }
    }

    // --- 2. ROUTE PROTECTION ---
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // --- 3. CSRF COOKIE + inject pathname for layouts ---
    const response = NextResponse.next()
    response.headers.set('x-pathname', pathname)
    return ensureCsrfCookie(response, csrfToken)
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
