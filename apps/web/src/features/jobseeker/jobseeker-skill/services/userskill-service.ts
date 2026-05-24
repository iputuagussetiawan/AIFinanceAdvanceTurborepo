import { api } from '@/lib/api-factory'
import type { IBulkUserSkills, IUserSkill, IUserSkillsApiResponse } from '../types/userskill-type'

export const userSkillService = {
    updateAll: (data: IBulkUserSkills) =>
        api.API<IUserSkillsApiResponse>('/api/jobseeker/skills/bulk', {
            method: 'PUT',
            body: JSON.stringify({ skills: data.skills }),
            cache: 'no-store',
        }),

    upsert: (data: IUserSkill) =>
        api.API<IUserSkillsApiResponse>('/api/jobseeker/skills', {
            method: 'PUT',
            body: JSON.stringify(data),
            cache: 'no-store',
        }),

    remove: (entryId: string) =>
        api.API<{ message: string }>(`/api/jobseeker/skills/${entryId}`, {
            method: 'DELETE',
            cache: 'no-store',
        }),

    removeAll: (skillIds: string[]) =>
        api.API<{ message: string }>('/api/jobseeker/skills/bulk', {
            method: 'DELETE',
            body: JSON.stringify({ skillIds }),
            cache: 'no-store',
        }),
}
