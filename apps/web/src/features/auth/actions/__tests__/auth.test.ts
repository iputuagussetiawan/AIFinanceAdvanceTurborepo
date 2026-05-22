/**
 * @jest-environment node
 */
jest.mock('next/navigation', () => ({ redirect: jest.fn() }))
jest.mock('@/features/auth/services/auth-service', () => ({
    authService: {
        login: jest.fn(),
        register: jest.fn(),
        verify: jest.fn(),
        forgotPassword: jest.fn(),
        resetPassword: jest.fn(),
        logout: jest.fn(),
    },
}))
jest.mock('next/headers', () => ({ cookies: jest.fn() }))

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { authService } from '@/features/auth/services/auth-service'
import {
    handleLogin,
    handleLogout,
    handleRegister,
    handleForgotPassword,
    handleResetPassword,
} from '../auth'

const mockRedirect = redirect as jest.MockedFunction<typeof redirect>
const mockLogin = authService.login as jest.MockedFunction<typeof authService.login>
const mockRegister = authService.register as jest.MockedFunction<typeof authService.register>
const mockLogout = authService.logout as jest.MockedFunction<typeof authService.logout>
const mockForgotPassword = authService.forgotPassword as jest.MockedFunction<typeof authService.forgotPassword>
const mockResetPassword = authService.resetPassword as jest.MockedFunction<typeof authService.resetPassword>

const MOCK_USER = { _id: 'u1', name: 'Test', email: 'test@example.com' } as any

let mockCookieSet: jest.Mock
let mockCookieDelete: jest.Mock
let mockCookieGet: jest.Mock

beforeEach(() => {
    jest.clearAllMocks()
    mockCookieSet = jest.fn()
    mockCookieDelete = jest.fn()
    mockCookieGet = jest.fn()
    ;(cookies as jest.Mock).mockResolvedValue({
        set: mockCookieSet,
        delete: mockCookieDelete,
        get: mockCookieGet,
    })
})

// ─── handleLogin ─────────────────────────────────────────────────────────────

describe('handleLogin', () => {
    const credentials = { email: 'test@example.com', password: 'Password1!' }

    it('returns success and sets both cookies on valid credentials', async () => {
        mockLogin.mockResolvedValue({
            message: 'Logged in successfully',
            user: MOCK_USER,
            access_token: 'access_tok',
            refresh_token: 'refresh_tok',
        } as any)

        const result = await handleLogin(credentials)

        expect(result.success).toBe(true)
        expect(result.user).toEqual(MOCK_USER)
        expect(mockCookieSet).toHaveBeenCalledWith(
            'accessToken',
            'access_tok',
            expect.objectContaining({ httpOnly: true, path: '/' }),
        )
        expect(mockCookieSet).toHaveBeenCalledWith(
            'refreshToken',
            'refresh_tok',
            expect.objectContaining({ httpOnly: true, path: '/' }),
        )
    })

    it('returns success: false on failed login', async () => {
        mockLogin.mockRejectedValue(new Error('Invalid email or password'))
        const result = await handleLogin(credentials)
        expect(result.success).toBe(false)
        expect((result as any).error).toMatch(/Invalid email or password/i)
    })

    it('does not set cookies on failed login', async () => {
        mockLogin.mockRejectedValue(new Error('Bad credentials'))
        await handleLogin(credentials)
        expect(mockCookieSet).not.toHaveBeenCalled()
    })

    it('accessToken cookie has maxAge of 15 minutes (900 seconds)', async () => {
        mockLogin.mockResolvedValue({
            message: 'ok', user: MOCK_USER, access_token: 'tok', refresh_token: 'rtok',
        } as any)
        await handleLogin(credentials)
        const [, , opts] = mockCookieSet.mock.calls.find(([name]) => name === 'accessToken')!
        expect(opts.maxAge).toBe(900)
    })

    it('refreshToken cookie has maxAge of 30 days', async () => {
        mockLogin.mockResolvedValue({
            message: 'ok', user: MOCK_USER, access_token: 'tok', refresh_token: 'rtok',
        } as any)
        await handleLogin(credentials)
        const [, , opts] = mockCookieSet.mock.calls.find(([name]) => name === 'refreshToken')!
        expect(opts.maxAge).toBe(30 * 24 * 60 * 60)
    })
})

// ─── handleLogout ─────────────────────────────────────────────────────────────

describe('handleLogout', () => {
    it('deletes both auth cookies', async () => {
        mockCookieGet.mockReturnValue({ value: 'some_token' })
        mockLogout.mockResolvedValue(undefined as any)
        await handleLogout()
        expect(mockCookieDelete).toHaveBeenCalledWith('accessToken')
        expect(mockCookieDelete).toHaveBeenCalledWith('refreshToken')
    })

    it('redirects to /signin after logout', async () => {
        mockCookieGet.mockReturnValue({ value: 'some_token' })
        mockLogout.mockResolvedValue(undefined as any)
        await handleLogout()
        expect(mockRedirect).toHaveBeenCalledWith('/signin')
    })

    it('still deletes cookies even when backend logout call fails', async () => {
        mockCookieGet.mockReturnValue({ value: 'some_token' })
        mockLogout.mockRejectedValue(new Error('backend down'))
        await handleLogout()
        expect(mockCookieDelete).toHaveBeenCalledWith('accessToken')
        expect(mockCookieDelete).toHaveBeenCalledWith('refreshToken')
    })

    it('skips backend logout call when no access token exists', async () => {
        mockCookieGet.mockReturnValue(undefined)
        await handleLogout()
        expect(mockLogout).not.toHaveBeenCalled()
        expect(mockCookieDelete).toHaveBeenCalledWith('accessToken')
    })
})

// ─── handleRegister ───────────────────────────────────────────────────────────

describe('handleRegister', () => {
    const data = { name: 'New User', email: 'new@example.com', password: 'Password1!', confirmPassword: 'Password1!' }

    it('returns success: true when registration succeeds', async () => {
        ;(authService.register as jest.Mock).mockResolvedValue({ userId: 'u1' })
        const result = await handleRegister(data)
        expect(result.success).toBe(true)
    })

    it('returns success: false when registration fails', async () => {
        ;(authService.register as jest.Mock).mockRejectedValue(new Error('Email already exists'))
        const result = await handleRegister(data)
        expect(result.success).toBe(false)
        expect((result as any).error).toMatch(/Email already exists/i)
    })
})

// ─── handleForgotPassword ─────────────────────────────────────────────────────

describe('handleForgotPassword', () => {
    it('returns success: true on success', async () => {
        mockForgotPassword.mockResolvedValue({} as any)
        const result = await handleForgotPassword({ email: 'test@example.com' })
        expect(result.success).toBe(true)
        expect(result.message).toBeDefined()
    })

    it('returns success: false on failure', async () => {
        mockForgotPassword.mockRejectedValue(new Error('User not found'))
        const result = await handleForgotPassword({ email: 'unknown@example.com' })
        expect(result.success).toBe(false)
    })
})

// ─── handleResetPassword ──────────────────────────────────────────────────────

describe('handleResetPassword', () => {
    it('returns success: true on valid reset', async () => {
        mockResetPassword.mockResolvedValue({} as any)
        const result = await handleResetPassword({ password: 'NewPass1!', verificationCode: 'code123' })
        expect(result.success).toBe(true)
        expect(result.message).toBeDefined()
    })

    it('returns success: false on invalid/expired code', async () => {
        mockResetPassword.mockRejectedValue(new Error('Invalid or expired verification code'))
        const result = await handleResetPassword({ password: 'NewPass1!', verificationCode: 'bad' })
        expect(result.success).toBe(false)
    })
})
