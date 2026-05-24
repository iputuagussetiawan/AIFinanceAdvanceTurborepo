'use client'

import React, { createContext, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-factory'
import type { IUserMe } from '@/features/user/types/user-type'

type AuthContextType = {
    user?: IUserMe
    isLoading: boolean
    isFetching: boolean
    refetch: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ['me'],
        queryFn: () => api.API<IUserMe>('/api/user/me', { cache: 'no-store' }),
        retry: false,
    })

    return (
        <AuthContext.Provider value={{ user: data, isLoading, isFetching, refetch }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuthContext() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
    return ctx
}
