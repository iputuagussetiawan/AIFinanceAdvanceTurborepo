import { Request, Response } from 'express'
import { z } from 'zod'

import { HTTPSTATUS } from '../../config/http.config'
import { asyncHandler } from '../../middlewares/asyncHandler.middleware'
import { BadRequestException } from '../../utils/appError'
import {
    bulkRemoveUserLanguagesService,
    bulkUpdateUserLanguagesService,
    removeUserLanguageService,
    updateUserLanguageService,
} from './user-skill.service'
import { userLanguageValidation } from './user-skill.validation'

/**
 * Handles Add or Update of a single language proficiency
 * PUT /api/users/languages
 */
export const upsertUserLanguage = asyncHandler(async (req: Request, res: Response) => {
    // 1. Validate userId
    const userId = req.user?._id as string
    if (!userId) throw new BadRequestException('User authentication required')

    // 2. Validate body with Zod
    const body = userLanguageValidation.parse(req.body)

    // 3. Call service
    const updatedLanguages = await updateUserLanguageService(userId, body)

    return res.status(HTTPSTATUS.OK).json({
        success: true,
        message: 'Language proficiency updated successfully',
        data: updatedLanguages,
    })
})

/**
 * Handles Bulk Add or Update of language proficiencies
 * PUT /api/users/languages/bulk
 */
export const bulkUpsertUserLanguages = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id as string
    if (!userId) throw new BadRequestException('User authentication required')

    // 1. Extract and Validate that it is an array using Zod
    const { languages } = req.body
    const validatedLanguages = z.array(userLanguageValidation).parse(languages)

    // 2. Call the bulk service
    const updatedLanguages = await bulkUpdateUserLanguagesService(userId, validatedLanguages)

    return res.status(HTTPSTATUS.OK).json({
        success: true,
        message: `${validatedLanguages.length} languages processed successfully`,
        data: updatedLanguages,
    })
})

/**
 * Removes a specific language from the user's profile
 * DELETE /api/users/languages/:languageId
 */
export const removeUserLanguage = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id as string
    if (!userId) throw new BadRequestException('User authentication required')

    const { languageId } = req.params
    if (!languageId) throw new BadRequestException('Language ID is required')

    const remainingLanguages = await removeUserLanguageService(userId, languageId.toString())

    return res.status(HTTPSTATUS.OK).json({
        success: true,
        message: 'Language removed from profile successfully',
        data: remainingLanguages,
    })
})

/**
 * Handles Bulk Removal of languages
 * DELETE /api/users/languages/bulk
 */
export const bulkRemoveUserLanguages = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id as string
    if (!userId) throw new BadRequestException('User authentication required')

    // 1. Validate that languageIds is an array of strings
    const { languageIds } = req.body
    const validatedIds = z.array(z.string()).parse(languageIds)

    if (validatedIds.length === 0) {
        throw new BadRequestException('Please provide at least one language ID to remove')
    }

    const remainingLanguages = await bulkRemoveUserLanguagesService(userId, validatedIds)

    return res.status(HTTPSTATUS.OK).json({
        success: true,
        message: `${validatedIds.length} languages removed successfully`,
        data: remainingLanguages,
    })
})
