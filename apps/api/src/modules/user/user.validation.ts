import { z } from 'zod'

export const nameSchema = z.string().trim().min(1, { message: 'Name is required' }).max(100)

const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/

export const updateUserProfileSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(1, 'First name is required')
        .max(50, 'First name is too long')
        .optional(),
    lastName: z
        .string()
        .trim()
        .min(1, 'Last name is required')
        .max(50, 'Last name is too long')
        .optional(),
    jobTitle: z.string().trim().max(100, 'Job title is too long').optional().or(z.literal('')),
    phoneNumber: z
        .string()
        .trim()
        .max(20, 'Phone number is too long')
        .regex(phoneRegex, 'Invalid phone number format')
        .optional()
        .or(z.literal('')),
    address: z.string().trim().max(200, 'Address is too long').optional().or(z.literal('')),
    website: z.string().url('Invalid website URL').optional().or(z.literal('')),
    birthday: z
        .string()
        .refine((d) => !isNaN(Date.parse(d)), { message: 'Invalid date' })
        .nullable()
        .optional(),
    bio: z
        .string()
        .trim()
        .max(600, 'Bio must be less than 600 characters')
        .optional()
        .or(z.literal('')),
})

export const updateEmailSchema = z.object({
    email: z.string().email('Invalid email address').trim().toLowerCase(),
})

export const updatePasswordSchema = z
    .object({
        password: z.string().min(8, 'Password must be at least 8 characters').max(100),
        confirmPassword: z.string(),
    })
    .refine((d) => d.password === d.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })

export const updateUserSchema = updateUserProfileSchema
export type UpdateUserInputType = z.infer<typeof updateUserProfileSchema>
export type UpdateEmailInputType = z.infer<typeof updateEmailSchema>
export type UpdatePasswordInputType = z.infer<typeof updatePasswordSchema>
