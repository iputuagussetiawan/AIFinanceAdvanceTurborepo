import { api } from '@/lib/api-factory'
import type { ICompaniesResponse } from '../types/company-type'

export const companyService = {
    findAll: (search: string = '') =>
        api.API<ICompaniesResponse>('/api/company/search', {
            method: 'GET',
            cache: 'no-store',
            params: { search },
        }),
}
