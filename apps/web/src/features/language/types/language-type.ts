import { z } from 'zod'

export const LanguageSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    orderPosition: z.number().int().nonnegative(),
    isActive: z.boolean(),
})

export type ILanguageDTO = z.infer<typeof LanguageSchema>

export interface IPaginationMeta {
    totalData: number
    totalPage: number
    currentPage: number
    limit: number
}

export interface ILanguage {
    id: string
    name: string
    description: string
    orderPosition: number
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export interface IApiResponse<T> {
    success: boolean
    message: string
    data: T
    meta?: IPaginationMeta // Opsional karena tidak semua API memiliki pagination
}

// Tipe spesifik untuk Response Language
export type ILanguageResponse = IApiResponse<ILanguage[]>
