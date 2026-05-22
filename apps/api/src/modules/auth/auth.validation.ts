import { z } from 'zod'

export const emailSchema = z.string().trim().email('Invalid email address').min(1).max(255)

export const passwordSchema = z.string().trim().min(8).max(72)

export const registerSchema = z.object({
    name: z.string().trim().min(1).max(255),
    email: emailSchema,
    password: passwordSchema,
})

export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
})

export const verificationCodeSchema = z.string().trim().min(1).max(25)
export const verificationEmailSchema = z.object({
    code: verificationCodeSchema,
})

export const resetPasswordSchema = z.object({
    password: passwordSchema,
    verificationCode: verificationCodeSchema,
})

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>
