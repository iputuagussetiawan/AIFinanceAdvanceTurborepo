// services/user-service.ts

import { api } from '@/lib/api-factory'

import type {
    ForgotPasswordInputType,
    ILoginResponse,
    IUserProfile,
    IUserResponse,
    IVerifyInputType,
    SigninInputType,
    SignupInputType,
} from '../types/auth-type'

export const authService = {
    // 1. Add the Register function
    register: (data: SignupInputType) =>
        api.API<IUserProfile>('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
            // We usually don't cache registration attempts
            cache: 'no-store',
        }),
    verify: (data: IVerifyInputType) =>
        api.API<IUserProfile>('/api/auth/verify/email', {
            method: 'POST',
            body: JSON.stringify(data),
            // We usually don't cache registration attempts
            cache: 'no-store',
        }),
    login: (data: SigninInputType) =>
        api.API<any>('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
            // We usually don't cache registration attempts
            cache: 'no-store',
        }),
    forgotPassword: (data: ForgotPasswordInputType) =>
        api.API<any>('/api/auth/password/forgot', {
            method: 'POST',
            body: JSON.stringify(data),
            cache: 'no-store', // Always get fresh data
        }),
    resetPassword: (data: any) =>
        api.API<any>('/api/auth/password/reset', {
            method: 'POST',
            body: JSON.stringify(data),
            cache: 'no-store', // Always get fresh data
        }),
    getMe: () =>
        api.API<IUserResponse>('/api/user/current', {
            method: 'GET',
            cache: 'no-store', // Always get fresh data
        }),

    logout: () =>
        api.API<any>('/api/auth/logout', {
            method: 'POST',
            cache: 'no-store', // Always get fresh data
        }),
}
