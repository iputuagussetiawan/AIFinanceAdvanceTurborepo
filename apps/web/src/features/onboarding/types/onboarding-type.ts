import * as z from 'zod'

enum PhoneType {
    Home = 'Home',
    Work = 'Work',
    Mobile = 'Mobile',
}

export const jobseekerFormValidation = z.object({
    // --- Personal Info ---
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    additionalName: z.string().optional(), // Usually optional
    pronouns: z.string().optional(), // Usually optional
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
    // Using string because HTML date inputs return "YYYY-MM-DD"
    birthday: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Please enter a valid date',
    }),
    website: z
        .string()
        .url('Please enter a valid URL (e.g., https://...)')
        .optional()
        .or(z.literal('')),
    websiteType: z.string().optional(),

    // --- Onboarding Specifics ---
    education: z.string().min(2, 'Education details are required'),
    jobTitle: z.string().min(2, 'Job title is required'),
    position: z.string().min(2, 'Level/Position is required'),
    experience: z.string().min(1, 'Please select your years of experience'),
})

export type jobseekerInputType = z.infer<typeof jobseekerFormValidation>
