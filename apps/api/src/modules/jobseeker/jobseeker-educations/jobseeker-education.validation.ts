import { z } from 'zod'

export const jobseekerEducationValidation = z
    .object({
        institution: z.string().optional(),
        institutionName: z.string().min(2, 'Institution name is required').trim(),
        degree: z.string().min(2, 'Degree is required').trim(),
        fieldOfStudy: z.string().min(2, 'Field of study is required').trim(),
        startDate: z.coerce.date({ required_error: 'Start date is required' }),
        endDate: z.coerce.date().nullable().optional(),
        isCurrent: z.boolean().default(false),
        grade: z.string().optional(),
        description: z.string().max(1000, 'Description is too long').optional(),
        orderPosition: z.number().int().nonnegative().default(0),
    })
    .refine(
        (data) => {
            if (!data.isCurrent && data.endDate) {
                return data.endDate >= data.startDate
            }
            return true
        },
        { message: 'End date must be after the start date', path: ['endDate'] },
    )

export type IJobseekerEducation = z.infer<typeof jobseekerEducationValidation>
