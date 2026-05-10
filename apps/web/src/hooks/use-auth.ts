'use client'

import { useQuery } from '@tanstack/react-query'

import { sessionService } from '@/features/session/services/session-service'

const useAuth = () => {
    const query = useQuery({
        queryKey: ['authUser'],
        queryFn: sessionService.get,
        staleTime: Infinity,
    })
    return query
}

export default useAuth
