import { z } from 'zod'

export const jobseekerPersonalInfoValidation = z.object({
    jobTitle: z.string().trim().max(100, 'Job title is too long').optional().or(z.literal('')),
    headline: z.string().trim().min(5, 'Headline should be a bit more descriptive').max(200),
    currentPosition: z.string().trim().min(2, 'Current position is required').max(100),
    industry: z.string().trim().min(2, 'Please select an industry'),
    country: z.string().trim().min(1, 'Please select a country'),
    state: z.string().trim().min(1, 'Please select a state'),
    city: z.string().trim().min(1, 'Please select a city'),
    openToWork: z.boolean().default(false).optional(),
})

export type PersonalInfoDTO = z.infer<typeof jobseekerPersonalInfoValidation>

export interface IJobseekerProfile {
    id: string
    userId: string
    jobTitle?: string
    headline: string
    currentPosition: string
    industry: string
    country: string
    state: string
    city: string
    openToWork: boolean
    createdAt: string
    updatedAt: string
}

export interface IJobseekerResponse {
    message: string
    profile: IJobseekerProfile
}
