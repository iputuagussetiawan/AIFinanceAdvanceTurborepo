import { z } from 'zod'

export const experienceValidation = z
    .object({
        // --- Identifiers ---
        companyId: z.string().optional().nullable(), // Optional if not linked to a registered company

        // --- Role Details ---
        title: z.string().min(2, 'Job title is required'),
        profileHeadline: z.string().optional(),
        employmentType: z.string().min(1, 'Please select an employment type'), // e.g., Full-time, Part-time
        company: z.string().min(1, 'Company name is required'),

        // --- Status & Dates ---
        isCurrent: z.boolean().default(false),
        startDate: z.coerce.date(),
        endDate: z.coerce.date().optional().nullable(),

        // --- Location ---
        location: z.string().min(1, 'Location is required'),
        locationType: z.string().min(1, 'Please select a location type'), // e.g., Remote, On-site, Hybrid

        // --- Content ---
        description: z.string().optional(),
        whereFineThisJobs: z.string().optional(), // Preserving your field name from the image

        // --- Metadata ---
        orderPosition: z.number().int().nonnegative().default(0),
        createdAt: z.date().optional(),
        updatedAt: z.date().optional(),
    })
    .refine(
        (data) => {
            if (data.isCurrent) return true
            return data.endDate ? data.endDate > data.startDate : true
        },
        {
            message: 'End date must be after the start date',
            path: ['endDate'],
        },
    )

// Extract the Type
export type ExperienceDTO = z.infer<typeof experienceValidation>
