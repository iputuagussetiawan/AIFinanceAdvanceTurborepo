import { NextRequest, NextResponse } from 'next/server'
import { AUTH_COOKIE_NAME, REFRESH_COOKIE_NAME, SIGNIN_URL } from '@/lib/constants'

const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:4001/api'

export async function GET(request: NextRequest) {
    const redirect = request.nextUrl.searchParams.get('redirect') || '/'
    const refreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value

    if (!refreshToken) {
        return NextResponse.redirect(new URL(SIGNIN_URL, request.url))
    }

    try {
        const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { Cookie: `${REFRESH_COOKIE_NAME}=${refreshToken}` },
            cache: 'no-store',
        })

        if (!res.ok) throw new Error('Refresh failed')

        const { access_token } = await res.json()
        const response = NextResponse.redirect(new URL(redirect, request.url))
        response.cookies.set(AUTH_COOKIE_NAME, access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15 * 60,
            path: '/',
        })
        return response
    } catch {
        return NextResponse.redirect(new URL(SIGNIN_URL, request.url))
    }
}
