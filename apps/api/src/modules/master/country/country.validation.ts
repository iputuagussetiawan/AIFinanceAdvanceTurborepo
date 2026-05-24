import { z } from 'zod'

export const createCountrySchema = z.object({
    name: z.string().min(1, 'Country name is required').max(100),
    code: z.string().min(2, 'Country code is required').max(3).toUpperCase(),
    dialCode: z.string().min(1, 'Dial code is required').max(10).optional(),
    flag: z.string().optional().default(''),
    isActive: z.boolean().optional().default(true),
})

export const updateCountrySchema = createCountrySchema.partial()

export type ICountryInput = z.infer<typeof createCountrySchema>
export type ICountryUpdate = z.infer<typeof updateCountrySchema>
export type ICountry = ICountryInput & { _id?: string }
