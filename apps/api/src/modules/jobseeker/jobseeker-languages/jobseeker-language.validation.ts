import { Types } from 'mongoose'
import { z } from 'zod'

export const PROFICIENCY_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Native'] as const
export const JLPT_LEVELS = ['N1', 'N2', 'N3', 'N4', 'N5'] as const

export const proficiencyField = { type: String, enum: PROFICIENCY_LEVELS }
export const jlptField = { type: String, enum: JLPT_LEVELS }

const ProficiencyLevel = z.enum(PROFICIENCY_LEVELS).optional()
const JlptLevel = z.enum(JLPT_LEVELS).nullable().optional()

export const jobseekerLanguageValidation = z.object({
    _id: z.string().optional(),
    language: z.union([z.string(), z.instanceof(Types.ObjectId)]),
    isCurrentLanguage: z.boolean().default(false),
    proficiency: z.object({
        speaking: ProficiencyLevel,
        listening: ProficiencyLevel,
        writing: ProficiencyLevel,
        jlptLevel: JlptLevel,
    }),
})

export type IJobseekerLanguage = z.infer<typeof jobseekerLanguageValidation>
