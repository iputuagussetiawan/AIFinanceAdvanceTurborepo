import { Types } from 'mongoose'
import { z } from 'zod'

export const jobseekerSkillValidation = z.object({
    skill: z
        .string({ required_error: 'Skill ID is required' })
        .refine((val) => Types.ObjectId.isValid(val), { message: 'Invalid Skill ID format' }),
    percentage: z.number().min(0).max(100).default(0),
    level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']).optional(),
    orderPosition: z.number().int().nonnegative().default(0),
})

export const jobseekerSkillsArrayValidation = z.array(jobseekerSkillValidation)
export type IJobseekerSkill = z.infer<typeof jobseekerSkillValidation>
