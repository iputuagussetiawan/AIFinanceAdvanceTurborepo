import { z } from 'zod'

export const jobseekerExperienceValidation = z
    .object({
        company: z.string().optional(),
        companyName: z.string().min(2, 'Company name is required').trim(),
        location: z.string().optional(),
        title: z.string().min(2, 'Job title is required').trim(),
        employmentType: z
            .enum([
                'Full-time',
                'Part-time',
                'Self-employed',
                'Freelance',
                'Contract',
                'Internship',
                'Apprenticeship',
            ])
            .default('Full-time'),
        startDate: z.preprocess(
            (arg) => {
                if (typeof arg === 'string' || arg instanceof Date) return new Date(arg)
            },
            z.date({ required_error: 'Start date is required' }),
        ),
        endDate: z.preprocess((arg) => {
            if (!arg) return null
            if (typeof arg === 'string' || arg instanceof Date) return new Date(arg)
        }, z.date().nullable().optional()),
        isCurrent: z.boolean().default(false),
        description: z
            .string()
            .max(2000, 'Description is too long')
            .optional()
            .transform((val) => (val === '' ? undefined : val)),
        skills: z.array(z.string()).optional().default([]),
        orderPosition: z.number().int().nonnegative().default(0),
    })
    .refine(
        (data) => {
            const { startDate, endDate, isCurrent } = data as {
                startDate: Date
                endDate?: Date | null
                isCurrent: boolean
            }
            if (!isCurrent && endDate) return endDate >= startDate
            return true
        },
        { message: 'End date must be after the start date', path: ['endDate'] },
    )

export type IJobseekerExperience = z.infer<typeof jobseekerExperienceValidation>

export const updateExperienceListValidation = z.object({
    experiences: z.array(jobseekerExperienceValidation),
})
