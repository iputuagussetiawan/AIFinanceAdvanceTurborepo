import { z } from 'zod';
export const userSkillValidation = z.object({
  // Validasi ID Master Skill menggunakan Regex agar ringan di Client Side
  skill: z.string().optional().or(z.literal('')),
  percentage: z.coerce
    .number()
    .min(0, 'Percentage must be at least 0')
    .max(100, 'Percentage cannot exceed 100')
    .default(0),
  level: z
    .enum(['Beginner', 'Intermediate', 'Advanced', 'Expert'], {
      error: 'Level must be Beginner, Intermediate, Advanced, or Expert'
    })
    .default('Beginner'),

  orderPosition: z.coerce
    .number()
    .int()
    .nonnegative()
    .default(0),
});

/**
 * Skema validasi untuk Bulk Update (Array of Skills)
 */
export const userSkillsArrayValidation = z.object({
  skills: z
    .array(userSkillValidation)
    .min(1, "Please provide at least one skill")
});

// Type Inference
export type IUserSkill = z.infer<typeof userSkillValidation>;
export type IBulkUserSkills = z.infer<typeof userSkillsArrayValidation>;


/**
 * Tipe dasar untuk Master Skill (dari koleksi Skill)
 */
export interface ISkillMaster {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Mobile' | 'Database' | 'DevOps' | 'Data & AI' | 'UI/UX' | 'Security' | 'Tools';
  icon: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Tipe untuk item skill yang ada di dalam profil User (setelah di-populate)
 */
export interface IUserSkillResponse {
  id: string;
  skill: ISkillMaster; // Data master skill yang sudah ter-populate
  percentage: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  orderPosition: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Tipe pembungkus standar API Response
 */
export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Penggunaan spesifik untuk Skill Response
export type IUserSkillsApiResponse = IApiResponse<IUserSkillResponse[]>;