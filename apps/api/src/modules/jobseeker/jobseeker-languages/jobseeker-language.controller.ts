import { Request, Response } from 'express'
import { z } from 'zod'

import { HTTPSTATUS } from '../../../config/http.config'
import { asyncHandler } from '../../../middlewares/asyncHandler.middleware'
import { BadRequestException } from '../../../utils/appError'
import { jobseekerLanguageValidation } from './jobseeker-language.validation'
import {
    bulkRemoveJobseekerLanguagesService,
    bulkUpdateJobseekerLanguagesService,
    removeJobseekerLanguageService,
    updateJobseekerLanguageService,
} from './jobseeker-language.service'

export const upsertJobseekerLanguage = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id as string
    if (!userId) throw new BadRequestException('User authentication required')

    const body = jobseekerLanguageValidation.parse(req.body)
    const data = await updateJobseekerLanguageService(userId, body)

    return res.status(HTTPSTATUS.OK).json({ success: true, message: 'Language proficiency updated successfully', data })
})

export const bulkUpsertJobseekerLanguages = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id as string
    if (!userId) throw new BadRequestException('User authentication required')

    const { languages } = req.body
    const validatedLanguages = z.array(jobseekerLanguageValidation).parse(languages)
    const data = await bulkUpdateJobseekerLanguagesService(userId, validatedLanguages)

    return res.status(HTTPSTATUS.OK).json({ success: true, message: `${validatedLanguages.length} languages processed successfully`, data })
})

export const removeJobseekerLanguage = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id as string
    if (!userId) throw new BadRequestException('User authentication required')

    const { languageId } = req.params
    if (!languageId) throw new BadRequestException('Language ID is required')

    const data = await removeJobseekerLanguageService(userId, languageId)

    return res.status(HTTPSTATUS.OK).json({ success: true, message: 'Language removed successfully', data })
})

export const bulkRemoveJobseekerLanguages = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id as string
    if (!userId) throw new BadRequestException('User authentication required')

    const { languageIds } = req.body
    const validatedIds = z.array(z.string()).parse(languageIds)

    if (validatedIds.length === 0) throw new BadRequestException('Please provide at least one language ID to remove')

    const data = await bulkRemoveJobseekerLanguagesService(userId, validatedIds)

    return res.status(HTTPSTATUS.OK).json({ success: true, message: `${validatedIds.length} languages removed successfully`, data })
})
