import type { NextFunction, Request, Response } from 'express'
import z from 'zod'

import { HTTPSTATUS } from '../../config/http.config'
import { asyncHandler } from '../../middlewares/asyncHandler.middleware'
import { BadRequestException } from '../../utils/appError'
import {
    bulkCreateLanguageService,
    createLanguageService,
    deleteLanguageService,
    getAllLanguagesService,
    getLanguageByIdService,
    getLanguagesPaginatedService,
    searchLanguagesService,
    updateLanguageService,
} from './language.service'
import { languageValidation, updateLanguageValidation } from './language.validation'


export const searchLanguagesController = asyncHandler(async (req: Request, res: Response) => {
    const search = (req.query.search as string) ?? ''
    const priority = req.query.priority !== undefined ? Number(req.query.priority) : undefined

    const data = await searchLanguagesService(search, priority)

    return res.status(HTTPSTATUS.OK).json({
        success: true,
        message: 'Languages fetched successfully',
        data,
    })
})


export const getAllLanguagesController = asyncHandler(async (req: Request, res: Response) => {
    // Mengambil filter isActive dari query jika ada (misal: ?isActive=true)
    const isActiveQuery = req.query.isActive
    const isActive = isActiveQuery !== undefined ? isActiveQuery === 'true' : undefined

    // Memanggil service tanpa pagination
    const result = await getAllLanguagesService(isActive)

    return res.status(HTTPSTATUS.OK).json({
        success: true,
        message: 'Languages fetched successfully',
        data: result.data, // Mengambil array data hasil transformasi service
    })
})
/**
 * Get paginated list of available languages
 * Path: GET /api/languages
 */
export const getLanguagesController = asyncHandler(async (req: Request, res: Response) => {
    // 1. Extract and parse query parameters
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const search = req.query.search as string

    // 2. Handle boolean conversion for isActive
    // This correctly handles 'true' as true, 'false' as false, and everything else as undefined
    const isActive =
        req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined

    // 3. Call the service
    const result = await getLanguagesPaginatedService(page, limit, search, isActive)

    // 4. Return clean response using your status constants
    return res.status(HTTPSTATUS.OK).json({
        success: true,
        message: 'Successfully fetched languages',
        ...result,
    })
})

/**
 * Create a new master language
 */
export const createLanguageController = asyncHandler(async (req: Request, res: Response) => {
    const body = languageValidation.parse(req.body)
    const language = await createLanguageService(body)

    return res.status(HTTPSTATUS.CREATED).json({
        success: true,
        message: 'Language created successfully',
        data: language,
    })
})

/**
 * Bulk insert multiple master languages
 */
export const bulkCreateLanguageController = asyncHandler(async (req: Request, res: Response) => {
    // Validate that req.body is an array of languages
    const validatedData = z.array(languageValidation).parse(req.body)
    const result = await bulkCreateLanguageService(validatedData)

    return res.status(HTTPSTATUS.CREATED).json({
        success: true,
        message: 'Languages bulk inserted successfully',
        data: result, // Changed to 'data' for consistency with single create
    })
})

/**
 * Update a specific master language
 */
export const updateLanguageController = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    if (!id) throw new BadRequestException('Language ID is required')

    const validatedData = updateLanguageValidation.parse(req.body)
    const updatedLanguage = await updateLanguageService(id.toString(), validatedData)

    return res.status(HTTPSTATUS.OK).json({
        success: true,
        message: 'Language updated successfully',
        data: updatedLanguage,
    })
})

/**
 * Get a single language by its ID
 */
export const getLanguageByIdController = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    if (!id) throw new BadRequestException('Language ID is required')

    const language = await getLanguageByIdService(id.toString())

    return res.status(HTTPSTATUS.OK).json({
        success: true,
        message: 'Language retrieved successfully',
        data: language,
    })
})

/**
 * Delete a language from master data
 */
export const deleteLanguageController = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    if (!id) throw new BadRequestException('Language ID is required')

    await deleteLanguageService(id.toString())

    return res.status(HTTPSTATUS.OK).json({
        success: true,
        message: 'Language deleted successfully',
    })
})
