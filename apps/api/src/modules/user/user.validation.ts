import type mongoose from 'mongoose'
import { z } from 'zod'

// --- Reusable Base Schemas ---
export const nameSchema = z.string().trim().min(1, { message: 'Name is required' }).max(100)

export const userObject = z.object({
    name: nameSchema,
    firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long').trim(),
    lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long').trim(),

    // --- Professional Details ---
    jobTitle: z.string().max(100, 'Job title is too long').trim().optional().or(z.literal('')),
    phoneNumber: z.string().max(20, 'Phone number is too long').trim().optional().or(z.literal('')),

    address: z.string().max(200, 'Address is too long').trim().optional().or(z.literal('')),
    website: z
        .string()
        // We use .url() but allow empty strings for optional fields
        .url('Invalid website URL')
        .optional()
        .or(z.literal('')),
    bio: z
        .string()
        .max(600, 'Bio must be less than 600 characters')
        .trim()
        .optional()
        .or(z.literal('')), // Allows empty string in addition to undefined
    email: z.string().email('Invalid email address').trim().toLowerCase(),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password is too long'),
})

export const updateUserSchema = userObject.partial()
export type UpdateUserInputType = z.infer<typeof updateUserSchema>
