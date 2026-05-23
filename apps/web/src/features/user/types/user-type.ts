import { z } from 'zod'

import type { IRole } from '@/features/role/types/role-type'


export const userProfileValidation = z.object({
    firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long').trim(),
    lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long').trim(),
    phoneNumber: z.string().min(1, 'Phone number is required').max(20, 'Phone number is too long').trim(),
    bio: z.string().max(600, 'Bio is too long max 600 characters').trim().optional().or(z.literal('')),
    address: z.string().max(200, 'Address is too long').trim().optional().or(z.literal('')),
    website: z.string().url('Invalid website URL').optional().or(z.literal('')),
    birthday: z
        .string()
        .refine((d) => !d || !isNaN(Date.parse(d)), { message: 'Invalid date' })
        .nullable()
        .optional(),
    email: z.string().email('Invalid email address').trim().toLowerCase(),
})

export const updateUserProfileValidation = userProfileValidation.partial()
export type UpdateUserProfileDTO = z.infer<typeof updateUserProfileValidation>

export const profileSettingSchema = userProfileValidation.omit({ email: true })
export type ProfileSettingDTO = z.infer<typeof profileSettingSchema>

// Matches user.model.ts fields returned after toJSON (removes _id/__v, adds virtual id/fullName)
export interface IUser {
    id: string
    firstName?: string
    lastName?: string
    email: string
    phoneNumber?: string
    address?: string
    website?: string
    birthday?: string | null
    bio?: string
    profilePicture: string | null
    currentCompany?: string | null
    fullName?: string
    isEmailVerified: boolean
    isActive: boolean
    lastLogin: string | null
    onboardingComplete: boolean
    createdAt: string
    updatedAt: string
}

export interface IUserResponse {
    message: string
    user: IUser
    role?: IRole
    joinedAt?: string
}

