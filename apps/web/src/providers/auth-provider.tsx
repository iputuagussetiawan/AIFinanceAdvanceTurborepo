'use client'

import React, { createContext, useContext } from 'react'

import type { IUser } from '@/features/session/types/session-type'
import useAuth from '@/hooks/use-auth'

type AuthContextType = {
    user?: IUser
    error: any
    isLoading: boolean
    isFetching: boolean
    refetch: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data, error, isLoading, isFetching, refetch } = useAuth()
    const user = data?.user

    if (isLoading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                {/* Your global loader or a blank screen */}
                <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
            </div>
        )
    }

    return (
        <AuthContext.Provider value={{ user, error, isLoading, isFetching, refetch }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => {
    const conext = useContext(AuthContext)
    if (!conext) {
        throw new Error('useAuthContext must be used within a AuthProvider')
    }
    return conext
}
