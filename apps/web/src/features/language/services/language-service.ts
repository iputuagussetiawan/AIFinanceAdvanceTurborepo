// services/user-service.ts

import { api } from '@/lib/api-factory'

import type { ILanguageDTO, ILanguageResponse } from '../types/language-type'

export const languageService = {
    create: (data: ILanguageDTO) =>
        api.API<ILanguageResponse>('/api/language', {
            method: 'POST',
            body: JSON.stringify(data),
            cache: 'no-store',
        }),
    createBulk: (data: ILanguageDTO[]) =>
        api.API<ILanguageResponse[]>('/api/language/bulk', {
            method: 'POST',
            body: JSON.stringify(data),
            cache: 'no-store',
        }),
    getAll: (page: number = 1, limit: number = 10) =>
        api.API<ILanguageResponse>('/api/language', {
            method: 'GET',
            cache: 'no-store',
            params: {
                page: page.toString(),
                limit: limit.toString(),
            },
        }),
}
