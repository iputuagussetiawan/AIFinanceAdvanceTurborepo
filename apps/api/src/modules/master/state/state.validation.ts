import { z } from 'zod'

export const createStateSchema = z.object({
    name: z.string().min(1, 'State name is required').max(100),
    code: z.string().min(1, 'State code is required').max(10).toUpperCase(),
    country: z.string().min(1, 'Country ID is required'),
    isActive: z.boolean().optional().default(true),
})

export const updateStateSchema = createStateSchema.partial()

export type IStateInput = z.infer<typeof createStateSchema>
export type IStateUpdate = z.infer<typeof updateStateSchema>
export type IState = IStateInput & { _id?: string }
