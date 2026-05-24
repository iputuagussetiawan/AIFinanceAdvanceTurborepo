import type { IApiResponse } from '@/types'
import { z } from 'zod'

export const LanguageSchema = z.object({
    name: z.string().trim().min(2, 'Language name must be at least 2 characters'),
    description: z.string().trim().optional().or(z.literal('')),
    imageUrl: z.string().trim().url('Must be a valid URL').optional().or(z.literal('')),
    priority: z.coerce.number().int().nonnegative('Priority cannot be negative').default(0),
    orderPosition: z.coerce.number().int().nonnegative('Order position cannot be negative').default(0),
    isActive: z.boolean().default(true),
})

export type ILanguageDTO = z.infer<typeof LanguageSchema>

export interface ILanguage {
    id: string
    name: string
    description?: string
    imageUrl?: string
    priority: number
    orderPosition: number
    isActive: boolean
    createdAt: string
    updatedAt: string
}

// Tipe spesifik untuk Response Language
export type ILanguageResponse = IApiResponse<ILanguage[]>
