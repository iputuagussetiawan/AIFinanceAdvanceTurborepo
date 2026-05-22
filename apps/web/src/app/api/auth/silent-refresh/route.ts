import { NextRequest, NextResponse } from 'next/server'

import { AUTH_COOKIE_NAME, REFRESH_COOKIE_NAME, SIGNIN_URL } from '@/lib/constants'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000/api'

// Called by require-auth.ts when accessToken is expired.
// Refreshes the token then redirects back to the original page.
export async function GET(request: NextRequest) {
    const redirectTo = request.nextUrl.searchParams.get('redirect') || '/dashboard'
    const refreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value

    if (!refreshToken) {
        return NextResponse.redirect(new URL(SIGNIN_URL, request.url))
    }

    try {
        const res = await fetch(`${BACKEND_URL}/auth/refresh`, {
            method: 'POST',
            headers: { Cookie: `${REFRESH_COOKIE_NAME}=${refreshToken}` },
            cache: 'no-store',
        })

        if (!res.ok) throw new Error('Refresh failed')

        const { access_token } = await res.json()
        if (!access_token) throw new Error('Missing token')

        const response = NextResponse.redirect(new URL(redirectTo, request.url))
        response.cookies.set(AUTH_COOKIE_NAME, access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 15 * 60,
            sameSite: 'lax',
            path: '/',
        })
        return response
    } catch {
        const response = NextResponse.redirect(new URL(SIGNIN_URL, request.url))
        response.cookies.delete(AUTH_COOKIE_NAME)
        response.cookies.delete(REFRESH_COOKIE_NAME)
        return response
    }
}
