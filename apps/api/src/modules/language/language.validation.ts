import * as z from 'zod'

export const languageValidation = z.object({
    name: z.string().trim().min(2, 'Language name must be at least 2 characters'),
    description: z.string().trim().optional().or(z.literal('')),
    imageUrl: z.string().trim().url('Must be a valid URL').optional().or(z.literal('')),
    priority: z.coerce.number().int().nonnegative('Priority cannot be negative').default(0),
    orderPosition: z.coerce.number().int().nonnegative('Order position cannot be negative').default(0),
    isActive: z.boolean().default(true),
})

export const updateLanguageValidation = languageValidation.partial()

export type LanguageDTO = z.infer<typeof languageValidation>
export type UpdateLanguageDTO = z.infer<typeof updateLanguageValidation>