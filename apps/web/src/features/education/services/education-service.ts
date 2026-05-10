import { api } from '@/lib/api-factory'

import type { EducationDTO, IEducationResponse, IEducationsResponse } from '../types/education-type'

export const educationService = {
    // 1. Add the Register function
    // create: (data: EducationDTO) =>
    //     api.API<IEducationResponse>('/api/education/create', {
    //         method: 'POST',
    //         body: JSON.stringify(data),
    //         // We usually don't cache registration attempts
    //         cache: 'no-store',
    //     }),

    updateAll: (data: EducationDTO[]) =>
        api.API<IEducationResponse>('/api/user/educations/bulk', {
            method: 'PUT',
            body: JSON.stringify({ educations: data }),
            cache: 'no-store',
        }),

    // get: () =>
    //     api.API<IEducationsResponse>('/api/education/get', {
    //         method: 'GET',
    //         cache: 'no-store', // Always get fresh data
    //     }),
}
