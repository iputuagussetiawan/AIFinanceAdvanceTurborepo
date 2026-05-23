import { useQuery } from '@tanstack/react-query'

import { countryService } from '../services/country-service'
import type { ICountriesResponse } from '../types/country-type'

export function useCountry(search: string = '') {
    const { data, isLoading, isError, error } = useQuery<ICountriesResponse>({
        queryKey: ['countries', search],
        staleTime: 1000 * 60 * 5,
        queryFn: () => countryService.search(search),
    })

    return {
        countries: data?.data ?? [],
        isLoading,
        isError,
        error,
    }
}
