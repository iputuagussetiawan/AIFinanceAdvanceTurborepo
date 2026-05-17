import { Types } from 'mongoose'
import { z } from 'zod'

// ─────────────────────────────────────────────
// Constants — single source of truth
// ─────────────────────────────────────────────

export const PROFICIENCY_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Native'] as const
export const JLPT_LEVELS = ['N1', 'N2', 'N3', 'N4', 'N5'] as const

// ─────────────────────────────────────────────
// Mongoose field helpers (derived from constants)
// ─────────────────────────────────────────────

export const proficiencyField = { type: String, enum: PROFICIENCY_LEVELS }
export const jlptField = { type: String, enum: JLPT_LEVELS }

// ─────────────────────────────────────────────
// Zod enums (derived from constants)
// ─────────────────────────────────────────────

const ProficiencyLevel = z.enum(PROFICIENCY_LEVELS).optional()
const JlptLevel = z.enum(JLPT_LEVELS).nullable().optional()

// ─────────────────────────────────────────────
// Validation
// ─────────────────────────────────────────────

export const userLanguageValidation = z.object({
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

export type IUserLanguage = z.infer<typeof userLanguageValidation>