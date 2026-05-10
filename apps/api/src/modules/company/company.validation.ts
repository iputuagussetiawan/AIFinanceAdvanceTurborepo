import type mongoose from 'mongoose'
import { z } from 'zod'

// 1. Reusable Sub-Schemas
const nameSchema = z
    .string()
    .min(3, 'Company name must be at least 3 characters')
    .max(100, 'Company name is too long')
    .trim()

const slugSchema = z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
    .trim()

const baseCurrencySchema = z
    .string()
    .length(3, 'Currency must be a 3-letter ISO code (e.g., IDR, USD)')
    .toUpperCase()

const isActiveSchema = z.boolean().default(true)

// 2. Main Company Schema
export const createCompanySchema = z.object({
    name: nameSchema,
    slug: slugSchema,

    // URL validation untuk media
    logoUrl: z.string().url('Invalid logo URL format').optional().or(z.literal('')),
    bgUrl: z.string().url('Invalid background URL format').optional().or(z.literal('')),

    baseCurrency: baseCurrencySchema,
    isActive: isActiveSchema.optional(),

    // Tambahan umum untuk profil perusahaan rekrutmen
    description: z.string().max(2000, 'Description is too long').optional(),
    website: z.string().url('Invalid website URL').optional().or(z.literal('')),
    industry: z.string().min(1, 'Industry is required').optional(),
})
export const updateCompanySchema = createCompanySchema.partial()

// 3. Types
export type ICompanyInput = z.infer<typeof createCompanySchema>
export type ICompanyUpdate = z.infer<typeof updateCompanySchema>

export interface ICompany extends ICompanyInput {
    _id: mongoose.Types.ObjectId | string
    createdAt?: Date
    updatedAt?: Date
}
