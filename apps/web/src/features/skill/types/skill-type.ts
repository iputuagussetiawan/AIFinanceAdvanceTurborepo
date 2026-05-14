// types/skill-type.ts

/**
 * Kategori Skill yang tersedia berdasarkan data API
 */
export type SkillCategory = 
  | 'Frontend' 
  | 'Backend' 
  | 'Mobile' 
  | 'DevOps' 
  | 'Database' 
  | 'UI/UX' 
  | 'Security' 
  | 'Other';

/**
 * Representasi satu data Skill
 */
export interface ISkill {
  id: string;
  name: string;
  category: SkillCategory | string; // Fallback ke string jika ada kategori baru dari API
  icon: string; // URL ikon dari simpleicons atau source lain
  isActive: boolean;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
}

/**
 * Response untuk request daftar skill (List)
 */
export interface ISkillsResponse {
  message: string;
  data: ISkill[];
}

/**
 * DTO (Data Transfer Object) untuk input atau update skill
 */
export type SkillDTO = Omit<ISkill, 'id' | 'createdAt' | 'updatedAt'>;