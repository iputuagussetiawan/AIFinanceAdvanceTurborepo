import type mongoose from 'mongoose'
import { Types } from 'mongoose'
import { z } from 'zod'

const ProficiencyLevel = z.enum(['Beginner', 'Intermediate', 'Advanced', 'Native'])
const JlptLevel = z.enum(['N1', 'N2', 'N3', 'N4', 'N5'])

export const userLanguageValidation = z.object({
    _id: z.string().optional(),
    language: z.union([z.string(), z.instanceof(Types.ObjectId)]),
    proficiency: z.object({
        speaking: ProficiencyLevel.optional(),
        listening: ProficiencyLevel.optional(),
        writing: ProficiencyLevel.optional(),
        jlptLevel: JlptLevel.nullable().optional(),
    }),
})

// Extract the Type for use in your services/controllers
export type IUserLanguage = z.infer<typeof userLanguageValidation>
