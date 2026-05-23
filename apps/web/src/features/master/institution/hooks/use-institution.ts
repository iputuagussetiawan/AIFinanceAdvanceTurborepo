// hooks/use-institution.ts
import { useQuery } from '@tanstack/react-query'

import { institutionService } from '../services/institution-service'
import type { InstitutionResponse } from '../types/institution-type'

export function useInstitution() {
    const { data, isLoading, isError, error } = useQuery<InstitutionResponse>({
        queryKey: ['all-institution'],
        staleTime: 1000 * 60 * 5,
        queryFn: () => institutionService.getAll(),
    })

    return {
        institutions: data?.data ?? [],
        isLoading,
        isError,
        error,
    }
}
