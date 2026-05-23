import { useQuery } from '@tanstack/react-query'

import { stateService } from '../services/state-service'
import type { IStatesResponse } from '../types/state-type'

export function useStateSearch(search: string = '', countryId?: string) {
    const { data, isLoading, isError, error } = useQuery<IStatesResponse>({
        queryKey: ['states', search, countryId],
        staleTime: 1000 * 60 * 5,
        queryFn: () => stateService.search(search, countryId),
        enabled: !!countryId,
    })

    return {
        states: data?.data ?? [],
        isLoading,
        isError,
        error,
    }
}
