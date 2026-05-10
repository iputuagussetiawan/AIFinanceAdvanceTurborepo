// types/company-type.ts

/**
 * Representasi satu entitas Company dari Database/API
 */
export interface ICompany {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null; // Bisa null atau string kosong jika belum diupload
  bgUrl: string | null;   // Background image URL
  baseCurrency: string;   // Contoh: "IDR", "USD"
  isActive: boolean;
  description: string;
  website: string;
  industry: string;
  createdAt: string;      // ISO Date string
  updatedAt: string;      // ISO Date string
}

/**
 * Response untuk request daftar perusahaan (List)
 */
export interface ICompaniesResponse {
  message: string;
  data: ICompany[];
}

/**
 * Response untuk request satu perusahaan saja (Detail/Single)
 */
export interface ICompanyResponse {
  message: string;
  data: ICompany;
}

/**
 * DTO untuk kebutuhan Create atau Update Company
 */
export type CompanyDTO = Omit<ICompany, 'id' | 'createdAt' | 'updatedAt'>;