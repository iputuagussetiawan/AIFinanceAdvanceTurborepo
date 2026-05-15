import { api } from '@/lib/api-factory'
import type { IUserSkill, IUserSkillsApiResponse } from '../types/userskill-type'
export const userSkillService = {
    updateAll: (data: IUserSkill[]) =>
        api.API<IUserSkillsApiResponse>('/api/user/skills/bulk', {
            method: 'PUT',
            body: JSON.stringify({ skills: data }),
            cache: 'no-store',
        }),
}
