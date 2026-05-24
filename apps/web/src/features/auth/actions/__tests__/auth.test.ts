/**
 * @jest-environment node
 */
jest.mock('next/navigation', () => ({ redirect: jest.fn() }))
jest.mock('@/features/auth/services/auth-service', () => ({
    authService: {
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
    handleLogout,
    handleRegister,
    handleForgotPassword,
    handleResetPassword,
} from '../auth'

const mockRedirect = redirect as jest.MockedFunction<typeof redirect>
const mockRegister = authService.register as jest.MockedFunction<typeof authService.register>
const mockLogout = authService.logout as jest.MockedFunction<typeof authService.logout>
const mockForgotPassword = authService.forgotPassword as jest.MockedFunction<typeof authService.forgotPassword>
const mockResetPassword = authService.resetPassword as jest.MockedFunction<typeof authService.resetPassword>

const MOCK_USER = { _id: 'u1', firstName: 'Test', lastName: 'User', email: 'test@example.com' } as any

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
    const data = { firstName: 'New', lastName: 'User', email: 'new@example.com', password: 'Password1!', confirmPassword: 'Password1!' }

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
