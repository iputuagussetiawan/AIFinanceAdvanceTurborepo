import { api } from '@/lib/api-factory'

import type { ISkillsResponse } from '../types/skill-type'

export const skillService = {
    findAll: (search: string = '') =>
        api.API<ISkillsResponse>('/api/skill/search', {
            method: 'GET',
            cache: 'no-store',
            params: { search },
        }),
}
