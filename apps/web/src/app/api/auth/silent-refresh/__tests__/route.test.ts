/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'
import { GET } from '../route'

const BACKEND = 'http://localhost:5000/api'
const APP_URL = 'http://localhost:3000'

beforeEach(() => {
    process.env.BACKEND_URL = BACKEND
    jest.resetAllMocks()
})

function makeRequest(opts: { refreshToken?: string; redirect?: string } = {}) {
    const url = new URL(`${APP_URL}/api/auth/silent-refresh`)
    if (opts.redirect) url.searchParams.set('redirect', opts.redirect)

    const headers = new Headers()
    if (opts.refreshToken) {
        headers.set('cookie', `refreshToken=${opts.refreshToken}`)
    }
    return new NextRequest(url.toString(), { headers })
}

function mockFetch(body: unknown, ok = true) {
    global.fetch = jest.fn().mockResolvedValue({
        ok,
        status: ok ? 200 : 401,
        json: jest.fn().mockResolvedValue(body),
    } as any)
}

// ─── No refresh token ─────────────────────────────────────────────────────────

describe('missing refresh token', () => {
    it('redirects to /signin when refreshToken cookie is absent', async () => {
        const req = makeRequest()
        const res = await GET(req)
        expect(res.status).toBe(307)
        expect(res.headers.get('location')).toContain('/signin')
    })

    it('does not call backend when refreshToken is absent', async () => {
        global.fetch = jest.fn()
        const req = makeRequest()
        await GET(req)
        expect(global.fetch).not.toHaveBeenCalled()
    })
})

// ─── Successful refresh ───────────────────────────────────────────────────────

describe('successful refresh', () => {
    it('redirects to /dashboard by default', async () => {
        mockFetch({ access_token: 'new_token' })
        const req = makeRequest({ refreshToken: 'valid_refresh' })
        const res = await GET(req)
        expect(res.status).toBe(307)
        expect(res.headers.get('location')).toContain('/dashboard')
    })

    it('redirects to custom redirect param', async () => {
        mockFetch({ access_token: 'new_token' })
        const req = makeRequest({ refreshToken: 'valid_refresh', redirect: '/dashboard/account' })
        const res = await GET(req)
        expect(res.headers.get('location')).toContain('/dashboard/account')
    })

    it('sets httpOnly accessToken cookie with new token', async () => {
        mockFetch({ access_token: 'brand_new_token' })
        const req = makeRequest({ refreshToken: 'valid_refresh' })
        const res = await GET(req)
        const cookie = res.headers.get('set-cookie') ?? ''
        expect(cookie).toContain('accessToken=brand_new_token')
        expect(cookie).toContain('HttpOnly')
        expect(cookie).toContain('Path=/')
    })

    it('calls backend refresh endpoint with correct cookie header', async () => {
        mockFetch({ access_token: 'token' })
        const req = makeRequest({ refreshToken: 'my_refresh_token' })
        await GET(req)
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/auth/refresh'),
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    Cookie: 'refreshToken=my_refresh_token',
                }),
            }),
        )
    })
})

// ─── Failed refresh ───────────────────────────────────────────────────────────

describe('failed refresh', () => {
    it('redirects to /signin when backend returns error', async () => {
        mockFetch({ error: 'invalid' }, false)
        const req = makeRequest({ refreshToken: 'bad_token' })
        const res = await GET(req)
        expect(res.status).toBe(307)
        expect(res.headers.get('location')).toContain('/signin')
    })

    it('clears accessToken and refreshToken cookies on failure', async () => {
        mockFetch({}, false)
        const req = makeRequest({ refreshToken: 'bad_token' })
        const res = await GET(req)
        const cookies = res.headers.get('set-cookie') ?? ''
        expect(cookies).toMatch(/accessToken=;|accessToken=.*Max-Age=0/)
    })

    it('redirects to /signin when access_token is missing from response', async () => {
        mockFetch({ access_token: null })
        const req = makeRequest({ refreshToken: 'valid_refresh' })
        const res = await GET(req)
        expect(res.headers.get('location')).toContain('/signin')
    })

    it('redirects to /signin when fetch throws', async () => {
        global.fetch = jest.fn().mockRejectedValue(new Error('Network error'))
        const req = makeRequest({ refreshToken: 'any_token' })
        const res = await GET(req)
        expect(res.headers.get('location')).toContain('/signin')
    })
})
