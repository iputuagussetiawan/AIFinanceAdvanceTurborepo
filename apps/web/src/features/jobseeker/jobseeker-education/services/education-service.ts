import { api } from '@/lib/api-factory'

import type { EducationDTO, IEducationResponse, IEducationsResponse } from '../types/education-type'

export const educationService = {
    updateAll: (data: EducationDTO[]) =>
        api.API<IEducationsResponse>('/api/jobseeker/educations/bulk', {
            method: 'PUT',
            body: JSON.stringify({ educations: data }),
            cache: 'no-store',
        }),

    upsert: (data: EducationDTO) =>
        api.API<IEducationResponse>('/api/jobseeker/educations', {
            method: 'PUT',
            body: JSON.stringify(data),
            cache: 'no-store',
        }),

    remove: (educationId: string) =>
        api.API<{ message: string }>(`/api/jobseeker/educations/${educationId}`, {
            method: 'DELETE',
            cache: 'no-store',
        }),

    removeAll: (educationIds: string[]) =>
        api.API<{ message: string }>('/api/jobseeker/educations/bulk', {
            method: 'DELETE',
            body: JSON.stringify({ educationIds }),
            cache: 'no-store',
        }),
}
