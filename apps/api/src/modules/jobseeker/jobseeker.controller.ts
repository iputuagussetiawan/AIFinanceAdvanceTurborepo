import type { Request, Response } from 'express'

import { HTTPSTATUS } from '../../config/http.config'
import { asyncHandler } from '../../middlewares/asyncHandler.middleware'
import { BadRequestException } from '../../utils/appError'
import { JobseekerService } from './jobseeker.service'
import { jobseekerPersonalInfoValidation } from './jobseeker.validation'

export const JobseekerController = {
    saveProfile: asyncHandler(async (req: Request, res: Response) => {
        const body = jobseekerPersonalInfoValidation.parse(req.body)
        const userId = req.user?._id as string

        if (!userId) throw new BadRequestException('User not authenticated')

        const { profile } = await JobseekerService.saveProfile(userId, body)

        return res.status(HTTPSTATUS.OK).json({ message: 'Jobseeker profile updated successfully', profile })
    }),

    getProfile: asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?._id as string

        if (!userId) throw new BadRequestException('User not authenticated')

        const { profile } = await JobseekerService.getFullProfile(userId)

        return res.status(HTTPSTATUS.OK).json({ message: 'Profile fetched successfully', profile })
    }),
}
