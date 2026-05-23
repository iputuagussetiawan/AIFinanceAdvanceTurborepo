import { api } from '@/lib/api-factory'

import type { IStatesResponse } from '../types/state-type'

export const stateService = {
    search: (search: string = '', countryId?: string) =>
        api.API<IStatesResponse>('/api/state/search', {
            method: 'GET',
            cache: 'no-store',
            params: { search, countryId },
        }),
}
