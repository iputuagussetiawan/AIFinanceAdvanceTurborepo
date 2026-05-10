import * as z from 'zod'

export const languageValidation = z.object({
    name: z.string().trim().min(2, 'Language name is required and must be at least 2 characters'),
    description: z.string().optional().or(z.literal('')),
    orderPosition: z.coerce.number().int().nonnegative().default(0),
    isActive: z.boolean().default(true),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
})
export const updateLanguageValidation = languageValidation.partial()

export type LanguageDTO = z.infer<typeof languageValidation>
export type UpdateLanguageDTO = z.infer<typeof updateLanguageValidation>
