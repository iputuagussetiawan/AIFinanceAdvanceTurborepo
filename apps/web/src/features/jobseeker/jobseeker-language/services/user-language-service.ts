import { api } from '@/lib/api-factory'
import type { IBulkUserLanguages, IUserLanguage, IUserLanguagesApiResponse } from '../types/user-language-type'

export const userLanguageService = {
    updateAll: (data: IBulkUserLanguages) =>
        api.API<IUserLanguagesApiResponse>('/api/jobseeker/languages/bulk', {
            method: 'PUT',
            body: JSON.stringify({ languages: data.languages }),
            cache: 'no-store',
        }),

    upsert: (data: IUserLanguage) =>
        api.API<IUserLanguagesApiResponse>('/api/jobseeker/languages', {
            method: 'PUT',
            body: JSON.stringify(data),
            cache: 'no-store',
        }),

    remove: (languageId: string) =>
        api.API<{ message: string }>(`/api/jobseeker/languages/${languageId}`, {
            method: 'DELETE',
            cache: 'no-store',
        }),

    removeAll: (languageIds: string[]) =>
        api.API<{ message: string }>('/api/jobseeker/languages/bulk', {
            method: 'DELETE',
            body: JSON.stringify({ languageIds }),
            cache: 'no-store',
        }),
}