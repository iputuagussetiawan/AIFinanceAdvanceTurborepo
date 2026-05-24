// services/institution-service.ts

import { api } from '@/lib/api-factory'

import type { IInstitutionDTO, InstitutionResponse } from '../types/institution-type'

export const institutionService = {
    getAll: () =>
        api.API<InstitutionResponse>('/api/institution', {
            method: 'GET',
            cache: 'no-store',
        }),
    create: (data: IInstitutionDTO) =>
        api.API<InstitutionResponse>('/api/institution', {
            method: 'POST',
            body: JSON.stringify(data),
            cache: 'no-store',
        }),

    //   getById: (id: string) =>
    //     api.API<InstitutionResponse>(`/api/institution/${id}`, {
    //       method: 'GET',
    //       cache: 'no-store',
    //     }),

    //   update: (id: string, data: Partial<IInstitutionDTO>) =>
    //     api.API<InstitutionResponse>(`/api/institution/${id}`, {
    //       method: 'PATCH',
    //       body: JSON.stringify(data),
    //       cache: 'no-store',
    //     }),

    //   delete: (id: string) =>
    //     api.API<InstitutionResponse>(`/api/institution/${id}`, {
    //       method: 'DELETE',
    //       cache: 'no-store',
    //     }),
}
