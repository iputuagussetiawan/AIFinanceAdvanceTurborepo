import { Request, Response } from 'express'
import { z } from 'zod'

import { HTTPSTATUS } from '../../../config/http.config'
import { asyncHandler } from '../../../middlewares/asyncHandler.middleware'
import { BadRequestException } from '../../../utils/appError'
import * as ExperienceService from './jobseeker-experience.service'
import { jobseekerExperienceValidation } from './jobseeker-experience.validation'

export const JobseekerExperienceController = {
    updateExperience: asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?._id as string
        if (!userId) throw new BadRequestException('User authentication required')

        const body = jobseekerExperienceValidation.parse(req.body)
        const data = await ExperienceService.updateJobseekerExperienceService(userId, body)

        return res.status(HTTPSTATUS.OK).json({ success: true, message: 'Experience updated successfully', data })
    }),

    bulkUpdateExperience: asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?._id as string
        if (!userId) throw new BadRequestException('User authentication required')

        const bulkSchema = z.object({ experiences: z.array(jobseekerExperienceValidation) })
        const { experiences } = bulkSchema.parse(req.body)
        const data = await ExperienceService.bulkUpdateJobseekerExperienceService(userId, experiences)

        return res.status(HTTPSTATUS.OK).json({ success: true, message: 'Experience history synced successfully', data })
    }),

    removeExperience: asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?._id as string
        if (!userId) throw new BadRequestException('User authentication required')

        const { experienceId } = req.params
        if (!experienceId) throw new BadRequestException('Experience ID is required')

        const data = await ExperienceService.removeJobseekerExperienceService(userId, experienceId)

        return res.status(HTTPSTATUS.OK).json({ success: true, message: 'Experience entry removed', data })
    }),

    bulkRemoveExperience: asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?._id as string
        if (!userId) throw new BadRequestException('User authentication required')

        const { experienceIds } = req.body
        const validatedIds = z.array(z.string()).parse(experienceIds)
        const data = await ExperienceService.bulkRemoveJobseekerExperienceService(userId, validatedIds)

        return res.status(HTTPSTATUS.OK).json({ success: true, message: 'Selected experience entries removed', data })
    }),
}
