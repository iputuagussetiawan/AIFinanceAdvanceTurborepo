jest.mock('../config/app.config', () => ({
    config: {
        JWT_SECRET: 'test_access_secret_at_least_32_chars_xx',
        JWT_EXPIRES_IN: '15m',
        REFRESH_JWT_SECRET: 'test_refresh_secret_at_least_32chars',
        REFRESH_JWT_EXPIRES_IN: '30d',
    },
}))

import jwt from 'jsonwebtoken'
import { signJwtToken, verifyJwtToken } from './jwt'

const ACCESS_SECRET = 'test_access_secret_at_least_32_chars_xx'
const REFRESH_SECRET = 'test_refresh_secret_at_least_32chars'
const basePayload = { userId: 'user_123', sessionId: 'session_456' } as any

describe('signJwtToken', () => {
    it('returns a three-part JWT string', () => {
        const token = signJwtToken(basePayload)
        expect(typeof token).toBe('string')
        expect(token.split('.')).toHaveLength(3)
    })

    it('encodes userId and sessionId in the payload', () => {
        const token = signJwtToken(basePayload)
        const decoded = jwt.decode(token) as Record<string, unknown>
        expect(decoded.userId).toBe('user_123')
        expect(decoded.sessionId).toBe('session_456')
    })

    it('sets audience to ["user"]', () => {
        const token = signJwtToken(basePayload)
        const decoded = jwt.decode(token) as Record<string, unknown>
        expect(decoded.aud).toContain('user')
    })

    it('signs with a custom secret when options are provided', () => {
        const token = signJwtToken(basePayload as any, {
            secret: REFRESH_SECRET,
            expiresIn: '30d' as any,
        })
        const result = verifyJwtToken(token, REFRESH_SECRET)
        expect('payload' in result).toBe(true)
    })
})

describe('verifyJwtToken', () => {
    let validToken: string

    beforeEach(() => {
        validToken = signJwtToken(basePayload)
    })

    it('returns payload for a valid token', () => {
        const result = verifyJwtToken(validToken, ACCESS_SECRET)
        expect('payload' in result).toBe(true)
        if ('payload' in result) {
            expect((result.payload as any).userId).toBe('user_123')
            expect((result.payload as any).sessionId).toBe('session_456')
        }
    })

    it('returns error for wrong secret', () => {
        const result = verifyJwtToken(validToken, 'wrong_secret')
        expect('error' in result).toBe(true)
    })

    it('returns error for an expired token', () => {
        const expired = jwt.sign(
            { userId: 'u', aud: ['user'], exp: Math.floor(Date.now() / 1000) - 60 },
            ACCESS_SECRET,
        )
        const result = verifyJwtToken(expired, ACCESS_SECRET)
        expect('error' in result).toBe(true)
        if ('error' in result) expect(result.error).toMatch(/expired/i)
    })

    it('returns error for a malformed token', () => {
        const result = verifyJwtToken('not.a.valid.jwt', ACCESS_SECRET)
        expect('error' in result).toBe(true)
    })

    it('returns error when token is signed with a different secret', () => {
        const other = jwt.sign({ userId: 'u', aud: ['user'] }, 'other_secret')
        const result = verifyJwtToken(other, ACCESS_SECRET)
        expect('error' in result).toBe(true)
    })

    it('returns error when refresh token is verified with access secret', () => {
        const refreshToken = signJwtToken(basePayload as any, {
            secret: REFRESH_SECRET,
            expiresIn: '30d' as any,
        })
        const result = verifyJwtToken(refreshToken, ACCESS_SECRET)
        expect('error' in result).toBe(true)
    })
})
