import { z } from 'zod'

// --- Reusable Base Schemas ---
export const nameSchema = z.string().trim().min(1, { message: 'Name is required' }).max(255)

// Slug: matches the lowercase, trimmed requirement of your Mongoose schema
export const slugSchema = z.string().trim().toLowerCase().min(1, { message: 'Slug is required' })

// Currency: usually 3 characters (e.g., USD, IDR)
export const baseCurrencySchema = z
    .string()
    .trim()
    .toUpperCase()
    .length(3, { message: 'Currency must be a 3-letter code' })
    .default('USD')

// Fiscal Month: Number between 1 and 12
export const fiscalYearStartMonthSchema = z.number().min(1).max(12).default(1)

// MongoDB ObjectId validation
export const ownerIdSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid Owner ID format' })

export const isActiveSchema = z.boolean().default(true)

export const createCompanySchema = z.object({
    name: nameSchema,
    slug: slugSchema,
    logoUrl: z.string().optional(),
    bgUrl: z.string().optional(),
    baseCurrency: baseCurrencySchema,
    fiscalYearStartMonth: fiscalYearStartMonthSchema,
    isActive: isActiveSchema.optional(),
})

// For updates, we use .partial() so you don't have to send every field
export const updateCompanySchema = createCompanySchema.partial()

// Reusable ID schema for URL parameters
export const companyIdSchema = z
    .string()
    .trim()
    .min(1, { message: 'Company ID is required' })
    .regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid Company ID format' })

// Extract the type from the schema
export type CreateCompanyInputType = z.infer<typeof createCompanySchema>
export type UpdateCompanyInputType = z.infer<typeof updateCompanySchema>

export const changeRoleSchema = z.object({
    roleId: z.string().trim().min(1),
    memberId: z.string().trim().min(1),
})
