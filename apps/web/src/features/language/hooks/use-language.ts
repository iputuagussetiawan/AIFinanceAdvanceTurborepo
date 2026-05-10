// File: hooks/use-user.ts
import { useQuery } from '@tanstack/react-query'

import { languageService } from '../services/language-service'
import type { ILanguageResponse } from '../types/language-type'

export function useLanguage(page: number = 1, limit: number = 1) {
    const { data, isLoading, isError, error } = useQuery<ILanguageResponse>({
        queryKey: ['all-language'],
        staleTime: 1000 * 60 * 5,
        queryFn: () => languageService.getAll(page, limit),
    })
    return {
        languages: data?.data ?? [],
        pagination: data?.meta,
        isLoading,
        isError,
        error,
    }
}
