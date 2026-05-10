import type { IEducation } from '@/features/education/types/education-type'

export interface ISession {
    _id: string
    userId: string
    userAgent: string
    createdAt: string // or Date if you parse it
    expiredAt: string // or Date if you parse it
    isCurrent?: boolean // Optional because it's not present in all objects
}

export interface ISessionResponse {
    message: string
    sessions: ISession[]
}

export interface IRole {
    _id: string
    name: string
    permissions: string[]
}

export interface IUser {
    _id: string
    name: string

    // Profile Header Data (Matches your images)
    firstName: string
    lastName: string
    fullName: string // From Mongoose virtual
    jobTitle: string

    // Contact & Social
    email: string
    phoneNumber: string
    address: string
    website: string
    profilePicture: string | null
    bio: string

    // Account Status
    isEmailVerified: boolean
    isActive: boolean
    onboardingComplete: boolean

    // Metadata & Timestamps
    lastLogin: string | Date // ISO string from API
    createdAt: string | Date
    updatedAt: string | Date

    role: IRole
    educations: IEducation[]
    experiences: IEducation[]
}

// This matches the response structure from your session/me service
export interface IUserResponse {
    message: string
    user: IUser
}
