import { z } from 'zod'

export const jobseekerPersonalInfoValidation = z.object({
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

// Extract the Type
export type PersonalInfoDTO = z.infer<typeof jobseekerPersonalInfoValidation>

export interface IJobseekerProfile {
    _id: string
    id: string // Virtual id field from Mongoose
    userId: string
    __v: number
    firstName: string
    lastName: string
    fullName: string // Virtual field
    additionalName?: string
    pronouns?: string
    headline: string
    currentPosition: string
    industry: string
    country: string
    city: string
    address: string
    phoneNumber: string
    phoneType: string
    birthday: string // Received as ISO string from API
    website?: string
    websiteType?: string
    onboardingComplete: boolean
    createdAt: string
    updatedAt: string
}

export interface IJobseekerResponse {
    message: string
    profile: IJobseekerProfile
}
