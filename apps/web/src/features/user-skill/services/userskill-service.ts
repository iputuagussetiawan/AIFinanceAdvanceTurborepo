import { api } from '@/lib/api-factory'
import type { IBulkUserSkills, IUserSkillsApiResponse } from '../types/userskill-type'
export const userSkillService = {
    updateAll: (data: IBulkUserSkills) =>
        api.API<IUserSkillsApiResponse>('/api/user/skills/bulk', {
            method: 'PUT',
            body: JSON.stringify({ skills: data.skills }),
            cache: 'no-store',
        }),
}
