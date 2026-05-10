'use server'

import { revalidatePath } from 'next/cache'

import { jobseekerService } from '../services/jobseeker-service'
import type { IJobseekerResponse, PersonalInfoDTO } from '../types/jobseeker-type'

export async function handleSaveJobseekerProfile(data: PersonalInfoDTO) {
    try {
        const response: IJobseekerResponse = await jobseekerService.saveProfile(data)
        revalidatePath('/profile')
        revalidatePath('/onboarding')
        return {
            success: true,
            message: response.message,
            profile: response.profile,
        }
    } catch (error: any) {
        return {
            success: false,
            error: error.message || 'Failed to update profile',
        }
    }
}
