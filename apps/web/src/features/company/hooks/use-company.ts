// hooks/use-company.ts
import { useQuery } from '@tanstack/react-query'

import { companyService } from '../services/company-service'
import type { ICompaniesResponse } from '../types/company-type'

export function useCompany(search: string = '') {
    const { data, isLoading, isError, error } = useQuery<ICompaniesResponse>({
        queryKey: ['companies', search],
        staleTime: 1000 * 60 * 5,
        queryFn: () => companyService.findAll(search),
    })

    return {
        companies: data?.data ?? [],
        isLoading,
        isError,
        error,
    }
}