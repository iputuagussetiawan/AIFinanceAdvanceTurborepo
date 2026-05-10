import type { NextFunction, Request, Response } from 'express'
import z from 'zod'

import { HTTPSTATUS } from '../../config/http.config'
import { asyncHandler } from '../../middlewares/asyncHandler.middleware'
import { BadRequestException } from '../../utils/appError'
import {
    bulkCreateInstitutionService,
    createInstitutionService,
    deleteInstitutionService,
    getInstitutionByIdService,
    getInstitutionsPaginatedService,
    getInstitutionsService,
    updateInstitutionService,
} from './institution.service'
import { institutionValidation, updateInstitutionValidation } from './institution.validation'

export const getInstitutionsSimpleController = asyncHandler(async (req: Request, res: Response) => {
    const institutions = await getInstitutionsService()
    return res.status(HTTPSTATUS.OK).json({
        success: true,
        message: 'Institutions fetched successfully',
        data: institutions,
    })
})

/**
 * Mendapatkan daftar institusi dengan paginasi, pencarian, dan filter tipe
 */
export const getInstitutionsController = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 10
        const search = req.query.search as string
        const type = req.query.type as string // Filter berdasarkan university, high_school, dll

        let isActive: boolean | undefined = undefined
        if (req.query.isActive === 'true') isActive = true
        if (req.query.isActive === 'false') isActive = false

        const result = await getInstitutionsPaginatedService(page, limit, search, type, isActive)

        return res.status(HTTPSTATUS.OK).json({
            success: true,
            message: 'Successfully fetched institutions',
            ...result,
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Membuat data institusi baru
 */
export const createInstitutionController = asyncHandler(async (req: Request, res: Response) => {
    const body = institutionValidation.parse(req.body)
    const institution = await createInstitutionService(body)

    return res.status(HTTPSTATUS.CREATED).json({
        success: true,
        message: 'Institution created successfully',
        data: institution,
    })
})

/**
 * Input banyak data institusi sekaligus (Bulk Insert)
 */
export const bulkCreateInstitutionController = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = z.array(institutionValidation).parse(req.body)
    const result = await bulkCreateInstitutionService(validatedData)

    return res.status(HTTPSTATUS.CREATED).json({
        success: true,
        message: 'Institutions bulk inserted successfully',
        ...result,
    })
})

/**
 * Memperbarui data institusi spesifik
 */
export const updateInstitutionController = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = updateInstitutionValidation.parse(req.body)
    const { id } = req.params as { id: string }

    if (!id) {
        throw new BadRequestException('Institution ID is required')
    }

    const updatedInstitution = await updateInstitutionService(id, validatedData)

    return res.status(HTTPSTATUS.OK).json({
        success: true,
        message: 'Institution updated successfully',
        data: updatedInstitution,
    })
})

/**
 * Mengambil satu data institusi berdasarkan ID
 */
export const getInstitutionByIdController = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string }

    if (!id) {
        throw new BadRequestException('Institution ID is required')
    }

    const institution = await getInstitutionByIdService(id)

    return res.status(HTTPSTATUS.OK).json({
        success: true,
        message: 'Institution retrieved successfully',
        data: institution,
    })
})

/**
 * Menghapus data institusi
 */
export const deleteInstitutionController = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string }

    if (!id) {
        throw new BadRequestException('Institution ID is required')
    }

    await deleteInstitutionService(id)

    return res.status(HTTPSTATUS.OK).json({
        success: true,
        message: 'Institution deleted successfully',
    })
})
