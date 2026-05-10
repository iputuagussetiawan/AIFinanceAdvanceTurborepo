import type { Request, Response } from 'express'

import { HTTPSTATUS } from '../../config/http.config'
import { asyncHandler } from '../../middlewares/asyncHandler.middleware'
import { BadRequestException } from '../../utils/appError'
import {
    getEducationHistory,
    saveEducationHistoryService,
    updateEducationHistoryService,
} from './education.service'
import { educationValidation, updateEducationListValidation } from './education.validation'

export const saveEducationHistoryController = asyncHandler(async (req: Request, res: Response) => {
    // 1. Validate req.body as a single object (Removed z.array)
    const body = educationValidation.parse(req.body)

    // 2. Extract userId and ensure it exists
    const userId = req.user?._id as string

    if (!userId) {
        throw new BadRequestException('User not authenticated')
    }

    // 3. Call the service (Now passing a single object)
    const { education } = await saveEducationHistoryService(userId, body)

    // 4. Return response
    return res.status(HTTPSTATUS.CREATED).json({
        message: 'Education record created successfully',
        education,
    })
})

export const updateEducationHistoryController = asyncHandler(
    async (req: Request, res: Response) => {
        // 1. Validate req.body using the list wrapper (contains the { educations: [] } structure)
        // This matches the "updateEducationListValidation" we created earlier
        const validatedData = updateEducationListValidation.parse(req.body)

        // 2. Extract userId from authenticated request
        const userId = req.user?._id as string

        if (!userId) {
            throw new BadRequestException('User not authenticated')
        }

        // 3. Call the bulk sync service
        // We pass validatedData.educations which is the actual array
        const { data, count } = await updateEducationHistoryService(
            userId,
            validatedData.educations,
        )

        // 4. Return response
        return res.status(HTTPSTATUS.OK).json({
            message: 'Education history synchronized successfully',
            count,
            data,
        })
    },
)

export const getEducationHistoryController = asyncHandler(async (req: Request, res: Response) => {
    // 2. Authorization Check (Current logged-in user)
    const currentUserId = req.user?._id
    // 4. Call the Service or Model directly
    const educationHistory = await getEducationHistory(currentUserId)
    // 5. Return Response
    return res.status(HTTPSTATUS.OK).json({
        message: 'Education history retrieved successfully',
        count: educationHistory.length,
        data: educationHistory,
    })
})
