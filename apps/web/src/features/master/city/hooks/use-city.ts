import { useQuery } from '@tanstack/react-query'

import { cityService } from '../services/city-service'
import type { ICitiesResponse } from '../types/city-type'

export function useCitySearch(search: string = '', stateId?: string, countryId?: string) {
    const { data, isLoading, isError, error } = useQuery<ICitiesResponse>({
        queryKey: ['cities', search, stateId, countryId],
        staleTime: 1000 * 60 * 5,
        queryFn: () => cityService.search(search, stateId, countryId),
        enabled: !!stateId,
    })

    return {
        cities: data?.data ?? [],
        isLoading,
        isError,
        error,
    }
}
