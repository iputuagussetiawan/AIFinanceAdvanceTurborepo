import { Request, Response } from 'express'
import { z } from 'zod'

import { HTTPSTATUS } from '../../../config/http.config'
import { asyncHandler } from '../../../middlewares/asyncHandler.middleware'
import { BadRequestException } from '../../../utils/appError'
import * as JobseekerSkillService from './jobseeker-skill.service'
import { jobseekerSkillValidation, jobseekerSkillsArrayValidation } from './jobseeker-skill.validation'

export const JobseekerSkillController = {
    upsertSkill: asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?._id as string
        if (!userId) throw new BadRequestException('User authentication required')

        const body = jobseekerSkillValidation.parse(req.body)
        const data = await JobseekerSkillService.updateJobseekerSkillService(userId, body)

        return res.status(HTTPSTATUS.OK).json({ success: true, message: 'Skill updated successfully', data })
    }),

    bulkUpsertSkills: asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?._id as string
        if (!userId) throw new BadRequestException('User authentication required')

        const { skills } = req.body
        const validatedSkills = jobseekerSkillsArrayValidation.parse(skills)
        const data = await JobseekerSkillService.bulkUpdateJobseekerSkillsService(userId, validatedSkills)

        return res.status(HTTPSTATUS.OK).json({ success: true, message: 'Skills synced successfully', data })
    }),

    removeSkill: asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?._id as string
        if (!userId) throw new BadRequestException('User authentication required')

        const { entryId } = req.params
        if (!entryId) throw new BadRequestException('Skill entry ID is required')

        const data = await JobseekerSkillService.removeJobseekerSkillService(userId, Array.isArray(entryId) ? entryId[0] : entryId)

        return res.status(HTTPSTATUS.OK).json({ success: true, message: 'Skill entry removed', data })
    }),

    bulkRemoveSkills: asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?._id as string
        if (!userId) throw new BadRequestException('User authentication required')

        const { skillIds } = req.body
        const validatedIds = z.array(z.string()).parse(skillIds)
        const data = await JobseekerSkillService.bulkRemoveJobseekerSkillsService(userId, validatedIds)

        return res.status(HTTPSTATUS.OK).json({ success: true, message: 'Selected skills removed', data })
    }),
}
