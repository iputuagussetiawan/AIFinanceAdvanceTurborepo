import { z } from 'zod'

export const signupValidation = z
    .object({
        firstName: z.string().min(1, 'First name is required').max(50),
        lastName: z.string().min(1, 'Last name is required').max(50),
        email: z.string().email({ message: 'Please enter a valid email address' }),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })

export const signinValidation = z.object({
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z.string().min(8, 'Password must be at least 2 characters'),
})

export const forgotPasswordValidation = z.object({
    email: z.string().email({ message: 'Please enter a valid email address' }),
})

export const resetPasswordValidation = z.object({
    password: z.string().min(8, 'Password must be at least 2 characters'),
})

export type SignupInputType = z.infer<typeof signupValidation>
export type SigninInputType = z.infer<typeof signinValidation>
export type ForgotPasswordInputType = z.infer<typeof forgotPasswordValidation>
export type ResetPasswordInputType = z.infer<typeof resetPasswordValidation>

export type IResetPasswordInputType = {
    password: string // The new password
    verificationCode: string // The code/token from the URL
}

export interface IUserProfile {
    _id: string
    firstName: string
    lastName: string
    email: string
    profilePicture: string | null
    isActive: boolean
    lastLogin: string | null
    createdAt: string
    updatedAt: string
}

export interface IUserResponse {
    message: string
    user: IUserProfile
}

export interface ILoginResponse {
    message: string
    user: IUserProfile
}

export interface IVerifyInputType {
    code: string
}
