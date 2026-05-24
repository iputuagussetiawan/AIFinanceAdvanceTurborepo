import { z } from 'zod'

export const jobseekerPersonalInfoValidation = z.object({
    jobTitle: z.string().trim().max(100, 'Job title is too long').optional().or(z.literal('')),
    headline: z.string().trim().min(5, 'Headline should be a bit more descriptive').max(200),
    currentPosition: z.string().trim().min(2, 'Current position is required').max(100),
    industry: z.string().trim().min(2, 'Please select an industry'),
    country: z.string().trim().min(1, 'Please select a country'),
    state: z.string().trim().min(1, 'State is required'),
    city: z.string().trim().min(1, 'City is required'),
    openToWork: z.boolean().default(false).optional(),
})

export type JobseekerPersonalInfoDTO = z.infer<typeof jobseekerPersonalInfoValidation>
