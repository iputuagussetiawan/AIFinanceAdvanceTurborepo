import { z } from 'zod'

export const signupValidation = z
    .object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        email: z.string().email({ message: 'Please enter a valid email address' }),
        password: z.string().min(8, 'Password must be at least 2 characters'),
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
    _id: string // 🗝️ Backend uses MongoDB style _id
    name: string
    email: string
    profilePicture: string // Cloudinary URL
    isActive: boolean
    lastLogin: string | null
    onboardingComplete: boolean
    createdAt: string // ISO Date String
    updatedAt: string // ISO Date String
}

export interface IUserResponse {
    message: string
    user: IUserProfile
    access_token: string
}

// 🗝️ Also define the full API Response structure
export interface ILoginResponse {
    message: string
    user: IUserProfile
    access_token: string
}

export interface IVerifyInputType {
    code: string
}
