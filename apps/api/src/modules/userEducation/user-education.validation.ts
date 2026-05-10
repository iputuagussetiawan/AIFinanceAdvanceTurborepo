import { Types } from 'mongoose'
import { z } from 'zod'

export const userEducationValidation = z
    .object({
        // Reference to Institution. Usually a string ID from the frontend.
        institution: z.string().optional(),
        institutionName: z.string().min(2, 'Institution name is required').trim(),

        // --- Core Details ---
        degree: z.string().min(2, 'Degree is required').trim(),
        fieldOfStudy: z.string().min(2, 'Field of study is required').trim(),

        // --- Timeframe ---
        // z.coerce.date() converts ISO strings from the frontend into JS Date objects
        startDate: z.coerce.date({
            required_error: 'Start date is required',
        }),
        endDate: z.coerce.date().nullable().optional(),
        isCurrent: z.boolean().default(false),

        // --- Academic Performance ---
        grade: z.string().optional(),

        // --- Additional Content ---
        description: z.string().max(1000, 'Description is too long').optional(),

        // --- UI/UX Handling ---
        orderPosition: z.number().int().nonnegative().default(0),
    })
    .refine(
        (data) => {
            // Logic: If not current and endDate exists, endDate must be after startDate
            if (!data.isCurrent && data.endDate) {
                return data.endDate >= data.startDate
            }
            return true
        },
        {
            message: 'End date must be after the start date',
            path: ['endDate'],
        },
    )

// Extract the TypeScript Interface from the Zod Schema
export type IUserEducation = z.infer<typeof userEducationValidation>
