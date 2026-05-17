import type { IApiResponse } from '@/types';
import { z } from 'zod';

const ProficiencyLevel = z.enum(['Beginner', 'Intermediate', 'Advanced']).optional()
export const userLanguageValidation = z.object({
    language: z.string().min(1, 'Language is required'),
    proficiency: z.object({
        speaking: ProficiencyLevel,
        listening: ProficiencyLevel,
        writing: ProficiencyLevel,
        jlptLevel: z.enum(['N5', 'N4', 'N3', 'N2', 'N1']).optional(),
    }),
});


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
});


export type IUserLanguage = z.infer<typeof userLanguageValidation>;
export type IBulkUserLanguages = z.infer<typeof userLanguagesArrayValidation>;


export interface ILanguageMaster {
    id: string;
    name: string;
    description: string;
    orderPosition: number;   // e.g. 1, 2, 3
    isActive: boolean;
}


export interface IUserLanguageResponse {
    id: string;
    language: ILanguageMaster;
    proficiency: {
        speaking?: 'Beginner' | 'Intermediate' | 'Advanced';
        listening?: 'Beginner' | 'Intermediate' | 'Advanced';
        writing?: 'Beginner' | 'Intermediate' | 'Advanced';
        jlptLevel?: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
    };
}

// Penggunaan spesifik untuk Language Response
export type IUserLanguagesApiResponse = IApiResponse<IUserLanguageResponse[]>;