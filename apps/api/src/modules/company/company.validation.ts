import type mongoose from 'mongoose'
import { z } from 'zod'

import { CompanySize } from './company.model'

const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/

export const createCompanySchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, 'Company name must be at least 3 characters')
        .max(100, 'Company name is too long'),
    slug: z
        .string()
        .trim()
        .min(3, 'Slug must be at least 3 characters')
        .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
    logoUrl: z.string().url('Invalid logo URL').optional().or(z.literal('')),
    bgUrl: z.string().url('Invalid background URL').optional().or(z.literal('')),
    baseCurrency: z
        .string()
        .length(3, 'Currency must be a 3-letter ISO code (e.g., IDR, USD)')
        .toUpperCase(),
    industry: z.string().trim().min(1, 'Industry is required').optional(),
    description: z.string().max(2000, 'Description is too long').optional(),
    website: z.string().url('Invalid website URL').optional().or(z.literal('')),
    size: z.nativeEnum(CompanySize).optional(),
    country: z.string().trim().max(100).optional().or(z.literal('')),
    city: z.string().trim().max(100).optional().or(z.literal('')),
    phone: z
        .string()
        .trim()
        .regex(phoneRegex, 'Invalid phone number format')
        .optional()
        .or(z.literal('')),
    isActive: z.boolean().default(true).optional(),
})

export const updateCompanySchema = createCompanySchema.partial()

export type ICompanyInput = z.infer<typeof createCompanySchema>
export type ICompanyUpdate = z.infer<typeof updateCompanySchema>

export interface ICompany extends ICompanyInput {
    _id: mongoose.Types.ObjectId | string
    createdAt?: Date
    updatedAt?: Date
}
