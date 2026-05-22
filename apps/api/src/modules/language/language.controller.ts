import type { Request, Response } from 'express'
import z from 'zod'

import { HTTPSTATUS } from '../../config/http.config'
import { asyncHandler } from '../../middlewares/asyncHandler.middleware'
import { BadRequestException } from '../../utils/appError'
import { LanguageService } from './language.service'
import { languageValidation, updateLanguageValidation } from './language.validation'

export const LanguageController = {
    searchLanguages: asyncHandler(async (req: Request, res: Response) => {
        const search = (req.query.search as string) ?? ''
        const priority = req.query.priority !== undefined ? Number(req.query.priority) : undefined

        const data = await LanguageService.searchLanguages(search, priority)

        return res.status(HTTPSTATUS.OK).json({ success: true, message: 'Languages fetched successfully', data })
    }),

    getAllLanguages: asyncHandler(async (req: Request, res: Response) => {
        const isActiveQuery = req.query.isActive
        const isActive = isActiveQuery !== undefined ? isActiveQuery === 'true' : undefined

        const result = await LanguageService.getAllLanguages(isActive)

        return res.status(HTTPSTATUS.OK).json({ success: true, message: 'Languages fetched successfully', data: result.data })
    }),

    getLanguages: asyncHandler(async (req: Request, res: Response) => {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const search = req.query.search as string
        const isActive =
            req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined

        const result = await LanguageService.getLanguagesPaginated(page, limit, search, isActive)

        return res.status(HTTPSTATUS.OK).json({ success: true, message: 'Successfully fetched languages', ...result })
    }),

    createLanguage: asyncHandler(async (req: Request, res: Response) => {
        const body = languageValidation.parse(req.body)
        const language = await LanguageService.createLanguage(body)

        return res.status(HTTPSTATUS.CREATED).json({ success: true, message: 'Language created successfully', data: language })
    }),

    bulkCreateLanguage: asyncHandler(async (req: Request, res: Response) => {
        const validatedData = z.array(languageValidation).parse(req.body)
        const result = await LanguageService.bulkCreateLanguage(validatedData)

        return res.status(HTTPSTATUS.CREATED).json({ success: true, message: 'Languages bulk inserted successfully', data: result })
    }),

    updateLanguage: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params
        if (!id) throw new BadRequestException('Language ID is required')

        const validatedData = updateLanguageValidation.parse(req.body)
        const updatedLanguage = await LanguageService.updateLanguage(id.toString(), validatedData)

        return res.status(HTTPSTATUS.OK).json({ success: true, message: 'Language updated successfully', data: updatedLanguage })
    }),

    getLanguageById: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params
        if (!id) throw new BadRequestException('Language ID is required')

        const language = await LanguageService.getLanguageById(id.toString())

        return res.status(HTTPSTATUS.OK).json({ success: true, message: 'Language retrieved successfully', data: language })
    }),

    deleteLanguage: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params
        if (!id) throw new BadRequestException('Language ID is required')

        await LanguageService.deleteLanguage(id.toString())

        return res.status(HTTPSTATUS.OK).json({ success: true, message: 'Language deleted successfully' })
    }),
}
