import { Request, Response } from 'express'
import { z } from 'zod'

import { HTTPSTATUS } from '../../../config/http.config'
import { asyncHandler } from '../../../middlewares/asyncHandler.middleware'
import { BadRequestException } from '../../../utils/appError'
import { JobseekerEducationService } from './jobseeker-education.service'
import { jobseekerEducationValidation } from './jobseeker-education.validation'

export const JobseekerEducationController = {
    updateEducation: asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?._id as string
        if (!userId) throw new BadRequestException('User authentication required')

        const body = jobseekerEducationValidation.parse(req.body)
        const data = await JobseekerEducationService.updateEducation(userId, body)

        return res.status(HTTPSTATUS.OK).json({ success: true, message: 'Education updated successfully', data })
    }),

    bulkUpdateEducation: asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?._id as string
        if (!userId) throw new BadRequestException('User authentication required')

        const { educations } = z.object({ educations: z.array(jobseekerEducationValidation) }).parse(req.body)
        const data = await JobseekerEducationService.bulkUpdateEducation(userId, educations)

        return res.status(HTTPSTATUS.OK).json({ success: true, message: 'Education history synced successfully', data })
    }),

    removeEducation: asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?._id as string
        if (!userId) throw new BadRequestException('User authentication required')

        const { educationId } = z.object({ educationId: z.string() }).parse(req.params)
        if (!educationId) throw new BadRequestException('Education ID is required')

        const data = await JobseekerEducationService.removeEducation(userId, educationId)

        return res.status(HTTPSTATUS.OK).json({ success: true, message: 'Education entry removed', data })
    }),

    bulkRemoveEducation: asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?._id as string
        if (!userId) throw new BadRequestException('User authentication required')

        const { educationIds } = req.body
        const validatedIds = z.array(z.string()).parse(educationIds)
        const data = await JobseekerEducationService.bulkRemoveEducation(userId, validatedIds)

        return res.status(HTTPSTATUS.OK).json({ success: true, message: 'Selected education entries removed', data })
    }),
}
