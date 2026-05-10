import type { ApiResponse } from '@/types/api-response'
import { z } from 'zod'

export const InstitutionSchema = z.object({
    name: z.string().min(1, 'Nama universitas wajib diisi').max(255, 'Nama terlalu panjang'),
    type: z.enum(['university', 'college', 'high_school', 'vocational_school', 'other'], {
        message: 'Please select a valid institution type',
    }),
    location: z.string().min(1, 'Lokasi wajib diisi'),
    website: z.string().url('Format website tidak valid').or(z.literal('')),
    logoUrl: z
        .string()
        .url('Format URL logo tidak valid')
        .startsWith('https://', 'URL logo harus menggunakan https'),
    orderPosition: z.number().int().nonnegative('Posisi urutan tidak boleh negatif').default(1),
    isActive: z.boolean().default(true),
})

export type IInstitutionDTO = z.infer<typeof InstitutionSchema>
export type IInstitution = IInstitutionDTO & {
    id: string
    createdAt: string
    updatedAt: string
}

export type InstitutionResponse = ApiResponse<IInstitution[]>
