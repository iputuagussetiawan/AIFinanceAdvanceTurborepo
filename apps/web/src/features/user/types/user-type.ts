import { z } from 'zod'

import type { IRole } from '@/features/role/types/role-type'

// Max file size: 2MB
const MAX_FILE_SIZE = 2 * 1024 * 1024
// Allowed file types
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export const userProfileValidation = z.object({
    firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long').trim(),
    lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long').trim(),

    // --- Professional Details ---
    jobTitle: z.string().max(100, 'Job title is too long').trim().optional().or(z.literal('')),
    phoneNumber: z.string().max(20, 'Phone number is too long').trim().optional().or(z.literal('')),
    bio: z
        .string()
        .max(600, 'Bio is too long max 600 characters')
        .trim()
        .optional()
        .or(z.literal('')),
    address: z.string().max(200, 'Address is too long').trim().optional().or(z.literal('')),
    website: z
        .string()
        // We use .url() but allow empty strings for optional fields
        .url('Invalid website URL')
        .optional()
        .or(z.literal('')),
    email: z.string().email('Invalid email address').trim().toLowerCase(),
})

export const updateUserProfileValidation = userProfileValidation.partial()
export type UpdateUserProfileDTO = z.infer<typeof updateUserProfileValidation>

export interface IUser {
    _id: string
    name: string
    email: string
    profilePicture: string | null
    isEmailVerified: boolean
    isActive: boolean
    lastLogin: string | null
    onboardingComplete: boolean
    createdAt: string
    updatedAt: string
    __v: number
}

export interface IUserResponse {
    message: string
    user: IUser
    role: IRole
    joinedAt: string
}

export const personalInfoValidation = z.object({
    // --- Name & Identity ---
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    additionalName: z.string().optional().or(z.literal('')),
    pronouns: z.string().optional().or(z.literal('')),
    headline: z.string().min(5, 'Headline should be a bit more descriptive'),

    // --- Professional ---
    currentPosition: z.string().min(2, 'Current position is required'),
    industry: z.string().min(2, 'Please select an industry'),

    // --- Location & Contact ---
    country: z.string().min(1, 'Please select a country'),
    city: z.string().min(1, 'City is required'),
    phoneNumber: z
        .string()
        .min(7, 'Phone number is too short')
        .regex(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, 'Invalid phone number format'),
    phoneType: z.string().min(1, 'Please select a phone type'),
    address: z.string().min(5, 'Please enter a full address'),

    // --- Dates & URLs ---
    birthday: z
        .string()
        .min(1, 'Birthday is required')
        .refine((date) => !isNaN(Date.parse(date)), {
            message: 'Please enter a valid date',
        }),
    website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    websiteType: z.string().optional().or(z.literal('')),
})

export const profileValidation = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long'),

    // 📧 Email Validation
    email: z
        .string()
        .email('Invalid email address')
        .toLowerCase()
        .trim()
        .optional()
        .or(z.literal('')), // Allows empty string

    // 🔑 Password Validation
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password is too long')
        .optional()
        .or(z.literal('')),

    // 🖼️ Profile Picture Validation
    profilePicture: z
        .custom<File | undefined>()
        .refine((file) => !file || file.size <= MAX_FILE_SIZE, `Max image size is 2MB.`)
        .refine(
            (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
            'Only .jpg, .jpeg, .png and .webp formats are supported.',
        )
        .optional()
        .nullable(),
})

export const updateProfileValidation = profileValidation.partial()

// Extract the Type
export type PersonalInfoInput = z.infer<typeof personalInfoValidation>
export type profileDTO = z.infer<typeof profileValidation>
export type UpdateProfileDTO = z.infer<typeof updateProfileValidation>
