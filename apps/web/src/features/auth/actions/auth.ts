'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { AUTH_COOKIE_NAME, REFRESH_COOKIE_NAME, SIGNIN_URL } from '@/lib/constants'

import { authService } from '../services/auth-service'
import type {
    ForgotPasswordInputType,
    IVerifyInputType,
    SignupInputType,
} from '../types/auth-type'

export async function handleRegister(data: SignupInputType) {
    try {
        const user = await authService.register(data)
        return { success: true, user }
    } catch (error: any) {
        return { success: false, error: error.message || 'Failed to register' }
    }
}

export async function handleVerifyEmail(data: IVerifyInputType) {
    try {
        const user = await authService.verify(data)
        return { success: true, user }
    } catch (error: any) {
        return { success: false, error: error.message || 'Failed to verify' }
    }
}

export async function handleForgotPassword(data: ForgotPasswordInputType) {
    try {
        // 2. Call your backend service
        // Ensure 'forgotPassword' is implemented in your userService
        await authService.forgotPassword(data)

        return {
            success: true,
            message: 'If an account exists with that email, a reset link has been sent.',
        }
    } catch (error: any) {
        // 🗝️ Security Tip: Often better to return success even if email isn't found
        // to prevent "Email Enumeration" attacks.
        return {
            success: false,
            error: error.message || 'Failed to send reset email. Please try again later.',
        }
    }
}

export async function handleResetPassword(data: any) {
    try {
        await authService.resetPassword(data)
        return {
            success: true,
            message: 'Your password has been successfully updated. You can now log in.',
        }
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message || error.message || 'Failed to update password'
        console.error('[RESET_PASSWORD_ERROR]:', error)
        return {
            success: false,
            error: errorMessage,
        }
    }
}

export async function handleLogout() {
    const cookieStore = await cookies()
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
    if (token) {
        try {
            await authService.logout()
        } catch (error) {
            console.error('Backend logout notice failed:', error)
        }
    }
    cookieStore.delete(AUTH_COOKIE_NAME)
    cookieStore.delete(REFRESH_COOKIE_NAME)
    redirect(SIGNIN_URL)
}
