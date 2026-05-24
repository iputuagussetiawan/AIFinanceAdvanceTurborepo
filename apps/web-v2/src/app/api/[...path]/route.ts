import { NextRequest, NextResponse } from 'next/server'
import { AUTH_COOKIE_NAME, CSRF_COOKIE_NAME, CSRF_HEADER_NAME, REFRESH_COOKIE_NAME } from '@/lib/constants'

const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:4001/api'
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

function validateCsrf(request: NextRequest): boolean {
    if (SAFE_METHODS.has(request.method)) return true
    const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value
    const headerToken = request.headers.get(CSRF_HEADER_NAME)
    return !!(cookieToken && headerToken && cookieToken === headerToken)
}

function buildTargetUrl(request: NextRequest): string {
    const path = request.nextUrl.pathname.replace('/api/', '')
    return `${API_BASE_URL}/${path}${request.nextUrl.search}`
}

function buildHeaders(request: NextRequest): Headers {
    const headers = new Headers(request.headers)
    headers.delete('host')
    return headers
}

async function proxyRequest(targetUrl: string, method: string, headers: Headers, body: ArrayBuffer | null) {
    return fetch(targetUrl, { method, headers, body: body ?? undefined, cache: 'no-store' })
}

async function tryRefreshToken(refreshToken: string): Promise<string | null> {
    try {
        const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { Cookie: `${REFRESH_COOKIE_NAME}=${refreshToken}` },
            cache: 'no-store',
        })
        if (!res.ok) return null
        const data = await res.json()
        return data.access_token ?? null
    } catch {
        return null
    }
}

async function entries(request: NextRequest) {
    if (!validateCsrf(request)) {
        return new NextResponse(JSON.stringify({ message: 'Invalid CSRF token' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
        })
    }

    const targetUrl = buildTargetUrl(request)
    const headers = buildHeaders(request)
    const method = request.method
    const body = method !== 'GET' && method !== 'HEAD' ? await request.arrayBuffer() : null

    let response = await proxyRequest(targetUrl, method, headers, body)

    if (response.status === 401) {
        const refreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value
        if (refreshToken) {
            const newAccessToken = await tryRefreshToken(refreshToken)
            if (newAccessToken) {
                const updatedHeaders = new Headers(headers)
                updatedHeaders.set('Authorization', `Bearer ${newAccessToken}`)
                const updatedCookies = (request.headers.get('cookie') || '')
                    .split('; ')
                    .filter((c) => !c.startsWith(`${AUTH_COOKIE_NAME}=`))
                    .concat(`${AUTH_COOKIE_NAME}=${newAccessToken}`)
                    .join('; ')
                updatedHeaders.set('cookie', updatedCookies)
                response = await proxyRequest(targetUrl, method, updatedHeaders, body)

                const nextResponse = new NextResponse(response.body, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers,
                })
                nextResponse.cookies.set(AUTH_COOKIE_NAME, newAccessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 15 * 60,
                    sameSite: 'lax',
                    path: '/',
                })
                return nextResponse
            }
        }
    }

    return new NextResponse(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
    })
}

export const GET = entries
export const POST = entries
export const PUT = entries
export const DELETE = entries
export const PATCH = entries
