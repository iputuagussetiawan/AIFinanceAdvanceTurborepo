'use server'

import { revalidatePath } from 'next/cache'

import { experienceService } from '../services/experience-service'
import type { ExperienceDTO, IExperienceResponse } from '../types/experience-type'

export async function handleCreateExperience(data: ExperienceDTO) {
    try {
        const response: IExperienceResponse = await experienceService.create(data)
        revalidatePath('/profile')
        revalidatePath('/onboarding')
        return {
            success: true,
            message: response.message,
            experience: response.experience,
        }
    } catch (error: any) {
        return {
            success: false,
            error: error.message || 'Failed to update profile',
        }
    }
}
