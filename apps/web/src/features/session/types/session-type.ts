import type { IEducation } from '@/features/jobseeker/jobseeker-education/types/education-type'
import type { IExperience } from '@/features/jobseeker/jobseeker-experience/types/experience-type'
import type { IUserLanguageResponse } from '@/features/jobseeker/jobseeker-language/types/user-language-type'
import type { IUserSkill, IUserSkillResponse } from '@/features/jobseeker/jobseeker-skill/types/userskill-type'

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
    birthday?: string | null
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
    experiences: IExperience[]
    skills: IUserSkillResponse[] // Assuming you have a IUserSkill type defined somewhere   
    languages:IUserLanguageResponse[] // Assuming you have a IUserLanguage type defined somewhere
}

// This matches the response structure from your session/me service
export interface IUserResponse {
    message: string
    user: IUser
}
