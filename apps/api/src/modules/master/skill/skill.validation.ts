import { z } from 'zod'

export const SKILL_CATEGORIES = [
    'Frontend',
    'Backend',
    'Mobile',
    'Database',
    'DevOps',
    'Data & AI',
    'UI/UX',
    'Security',
    'Tools',
] as const

export type SkillCategory = (typeof SKILL_CATEGORIES)[number]

export const createSkillSchema = z.object({
    name: z.string().min(1, 'Skill name is required').max(100),
    category: z.enum(SKILL_CATEGORIES, {
        errorMap: () => ({ message: 'Invalid skill category' }),
    }),
    icon: z.string().optional().default(''),
    isActive: z.boolean().optional().default(true),
})

export const updateSkillSchema = createSkillSchema.partial()

export type ISkillInput = z.infer<typeof createSkillSchema>
export type ISkillUpdate = z.infer<typeof updateSkillSchema>
export type ISkill = ISkillInput & { _id?: string }
