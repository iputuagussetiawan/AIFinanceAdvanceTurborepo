/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server'

// ── mock fetch before module load ─────────────────────────────────────────────
const mockFetch = jest.fn()
global.fetch = mockFetch

import { GET, POST, DELETE } from '@/app/api/[...path]/route'

// ── helpers ───────────────────────────────────────────────────────────────────

function fakeResponse(status: number, body: object) {
    return {
        ok: status >= 200 && status < 300,
        status,
        statusText: status === 200 ? 'OK' : 'Unauthorized',
        body: null,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve(body),
    }
}

function makeRequest(path: string, opts: RequestInit & { cookies?: string } = {}) {
    const { cookies, ...rest } = opts
    return new NextRequest(`http://localhost:3000${path}`, {
        ...rest,
        headers: {
            ...(rest.headers as Record<string, string>),
            ...(cookies ? { cookie: cookies } : {}),
        },
    })
}

// ── tests ─────────────────────────────────────────────────────────────────────

describe('API Proxy Route', () => {
    beforeEach(() => mockFetch.mockReset())

    describe('normal forwarding', () => {
        it('forwards GET request to the backend and returns the response', async () => {
            mockFetch.mockResolvedValueOnce(fakeResponse(200, { data: 'ok' }))

            const res = await GET(makeRequest('/api/user/profile'))

            expect(res.status).toBe(200)
            expect(mockFetch).toHaveBeenCalledTimes(1)
            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining('/user/profile'),
                expect.objectContaining({ method: 'GET', cache: 'no-store' }),
            )
        })

        it('forwards POST request with body to the backend', async () => {
            mockFetch.mockResolvedValueOnce(fakeResponse(200, { success: true }))

            const res = await POST(
                makeRequest('/api/auth/login', {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({ email: 'a@b.com', password: 'pass' }),
                }),
            )

            expect(res.status).toBe(200)
            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining('/auth/login'),
                expect.objectContaining({ method: 'POST' }),
            )
        })

        it('passes DELETE through correctly', async () => {
            mockFetch.mockResolvedValueOnce(fakeResponse(200, { deleted: true }))
            const res = await DELETE(makeRequest('/api/session/abc123', { method: 'DELETE' }))
            expect(res.status).toBe(200)
            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining('/session/abc123'),
                expect.objectContaining({ method: 'DELETE' }),
            )
        })
    })

    describe('401 handling — no refreshToken', () => {
        it('returns 401 as-is when no cookies present', async () => {
            mockFetch.mockResolvedValueOnce(fakeResponse(401, { message: 'Unauthorized' }))

            const res = await GET(makeRequest('/api/user/profile'))

            expect(res.status).toBe(401)
            expect(mockFetch).toHaveBeenCalledTimes(1) // no retry
        })

        it('returns 401 when accessToken exists but no refreshToken', async () => {
            mockFetch.mockResolvedValueOnce(fakeResponse(401, { message: 'Unauthorized' }))

            const res = await GET(makeRequest('/api/user/profile', { cookies: 'accessToken=expired' }))

            expect(res.status).toBe(401)
            expect(mockFetch).toHaveBeenCalledTimes(1)
        })
    })

    describe('401 handling — with refreshToken', () => {
        it('retries with new token after successful refresh', async () => {
            mockFetch
                .mockResolvedValueOnce(fakeResponse(401, { message: 'Unauthorized' }))          // original
                .mockResolvedValueOnce(fakeResponse(200, { access_token: 'new_token_abc' }))    // refresh
                .mockResolvedValueOnce(fakeResponse(200, { data: 'protected' }))                // retry

            const res = await GET(
                makeRequest('/api/user/profile', {
                    cookies: 'accessToken=old; refreshToken=refresh_xyz',
                }),
            )

            expect(res.status).toBe(200)
            expect(mockFetch).toHaveBeenCalledTimes(3)

            // Refresh call must use the refreshToken
            expect(mockFetch).toHaveBeenNthCalledWith(
                2,
                expect.stringContaining('/auth/refresh'),
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({ Cookie: 'refreshToken=refresh_xyz' }),
                }),
            )
        })

        it('sets new accessToken cookie on the response after refresh', async () => {
            mockFetch
                .mockResolvedValueOnce(fakeResponse(401, { message: 'Unauthorized' }))
                .mockResolvedValueOnce(fakeResponse(200, { access_token: 'brand_new_token' }))
                .mockResolvedValueOnce(fakeResponse(200, { data: 'ok' }))

            const res = await GET(
                makeRequest('/api/user/profile', { cookies: 'refreshToken=my_refresh' }),
            )

            const setCookie = res.headers.get('set-cookie')
            expect(setCookie).toContain('accessToken=brand_new_token')
        })

        it('returns 401 when refresh endpoint itself returns an error', async () => {
            mockFetch
                .mockResolvedValueOnce(fakeResponse(401, { message: 'Unauthorized' }))
                .mockResolvedValueOnce(fakeResponse(401, { message: 'Refresh failed' }))

            const res = await GET(
                makeRequest('/api/user/profile', { cookies: 'refreshToken=bad_refresh' }),
            )

            expect(res.status).toBe(401)
            expect(mockFetch).toHaveBeenCalledTimes(2)
        })

        it('returns 401 when refresh succeeds but returns no access_token in body', async () => {
            mockFetch
                .mockResolvedValueOnce(fakeResponse(401, { message: 'Unauthorized' }))
                .mockResolvedValueOnce(fakeResponse(200, {})) // no access_token field

            const res = await GET(
                makeRequest('/api/user/profile', { cookies: 'refreshToken=my_refresh' }),
            )

            expect(res.status).toBe(401)
            expect(mockFetch).toHaveBeenCalledTimes(2) // original + refresh (no retry)
        })
    })
})
