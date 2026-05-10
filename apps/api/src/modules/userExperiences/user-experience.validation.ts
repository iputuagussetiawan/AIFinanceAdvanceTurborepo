import { z } from 'zod'

export const userExperienceValidation = z
    .object({
        // --- Company Details ---
        company: z.string().optional(), // Reference ID ke database Company (jika ada)
        companyName: z.string().min(2, 'Company name is required').trim(),
        location: z.string().optional(),

        // --- Role Details ---
        title: z.string().min(2, 'Job title is required').trim(), // Contoh: Fullstack Developer
        employmentType: z
            .enum([
                'Full-time',
                'Part-time',
                'Self-employed',
                'Freelance',
                'Contract',
                'Internship',
                'Apprenticeship',
            ])
            .default('Full-time'),

        // --- Timeframe ---
        startDate: z.preprocess(
            (arg) => {
                if (typeof arg == 'string' || arg instanceof Date) return new Date(arg)
            },
            z.date({ required_error: 'Start date is required' }),
        ),

        endDate: z.preprocess((arg) => {
            if (!arg) return null
            if (typeof arg == 'string' || arg instanceof Date) return new Date(arg)
        }, z.date().nullable().optional()),
        isCurrent: z.boolean().default(false),

        // --- Content ---
        description: z
            .string()
            .max(2000, 'Description is too long')
            .optional()
            .transform((val) => (val === '' ? undefined : val)),

        // --- Skills (Optional) ---
        // Memungkinkan user tagging skill spesifik di pengalaman ini
        skills: z.array(z.string()).optional().default([]),

        // --- UI/UX Handling ---
        orderPosition: z.number().int().nonnegative().default(0),
    })
    .refine(
        (data) => {
            // Beritahu TS bahwa data memiliki properti startDate dan endDate sebagai Date
            const { startDate, endDate, isCurrent } = data as {
                startDate: Date
                endDate?: Date | null
                isCurrent: boolean
            }

            if (!isCurrent && endDate) {
                return endDate >= startDate
            }
            return true
        },
        {
            message: 'End date must be after the start date',
            path: ['endDate'],
        },
    )

// Extract the TypeScript Interface
export type IUserExperience = z.infer<typeof userExperienceValidation>

// Untuk update massal (Reordering)
export const updateExperienceListValidation = z.object({
    experiences: z.array(userExperienceValidation),
})
