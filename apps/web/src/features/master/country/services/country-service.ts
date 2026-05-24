import { api } from '@/lib/api-factory'

import type { ICountriesResponse } from '../types/country-type'

export const countryService = {
    search: (search: string = '') =>
        api.API<ICountriesResponse>('/api/country/search', {
            method: 'GET',
            cache: 'no-store',
            params: { search },
        }),
}
