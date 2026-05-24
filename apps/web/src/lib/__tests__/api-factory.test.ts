/**
 * @jest-environment jsdom
 */
import { api } from '../api-factory'

const BASE = 'http://localhost:3000'

beforeEach(() => {
    process.env.NEXT_PUBLIC_APP_BASE_URL = BASE
    Object.defineProperty(document, 'cookie', {
        writable: true,
        value: '',
    })
    jest.resetAllMocks()
})

function mockFetch(body: unknown, status = 200) {
    global.fetch = jest.fn().mockResolvedValue({
        ok: status >= 200 && status < 300,
        status,
        json: jest.fn().mockResolvedValue(body),
    } as any)
}

// ─── CSRF header ─────────────────────────────────────────────────────────────

describe('client-side CSRF header', () => {
    it('sends x-csrf-token header when csrf-token cookie is present', async () => {
        Object.defineProperty(document, 'cookie', { writable: true, value: 'csrf-token=abc123' })
        mockFetch({ ok: true })

        await api.API('/api/test')

        const headers = (global.fetch as jest.Mock).mock.calls[0][1].headers
        expect(headers['x-csrf-token']).toBe('abc123')
    })

    it('does not send x-csrf-token when csrf cookie is absent', async () => {
        Object.defineProperty(document, 'cookie', { writable: true, value: '' })
        mockFetch({ ok: true })

        await api.API('/api/test')

        const headers = (global.fetch as jest.Mock).mock.calls[0][1].headers
        expect(headers['x-csrf-token']).toBeUndefined()
    })

    it('decodes URI-encoded CSRF token', async () => {
        Object.defineProperty(document, 'cookie', {
            writable: true,
            value: 'csrf-token=abc%3D%3D123',
        })
        mockFetch({ ok: true })

        await api.API('/api/test')

        const headers = (global.fetch as jest.Mock).mock.calls[0][1].headers
        expect(headers['x-csrf-token']).toBe('abc==123')
    })
})

// ─── URL building ─────────────────────────────────────────────────────────────

describe('URL building', () => {
    it('builds correct full URL from endpoint', async () => {
        mockFetch({ data: true })
        await api.API('/api/user/me')
        expect(global.fetch).toHaveBeenCalledWith(
            `${BASE}/api/user/me`,
            expect.any(Object),
        )
    })

    it('appends params as query string', async () => {
        mockFetch({ data: true })
        await api.API('/api/items', { params: { page: 1, size: 10 } })
        const url = (global.fetch as jest.Mock).mock.calls[0][0] as string
        expect(url).toContain('page=1')
        expect(url).toContain('size=10')
    })

    it('skips undefined param values', async () => {
        mockFetch({ data: true })
        await api.API('/api/items', { params: { page: 1, filter: undefined } })
        const url = (global.fetch as jest.Mock).mock.calls[0][0] as string
        expect(url).toContain('page=1')
        expect(url).not.toContain('filter')
    })

    it('appends to existing query string with &', async () => {
        mockFetch({ data: true })
        await api.API('/api/items?sort=asc', { params: { page: 2 } })
        const url = (global.fetch as jest.Mock).mock.calls[0][0] as string
        expect(url).toContain('sort=asc')
        expect(url).toContain('page=2')
        expect(url).toContain('&')
    })

    it('does not append query string when params is empty object', async () => {
        mockFetch({ data: true })
        await api.API('/api/items', { params: {} })
        const url = (global.fetch as jest.Mock).mock.calls[0][0] as string
        expect(url).toBe(`${BASE}/api/items`)
    })
})

// ─── Headers ─────────────────────────────────────────────────────────────────

describe('default headers', () => {
    it('sets Accept and Content-Type by default', async () => {
        mockFetch({})
        await api.API('/api/test')
        const headers = (global.fetch as jest.Mock).mock.calls[0][1].headers
        expect(headers['Accept']).toBe('application/json')
        expect(headers['Content-Type']).toBe('application/json')
    })

    it('removes Content-Type when body is FormData', async () => {
        mockFetch({})
        const formData = new FormData()
        formData.append('file', new Blob(['data']))
        await api.API('/api/upload', { method: 'POST', body: formData })
        const headers = (global.fetch as jest.Mock).mock.calls[0][1].headers
        expect(headers['Content-Type']).toBeUndefined()
    })

    it('merges caller-provided headers with defaults', async () => {
        mockFetch({})
        await api.API('/api/test', { headers: { 'X-Custom': 'value' } })
        const headers = (global.fetch as jest.Mock).mock.calls[0][1].headers
        expect(headers['X-Custom']).toBe('value')
        expect(headers['Accept']).toBe('application/json')
    })

    it('sends credentials: include by default', async () => {
        mockFetch({})
        await api.API('/api/test')
        const opts = (global.fetch as jest.Mock).mock.calls[0][1]
        expect(opts.credentials).toBe('include')
    })
})

// ─── Error handling ───────────────────────────────────────────────────────────

describe('error handling', () => {
    it('throws with backend message on non-ok response', async () => {
        mockFetch({ message: 'Unauthorized' }, 401)
        await expect(api.API('/api/test')).rejects.toThrow('Unauthorized')
    })

    it('throws generic API Error when response has no message', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
            status: 500,
            json: jest.fn().mockRejectedValue(new Error('no json')),
        } as any)
        await expect(api.API('/api/test')).rejects.toThrow('API Error 500')
    })

    it('returns parsed JSON on success', async () => {
        mockFetch({ user: { id: '1', name: 'Test' } })
        const result = await api.API<{ user: { id: string } }>('/api/user')
        expect(result.user.id).toBe('1')
    })
})
