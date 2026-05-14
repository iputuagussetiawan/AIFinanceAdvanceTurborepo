import * as z from 'zod';

export const experienceValidation = z
  .object({
    company: z.string().optional().or(z.literal('')),
    companyName: z.string().min(2, 'Company name is required'),
    title: z.string().min(2, 'Job title is required'),
    employmentType: z.string().min(2, 'employmentType is required'),
    location: z.string().min(2, 'Location is required'),
    startDate: z.string(),
    endDate: z.string().optional(),
    isCurrent: z.boolean().default(false),
    description: z.string().max(2000, 'Description is too long').optional().or(z.literal('')),
    skills: z.array(z.string()).default([]),
    orderPosition: z.number().int().nonnegative(),
  })
  .refine(
    (data) => {
      // Jika masih bekerja di sini, endDate sebaiknya null atau kosong
      if (data.isCurrent) return data.endDate === null || data.endDate === undefined || data.endDate === '';
      // Jika sudah tidak bekerja, endDate wajib ada
      return data.endDate !== null && data.endDate !== undefined && data.endDate !== '';
    },
    {
      message: 'End date is required if this is not your current role',
      path: ['endDate'],
    }
  )
  .refine(
    (data) => {
      if (!data.endDate || !data.startDate) return true;
      return new Date(data.endDate) > new Date(data.startDate);
    },
    {
      message: 'End date must be after start date',
      path: ['endDate'],
    }
  );
export const updateExperienceListValidation = z.object({
    experiences: z.array(experienceValidation),
})

export type ExperienceDTO = z.infer<typeof experienceValidation>


export interface IExperience {
    id: string;
    company: any;
    companyName: string;
    location: string;
    title: string;
    employmentType: string; // Menggunakan string fallback jika enum bertambah
    startDate: string; // ISO Date string
    endDate: string | null;
    isCurrent: boolean;
    description: string;
    skills: string[];
    orderPosition: number;
    createdAt: string; // ISO Date string
    updatedAt: string; // ISO Date string
}