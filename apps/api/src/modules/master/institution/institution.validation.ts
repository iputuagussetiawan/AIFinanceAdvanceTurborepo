import * as z from 'zod'

export const institutionValidation = z.object({
    name: z
        .string()
        .trim()
        .min(2, 'Institution name must be at least 2 characters')
        .max(255, 'Institution name is too long'),

    type: z.enum(['university', 'college', 'high_school', 'vocational_school', 'other'], {
        errorMap: () => ({ message: 'Please select a valid institution type' }),
    }),

    location: z.string().trim().optional().or(z.literal('')),

    website: z.string().trim().url('Invalid website URL').optional().or(z.literal('')),

    logoUrl: z.string().trim().optional().or(z.literal('')),

    orderPosition: z.coerce.number().int().nonnegative('Position cannot be negative').default(0),

    isActive: z.boolean().default(true),
})

// Validation untuk Update (Semua field menjadi opsional)
export const updateInstitutionValidation = institutionValidation.partial()

// Type Definitions
export type InstitutionDTO = z.infer<typeof institutionValidation>
export type UpdateInstitutionDTO = z.infer<typeof updateInstitutionValidation>
