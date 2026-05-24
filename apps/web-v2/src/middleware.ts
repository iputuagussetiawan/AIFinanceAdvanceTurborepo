import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

import { AUTH_COOKIE_NAME, CSRF_COOKIE_NAME, SIGNIN_URL, DASHBOARD_URL } from './lib/constants'

const secret = new TextEncoder().encode(process.env.JWT_SECRET)
const authRoutes = ['/signin', '/signup', '/forgot-password', '/reset-password', '/verify-email']
const protectedRoutes = ['/dashboard', '/profile', '/sessions']

function ensureCsrfCookie(response: NextResponse, existing: string | undefined): NextResponse {
    if (!existing) {
        response.cookies.set(CSRF_COOKIE_NAME, crypto.randomUUID(), {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24,
        })
    }
    return response
}

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
    const csrfToken = request.cookies.get(CSRF_COOKIE_NAME)?.value

    const isAuthRoute = authRoutes.some((r) => pathname.startsWith(r))
    const isProtectedRoute = protectedRoutes.some((r) => pathname.startsWith(r))

    if (token) {
        try {
            await jwtVerify(token, secret)

            if (isAuthRoute) {
                return NextResponse.redirect(new URL(DASHBOARD_URL, request.url))
            }
        } catch {
            if (isProtectedRoute) {
                const silentRefresh = new URL(
                    `/api/auth/silent-refresh?redirect=${encodeURIComponent(pathname)}`,
                    request.url,
                )
                const response = NextResponse.redirect(silentRefresh)
                response.cookies.delete(AUTH_COOKIE_NAME)
                return response
            }
        }
    } else if (isProtectedRoute) {
        return NextResponse.redirect(new URL(SIGNIN_URL, request.url))
    }

    const response = NextResponse.next()
    response.headers.set('x-pathname', pathname)
    return ensureCsrfCookie(response, csrfToken)
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
