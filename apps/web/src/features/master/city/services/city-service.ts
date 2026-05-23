import { api } from '@/lib/api-factory'

import type { ICitiesResponse } from '../types/city-type'

export const cityService = {
    search: (search: string = '', stateId?: string, countryId?: string) =>
        api.API<ICitiesResponse>('/api/city/search', {
            method: 'GET',
            cache: 'no-store',
            params: { search, stateId, countryId },
        }),
}
