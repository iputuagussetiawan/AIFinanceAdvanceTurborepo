import type { Request, Response } from 'express'

import { HTTPSTATUS } from '../../config/http.config'
import { asyncHandler } from '../../middlewares/asyncHandler.middleware'
import { BadRequestException } from '../../utils/appError'
import { getFullJobseekerProfileService, saveJobseekerProfileService } from './jobseeker.service'
import { jobseekerPersonalInfoValidation } from './jobseeker.validation'

/**
 * Controller to Create or Update the Jobseeker Profile
 */
export const saveJobseekerProfileController = asyncHandler(async (req: Request, res: Response) => {
    // 1. Validate req.body against Jobseeker schema
    const body = jobseekerPersonalInfoValidation.parse(req.body)

    // 2. Extract userId from authenticated request
    const userId = req.user?._id as string

    if (!userId) {
        throw new BadRequestException('User not authenticated')
    }

    // 3. Call the service to Upsert (Update or Create) the profile
    const { profile } = await saveJobseekerProfileService(userId, body)

    // 4. Return response
    return res.status(HTTPSTATUS.OK).json({
        message: 'Jobseeker profile updated successfully',
        profile,
    })
})

/**
 * Controller to Fetch the complete Jobseeker Profile
 */
export const getJobseekerProfileController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id as string

    if (!userId) {
        throw new BadRequestException('User not authenticated')
    }

    const { profile } = await getFullJobseekerProfileService(userId)

    return res.status(HTTPSTATUS.OK).json({
        message: 'Profile fetched successfully',
        profile,
    })
})
