import { z } from 'zod'
export const userSkillValidation = z.object({
    skill: z.string().optional(),
    skillName: z.string().min(1, "Skill name is required"),
    // Nilai progress bar (0 - 100)
    percentage: z.number()
        .min(0, "Percentage must be at least 0")
        .max(100, "Percentage cannot exceed 100")
        .default(0),
    // Opsi tambahan jika ingin menggunakan label level
    level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']).optional(),
    orderPosition: z.number().int().nonnegative().default(0),
})

// Jika Anda ingin memvalidasi kumpulan skill sekaligus (Array)
export const userSkillsArrayValidation = z.array(userSkillValidation)
export type IUserSkill = z.infer<typeof userSkillValidation>