import { z } from 'zod'

export const jobseekerPersonalInfoValidation = z.object({
    // --- Name & Identity ---
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
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
    address: z.string().min(5, 'Please enter a full address'),

    // --- Dates & URLs ---
    birthday: z
        .string()
        .min(1, 'Birthday is required')
        .refine((date) => !isNaN(Date.parse(date)), {
            message: 'Please enter a valid date',
        }),
    website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
})

// Extract the Type
export type JobseekerPersonalInfoDTO = z.infer<typeof jobseekerPersonalInfoValidation>
