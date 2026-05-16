import { api } from '@/lib/api-factory'
import type { IBulkUserLanguages, IUserLanguagesApiResponse } from '../types/user-language-type'

export const userLanguageService = {
    updateAll: (data: IBulkUserLanguages) =>
        api.API<IUserLanguagesApiResponse>('/api/user/languages/bulk', {
            method: 'PUT',
            body: JSON.stringify({ languages: data.languages }),
            cache: 'no-store',
        }),
}