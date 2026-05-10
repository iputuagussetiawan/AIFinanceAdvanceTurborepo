import type { Request, Response } from 'express'

import { HTTPSTATUS } from '../../config/http.config'
import { asyncHandler } from '../../middlewares/asyncHandler.middleware'
import { BadRequestException } from '../../utils/appError'
import { getExperienceHistory, saveExperienceHistoryService } from './experience.service'
import { experienceValidation } from './experience.validation'

export const saveExperienceHistoryController = asyncHandler(async (req: Request, res: Response) => {
    // 1. Validate req.body against the Experience schema
    const body = experienceValidation.parse(req.body)

    // 2. Extract userId and ensure it exists from the auth middleware
    const userId = req.user?._id as string

    if (!userId) {
        throw new BadRequestException('User not authenticated')
    }

    // 3. Call the Experience service
    const { experience } = await saveExperienceHistoryService(userId, body)

    // 4. Return response with 201 Created status
    return res.status(HTTPSTATUS.CREATED).json({
        message: 'Experience record created successfully',
        experience,
    })
})

export const getExperienceHistoryController = asyncHandler(async (req: Request, res: Response) => {
    const currentUserId = req.user?._id
    // 3. Call Service
    const experiences = await getExperienceHistory(currentUserId)
    // 4. Response
    return res.status(HTTPSTATUS.OK).json({
        message: 'Experience history retrieved successfully',
        count: experiences.length,
        data: experiences,
    })
})
