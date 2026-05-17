import type { IApiResponse } from '@/types';
import { z } from 'zod';

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

export const PROFICIENCY_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Native'] as const
export const JLPT_LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'] as const

// ─────────────────────────────────────────────
// Zod enums derived from constants
// ─────────────────────────────────────────────

const ProficiencyLevel = z.enum(PROFICIENCY_LEVELS).optional()
const JlptLevel = z.enum(JLPT_LEVELS).optional()

// ─────────────────────────────────────────────
// Validation
// ─────────────────────────────────────────────

export const userLanguageValidation = z.object({
    language: z.string().min(1, 'Language is required'),
    name: z.string().optional(),
    isCurrentLanguage: z.boolean().default(false),
    proficiency: z.object({
        speaking: ProficiencyLevel,
        listening: ProficiencyLevel,
        writing: ProficiencyLevel,
        jlptLevel: JlptLevel,
    }),
})

export const userLanguagesArrayValidation = z.object({
    languages: z
        .array(userLanguageValidation)
        .min(1, 'Please provide at least one language')
        .refine(
            (languages) => {
                const ids = languages.map((l) => l.language)
                return new Set(ids).size === ids.length
            },
            { message: 'Duplicate languages are not allowed' },
        ),
})

// ─────────────────────────────────────────────
// Inferred types
// ─────────────────────────────────────────────

export type IUserLanguage = z.infer<typeof userLanguageValidation>
export type IBulkUserLanguages = z.infer<typeof userLanguagesArrayValidation>

// ─────────────────────────────────────────────
// Derived types from constants
// ─────────────────────────────────────────────

export type TProficiencyLevel = typeof PROFICIENCY_LEVELS[number]
export type TJlptLevel = typeof JLPT_LEVELS[number]

// ─────────────────────────────────────────────
// Interfaces
// ─────────────────────────────────────────────

export interface ILanguageMaster {
    id: string;
    name: string;
    description: string;
    orderPosition: number;
    isActive: boolean;
}

export interface IUserLanguageResponse {
    id: string;
    language: ILanguageMaster;
    isCurrentLanguage: boolean;
    proficiency: {
        speaking?: TProficiencyLevel;
        listening?: TProficiencyLevel;
        writing?: TProficiencyLevel;
        jlptLevel?: TJlptLevel;
    };
}

export type IUserLanguagesApiResponse = IApiResponse<IUserLanguageResponse[]>;