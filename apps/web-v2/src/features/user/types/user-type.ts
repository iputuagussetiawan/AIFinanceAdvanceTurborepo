export interface ISession {
    id: string
    isCurrent: boolean
    browser: string
    os: string
    device: string
    ipAddress: string | null
    userAgent: string | null
    lastActiveAt: string
    expiredAt: string
    createdAt: string
}

export interface IUserMe {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
    profilePicture: string | null
    isEmailVerified: boolean
    isActive: boolean
    provider: string
    lastLogin: string | null
    createdAt: string
    updatedAt: string
    role: string | null
    permissions: string[]
    sessions: ISession[]
}
