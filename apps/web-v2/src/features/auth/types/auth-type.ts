import { z } from 'zod'

export const signinSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
})
export type SigninInput = z.infer<typeof signinSchema>

export const signupSchema = z
    .object({
        firstName: z.string().min(1, 'First name is required'),
        lastName: z.string().min(1, 'Last name is required'),
        email: z.string().email('Invalid email address'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        confirmPassword: z.string(),
    })
    .refine((d) => d.password === d.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })
export type SignupInput = z.infer<typeof signupSchema>

export const verifyEmailSchema = z.object({
    code: z.string().min(1, 'Verification code is required'),
})
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>

export const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
})
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z
    .object({
        password: z.string().min(8, 'Password must be at least 8 characters'),
        confirmPassword: z.string(),
        verificationCode: z.string(),
    })
    .refine((d) => d.password === d.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
