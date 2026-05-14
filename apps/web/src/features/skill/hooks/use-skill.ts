// hooks/use-skill.ts
import { useQuery } from '@tanstack/react-query'

import { skillService } from '../services/skill-service'
import type { ISkillsResponse } from '../types/skill-type'

export function useSkill(search: string = '') {
    const { data, isLoading, isError, error, isFetching } = useQuery<ISkillsResponse>({
        // Menjadikan 'search' sebagai part dari queryKey agar otomatis fetch ulang saat user mengetik
        queryKey: ['skills', search],
        queryFn: () => skillService.findAll(search),
        staleTime: 1000 * 60 * 5, // Data dianggap segar selama 5 menit
    })

    return {
        // Mapping data.data agar lebih mudah digunakan di komponen
        skills: data?.data ?? [],
        message: data?.message,
        isLoading,
        isFetching, // Berguna untuk menampilkan loading indicator tipis saat search berjalan
        isError,
        error,
    }
}