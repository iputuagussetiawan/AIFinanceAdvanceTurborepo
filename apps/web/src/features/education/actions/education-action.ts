'use server'

import { revalidatePath } from 'next/cache'

import { educationService } from '../services/education-service'
import type { EducationDTO, IEducationResponse } from '../types/education-type'

export async function handleCreateEducation(data: EducationDTO) {
    try {
        const response: IEducationResponse = await educationService.create(data)
        revalidatePath('/profile')
        revalidatePath('/onboarding')
        return {
            success: true,
            message: response.message,
            education: response.education,
        }
    } catch (error: any) {
        return {
            success: false,
            error: error.message || 'Failed to update profile',
        }
    }
}
