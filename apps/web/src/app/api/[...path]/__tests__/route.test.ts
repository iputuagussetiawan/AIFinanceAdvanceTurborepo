/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'
import { GET, POST, PUT, DELETE, PATCH } from '../route'

const CSRF_TOKEN = 'test-csrf-token-abc'
const ACCESS_TOKEN = 'access_token_value'
const NEW_ACCESS_TOKEN = 'new_access_token'
const REFRESH_TOKEN = 'refresh_token_value'
const BACKEND = 'http://localhost:5000/api'

beforeEach(() => {
    process.env.BACKEND_URL = BACKEND
    jest.resetAllMocks()
})

function makeRequest(
    path: string,
    method: string,
    opts: { csrfCookie?: string; csrfHeader?: string; cookies?: Record<string, string>; body?: string } = {},
) {
    const url = `http://localhost:3000${path}`
    const headers = new Headers({ 'Content-Type': 'application/json' })

    const cookieParts: string[] = []
    if (opts.csrfCookie) cookieParts.push(`csrf-token=${opts.csrfCookie}`)
    if (opts.cookies) {
        Object.entries(opts.cookies).forEach(([k, v]) => cookieParts.push(`${k}=${v}`))
    }
    if (cookieParts.length) headers.set('cookie', cookieParts.join('; '))
    if (opts.csrfHeader) headers.set('x-csrf-token', opts.csrfHeader)

    return new NextRequest(url, {
        method,
        headers,
        body: opts.body ?? undefined,
    })
}

function mockFetch(body: unknown, status = 200, headers: Record<string, string> = {}) {
    const responseHeaders = new Headers(headers)
    global.fetch = jest.fn().mockResolvedValue({
        ok: status >= 200 && status < 300,
        status,
        statusText: status === 200 ? 'OK' : 'Error',
        headers: responseHeaders,
        body: JSON.stringify(body),
        json: jest.fn().mockResolvedValue(body),
    } as any)
}

// ─── CSRF validation ──────────────────────────────────────────────────────────

describe('CSRF validation', () => {
    it('allows GET requests without CSRF token', async () => {
        mockFetch({ data: 'ok' })
        const req = makeRequest('/api/user/current', 'GET')
        const res = await GET(req)
        expect(res.status).not.toBe(403)
        expect(global.fetch).toHaveBeenCalled()
    })

    it('allows HEAD requests without CSRF token', async () => {
        mockFetch({})
        const req = makeRequest('/api/health', 'HEAD')
        // HEAD handler uses GET export
        const res = await GET(req)
        expect(res.status).not.toBe(403)
    })

    it('blocks POST without csrf-token cookie', async () => {
        const req = makeRequest('/api/auth/login', 'POST', { body: '{}' })
        const res = await POST(req)
        expect(res.status).toBe(403)
        expect(global.fetch).not.toHaveBeenCalled()
    })

    it('blocks POST when header does not match cookie', async () => {
        const req = makeRequest('/api/auth/login', 'POST', {
            csrfCookie: 'token-A',
            csrfHeader: 'token-B',
            body: '{}',
        })
        const res = await POST(req)
        expect(res.status).toBe(403)
    })

    it('allows POST when header matches cookie', async () => {
        mockFetch({ message: 'ok' })
        const req = makeRequest('/api/auth/login', 'POST', {
            csrfCookie: CSRF_TOKEN,
            csrfHeader: CSRF_TOKEN,
            body: '{}',
        })
        const res = await POST(req)
        expect(res.status).not.toBe(403)
        expect(global.fetch).toHaveBeenCalled()
    })

    it('blocks PUT without valid CSRF', async () => {
        const req = makeRequest('/api/user/update', 'PUT', { body: '{}' })
        const res = await PUT(req)
        expect(res.status).toBe(403)
    })

    it('blocks DELETE without valid CSRF', async () => {
        const req = makeRequest('/api/session/sess_1', 'DELETE')
        const res = await DELETE(req)
        expect(res.status).toBe(403)
    })

    it('blocks PATCH without valid CSRF', async () => {
        const req = makeRequest('/api/user/update', 'PATCH', { body: '{}' })
        const res = await PATCH(req)
        expect(res.status).toBe(403)
    })

    it('returns 403 JSON body with message', async () => {
        const req = makeRequest('/api/auth/login', 'POST', { body: '{}' })
        const res = await POST(req)
        const body = await res.json()
        expect(body.message).toMatch(/csrf/i)
    })
})

// ─── Proxy URL building ───────────────────────────────────────────────────────

describe('proxy URL building', () => {
    it('strips /api/ prefix and appends to BACKEND_URL', async () => {
        mockFetch({ ok: true })
        const req = makeRequest('/api/user/current', 'GET')
        await GET(req)
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/user/current'),
            expect.any(Object),
        )
    })

    it('preserves query string when proxying', async () => {
        mockFetch({ items: [] })
        const req = makeRequest('/api/session/all?page=1&size=5', 'GET')
        await GET(req)
        const url = (global.fetch as jest.Mock).mock.calls[0][0]
        expect(url).toContain('page=1')
        expect(url).toContain('size=5')
    })
})

// ─── Token refresh on 401 ────────────────────────────────────────────────────

describe('silent token refresh on 401', () => {
    it('retries request and sets new cookie when refresh succeeds', async () => {
        global.fetch = jest.fn()
            .mockResolvedValueOnce({
                ok: false,
                status: 401,
                statusText: 'Unauthorized',
                headers: new Headers(),
                body: null,
            })
            .mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: jest.fn().mockResolvedValue({ access_token: NEW_ACCESS_TOKEN }),
            })
            .mockResolvedValueOnce({
                ok: true,
                status: 200,
                statusText: 'OK',
                headers: new Headers(),
                body: JSON.stringify({ data: 'retried' }),
            })

        const req = makeRequest('/api/user/current', 'GET', {
            cookies: { refreshToken: REFRESH_TOKEN },
        })
        const res = await GET(req)

        expect(res.status).toBe(200)
        // Cookie should be set in response
        const setCookie = res.headers.get('set-cookie')
        expect(setCookie).toContain('accessToken')
        expect(setCookie).toContain(NEW_ACCESS_TOKEN)
        expect(global.fetch).toHaveBeenCalledTimes(3) // original + refresh + retry
    })

    it('returns original 401 when no refresh token cookie exists', async () => {
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: false,
            status: 401,
            statusText: 'Unauthorized',
            headers: new Headers(),
            body: null,
        })

        const req = makeRequest('/api/user/current', 'GET')
        const res = await GET(req)

        expect(res.status).toBe(401)
        expect(global.fetch).toHaveBeenCalledTimes(1) // no retry
    })

    it('returns original 401 when refresh endpoint fails', async () => {
        global.fetch = jest.fn()
            .mockResolvedValueOnce({
                ok: false, status: 401, statusText: 'Unauthorized', headers: new Headers(), body: null,
            })
            .mockResolvedValueOnce({
                ok: false, status: 401, json: jest.fn().mockResolvedValue({}),
            })

        const req = makeRequest('/api/user/current', 'GET', {
            cookies: { refreshToken: REFRESH_TOKEN },
        })
        const res = await GET(req)

        expect(res.status).toBe(401)
    })
})
