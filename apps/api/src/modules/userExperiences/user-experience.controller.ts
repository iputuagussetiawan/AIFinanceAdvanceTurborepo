import { Request, Response } from 'express'
import { z } from 'zod'

import { HTTPSTATUS } from '../../config/http.config'
import { asyncHandler } from '../../middlewares/asyncHandler.middleware'
import { BadRequestException } from '../../utils/appError'
import * as ExperienceService from './user-experience.service'
import { userExperienceValidation } from './user-experience.validation'

export const UserExperienceController = {
    /**
     * Update atau Tambah satu entri pengalaman kerja
     */
    updateExperience: asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?._id as string
        if (!userId) throw new BadRequestException('User authentication required')

        // Validasi body dengan Zod
        const body = userExperienceValidation.parse(req.body)

        const data = await ExperienceService.updateUserExperienceService(userId, body)

        return res.status(HTTPSTATUS.OK).json({
            success: true,
            message: 'Experience updated successfully',
            data,
        })
    }),

    /**
     * Bulk Sync Experience (Penting untuk Reordering Drag & Drop)
     */
    bulkUpdateExperience: asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?._id as string
        if (!userId) throw new BadRequestException('User authentication required')

        // Buat schema wrapper untuk validasi bulk agar .coerce bekerja di dalam array
        const bulkSchema = z.object({
            experiences: z.array(userExperienceValidation),
        })

        // Validasi seluruh req.body
        const { experiences } = bulkSchema.parse(req.body)

        const data = await ExperienceService.bulkUpdateUserExperienceService(userId, experiences)

        return res.status(HTTPSTATUS.OK).json({
            success: true,
            message: 'Experience history synced successfully',
            data,
        })
    }),

    /**
     * Menghapus satu entri pengalaman kerja berdasarkan ID
     */
    removeExperience: asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?._id as string
        if (!userId) throw new BadRequestException('User authentication required')

        const { experienceId } = req.params
        if (!experienceId) throw new BadRequestException('Experience ID is required')

        const data = await ExperienceService.removeUserExperienceService(
            userId,
            experienceId.toString(),
        )

        return res.status(HTTPSTATUS.OK).json({
            success: true,
            message: 'Experience entry removed',
            data,
        })
    }),

    /**
     * Menghapus banyak entri sekaligus
     */
    bulkRemoveExperience: asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?._id as string
        if (!userId) throw new BadRequestException('User authentication required')

        const { experienceIds } = req.body
        // Validasi bahwa input adalah array of strings
        const validatedIds = z.array(z.string()).parse(experienceIds)

        const data = await ExperienceService.bulkRemoveUserExperienceService(userId, validatedIds)

        return res.status(HTTPSTATUS.OK).json({
            success: true,
            message: 'Selected experience entries removed',
            data,
        })
    }),
}
