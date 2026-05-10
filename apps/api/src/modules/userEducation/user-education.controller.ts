import { Request, Response } from 'express'
import { z } from 'zod'

import { HTTPSTATUS } from '../../config/http.config'
import { asyncHandler } from '../../middlewares/asyncHandler.middleware'
import { BadRequestException } from '../../utils/appError'
import * as EducationService from './user-education.service'
import { userEducationValidation } from './user-education.validation'

export const UserEducationController = {
    /**
     * Update or Add a single education entry
     */
    updateEducation: asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?._id as string
        if (!userId) throw new BadRequestException('User authentication required')

        // Validate body with Zod
        const body = userEducationValidation.parse(req.body)

        const data = await EducationService.updateUserEducationService(userId, body)

        return res.status(HTTPSTATUS.OK).json({
            success: true,
            message: 'Education updated successfully',
            data,
        })
    }),

    /**
     * Bulk Sync Education (Add/Update multiple)
     */
    bulkUpdateEducation: asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?._id as string
        if (!userId) throw new BadRequestException('User authentication required')

        // Extract and validate array
        const { educations } = req.body
        const validatedEducations = z.array(userEducationValidation).parse(educations)

        const data = await EducationService.bulkUpdateUserEducationService(
            userId,
            validatedEducations,
        )

        return res.status(HTTPSTATUS.OK).json({
            success: true,
            message: 'Education history synced successfully',
            data,
        })
    }),

    /**
     * Remove a single education entry
     */
    removeEducation: asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?._id as string
        if (!userId) throw new BadRequestException('User authentication required')

        const { educationId } = req.params
        if (!educationId) throw new BadRequestException('Education ID is required')

        const data = await EducationService.removeUserEducationService(
            userId,
            educationId.toString(),
        )

        return res.status(HTTPSTATUS.OK).json({
            success: true,
            message: 'Education entry removed',
            data,
        })
    }),

    /**
     * Bulk Remove education entries
     */
    bulkRemoveEducation: asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?._id as string
        if (!userId) throw new BadRequestException('User authentication required')

        const { educationIds } = req.body
        const validatedIds = z.array(z.string()).parse(educationIds)

        const data = await EducationService.bulkRemoveUserEducationService(userId, validatedIds)

        return res.status(HTTPSTATUS.OK).json({
            success: true,
            message: 'Selected education entries removed',
            data,
        })
    }),
}
