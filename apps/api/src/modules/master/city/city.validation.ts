import { z } from 'zod'

export const createCitySchema = z.object({
    name: z.string().min(1, 'City name is required').max(100),
    state: z.string().min(1, 'State ID is required'),
    country: z.string().min(1, 'Country ID is required'),
    isActive: z.boolean().optional().default(true),
})

export const updateCitySchema = createCitySchema.partial()

export type ICityInput = z.infer<typeof createCitySchema>
export type ICityUpdate = z.infer<typeof updateCitySchema>
export type ICity = ICityInput & { _id?: string }
