import { api } from '@/lib/api-factory'
import type { ForgotPasswordInput, ResetPasswordInput, SigninInput, SignupInput, VerifyEmailInput } from '../types/auth-type'

export const authService = {
    register: (data: SignupInput) =>
        api.API<{ userId: string }>('/api/auth/register', { method: 'POST', body: JSON.stringify(data), cache: 'no-store' }),

    verifyEmail: (data: VerifyEmailInput) =>
        api.API<{ message: string }>('/api/auth/verify/email', { method: 'POST', body: JSON.stringify(data), cache: 'no-store' }),

    login: (data: SigninInput) =>
        api.API<{ message: string; access_token: string }>('/api/auth/login', { method: 'POST', body: JSON.stringify(data), cache: 'no-store' }),

    logout: () =>
        api.API<{ message: string }>('/api/auth/logout', { method: 'POST', cache: 'no-store' }),

    forgotPassword: (data: ForgotPasswordInput) =>
        api.API<{ message: string }>('/api/auth/password/forgot', { method: 'POST', body: JSON.stringify(data), cache: 'no-store' }),

    resetPassword: (data: ResetPasswordInput) =>
        api.API<{ message: string }>('/api/auth/password/reset', { method: 'POST', body: JSON.stringify(data), cache: 'no-store' }),
}
