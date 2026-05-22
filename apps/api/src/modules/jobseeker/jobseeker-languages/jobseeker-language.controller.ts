import { Request, Response } from 'express'
import { z } from 'zod'

import { HTTPSTATUS } from '../../../config/http.config'
import { asyncHandler } from '../../../middlewares/asyncHandler.middleware'
import { BadRequestException } from '../../../utils/appError'
import { JobseekerLanguageService } from './jobseeker-language.service'
import { jobseekerLanguageValidation } from './jobseeker-language.validation'

export const JobseekerLanguageController = {
    upsertLanguage: asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?._id as string
        if (!userId) throw new BadRequestException('User authentication required')

        const body = jobseekerLanguageValidation.parse(req.body)
        const data = await JobseekerLanguageService.updateLanguage(userId, body)

        return res.status(HTTPSTATUS.OK).json({ success: true, message: 'Language proficiency updated successfully', data })
    }),

    bulkUpsertLanguages: asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?._id as string
        if (!userId) throw new BadRequestException('User authentication required')

        const { languages } = z.object({ languages: z.array(jobseekerLanguageValidation) }).parse(req.body)
        const data = await JobseekerLanguageService.bulkUpdateLanguages(userId, languages)

        return res.status(HTTPSTATUS.OK).json({ success: true, message: `${languages.length} languages processed successfully`, data })
    }),

    removeLanguage: asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?._id as string
        if (!userId) throw new BadRequestException('User authentication required')

        const { languageId } = z.object({ languageId: z.string() }).parse(req.params)
        if (!languageId) throw new BadRequestException('Language ID is required')

        const data = await JobseekerLanguageService.removeLanguage(userId, languageId)

        return res.status(HTTPSTATUS.OK).json({ success: true, message: 'Language removed successfully', data })
    }),

    bulkRemoveLanguages: asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?._id as string
        if (!userId) throw new BadRequestException('User authentication required')

        const { languageIds } = req.body
        const validatedIds = z.array(z.string()).parse(languageIds)

        if (validatedIds.length === 0) throw new BadRequestException('Please provide at least one language ID to remove')

        const data = await JobseekerLanguageService.bulkRemoveLanguages(userId, validatedIds)

        return res.status(HTTPSTATUS.OK).json({ success: true, message: `${validatedIds.length} languages removed successfully`, data })
    }),
}
