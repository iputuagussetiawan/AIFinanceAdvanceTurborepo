import type { Request, Response } from 'express'
import z from 'zod'

import { HTTPSTATUS } from '../../config/http.config'
import { asyncHandler } from '../../middlewares/asyncHandler.middleware'
import { BadRequestException } from '../../utils/appError'
import { InstitutionService } from './institution.service'
import { institutionValidation, updateInstitutionValidation } from './institution.validation'

export const InstitutionController = {
    getInstitutionsSimple: asyncHandler(async (req: Request, res: Response) => {
        const institutions = await InstitutionService.getInstitutions()
        return res.status(HTTPSTATUS.OK).json({ success: true, message: 'Institutions fetched successfully', data: institutions })
    }),

    getInstitutions: asyncHandler(async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 10
        const search = req.query.search as string
        const type = req.query.type as string

        let isActive: boolean | undefined = undefined
        if (req.query.isActive === 'true') isActive = true
        if (req.query.isActive === 'false') isActive = false

        const result = await InstitutionService.getInstitutionsPaginated(page, limit, search, type, isActive)

        return res.status(HTTPSTATUS.OK).json({ success: true, message: 'Successfully fetched institutions', ...result })
    }),

    createInstitution: asyncHandler(async (req: Request, res: Response) => {
        const body = institutionValidation.parse(req.body)
        const institution = await InstitutionService.createInstitution(body)

        return res.status(HTTPSTATUS.CREATED).json({ success: true, message: 'Institution created successfully', data: institution })
    }),

    bulkCreateInstitution: asyncHandler(async (req: Request, res: Response) => {
        const validatedData = z.array(institutionValidation).parse(req.body)
        const result = await InstitutionService.bulkCreateInstitution(validatedData)

        return res.status(HTTPSTATUS.CREATED).json({ success: true, message: 'Institutions bulk inserted successfully', ...result })
    }),

    updateInstitution: asyncHandler(async (req: Request, res: Response) => {
        const validatedData = updateInstitutionValidation.parse(req.body)
        const { id } = req.params as { id: string }
        if (!id) throw new BadRequestException('Institution ID is required')

        const updatedInstitution = await InstitutionService.updateInstitution(id, validatedData)

        return res.status(HTTPSTATUS.OK).json({ success: true, message: 'Institution updated successfully', data: updatedInstitution })
    }),

    getInstitutionById: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params as { id: string }
        if (!id) throw new BadRequestException('Institution ID is required')

        const institution = await InstitutionService.getInstitutionById(id)

        return res.status(HTTPSTATUS.OK).json({ success: true, message: 'Institution retrieved successfully', data: institution })
    }),

    deleteInstitution: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params as { id: string }
        if (!id) throw new BadRequestException('Institution ID is required')

        await InstitutionService.deleteInstitution(id)

        return res.status(HTTPSTATUS.OK).json({ success: true, message: 'Institution deleted successfully' })
    }),
}
