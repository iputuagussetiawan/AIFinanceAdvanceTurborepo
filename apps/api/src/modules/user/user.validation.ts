import { z } from 'zod'

export const userObject = z.object({
    firstName: z.string().max(50, 'First name is too long').trim().optional().or(z.literal('')),
    lastName: z.string().max(50, 'Last name is too long').trim().optional().or(z.literal('')),
    email: z.string().email('Invalid email address').trim().toLowerCase(),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password is too long'),
    phoneNumber: z.string().max(20, 'Phone number is too long').trim().optional().or(z.literal('')),
    address: z.string().max(200, 'Address is too long').trim().optional().or(z.literal('')),
    website: z.string().url('Invalid website URL').optional().or(z.literal('')),
    birthday: z
        .string()
        .refine((d) => !isNaN(Date.parse(d)), { message: 'Invalid date' })
        .nullable()
        .optional(),
    bio: z.string().max(600, 'Bio must be less than 600 characters').trim().optional().or(z.literal('')),
})

export const updateUserSchema = userObject.partial()
export type UpdateUserInputType = z.infer<typeof updateUserSchema>
