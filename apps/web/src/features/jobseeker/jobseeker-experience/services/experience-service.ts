import { api } from '@/lib/api-factory'

import type { ExperienceDTO } from '../types/experience-type'

export const experienceService = {
    updateAll: (data: ExperienceDTO[]) =>
        api.API<any>('/api/jobseeker/experiences/bulk', {
            method: 'PUT',
            body: JSON.stringify({ experiences: data }),
            cache: 'no-store',
        }),

    upsert: (data: ExperienceDTO) =>
        api.API<any>('/api/jobseeker/experiences', {
            method: 'PUT',
            body: JSON.stringify(data),
            cache: 'no-store',
        }),

    remove: (experienceId: string) =>
        api.API<{ message: string }>(`/api/jobseeker/experiences/${experienceId}`, {
            method: 'DELETE',
            cache: 'no-store',
        }),

    removeAll: (experienceIds: string[]) =>
        api.API<{ message: string }>('/api/jobseeker/experiences/bulk', {
            method: 'DELETE',
            body: JSON.stringify({ experienceIds }),
            cache: 'no-store',
        }),
}
