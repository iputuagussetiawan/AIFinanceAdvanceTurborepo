import { Request, Response } from 'express'

import { HTTPSTATUS } from '../../config/http.config'
import { asyncHandler } from '../../middlewares/asyncHandler.middleware'
import * as SkillService from './skill.service'
import { createSkillSchema, updateSkillSchema } from './skill.validation'

/**
 * Search skills tanpa pagination — untuk AutoSuggest/dropdown
 */
export const searchSkillsController = asyncHandler(async (req: Request, res: Response) => {
    const search = req.query.search as string | undefined
    const category = req.query.category as string | undefined

    const data = await SkillService.searchSkillsService(search, category)

    return res.status(HTTPSTATUS.OK).json({
        message: 'Skills retrieved successfully',
        data,
    })
})

/**
 * Mendapatkan daftar skill dengan filter & pagination — untuk Admin Panel
 */
export const getSkillsController = asyncHandler(async (req: Request, res: Response) => {
    const result = await SkillService.getSkillsService(req.query)

    return res.status(HTTPSTATUS.OK).json({
        message: 'Skills retrieved successfully',
        ...result,
    })
})

/**
 * Mendapatkan detail skill by ID
 */
export const getSkillByIdController = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params

    const skill = await SkillService.getSkillByIdService(id.toString())

    return res.status(HTTPSTATUS.OK).json({
        message: 'Skill retrieved successfully',
        skill: skill.toJSON(),
    })
})

/**
 * Membuat skill baru
 */
export const createSkillController = asyncHandler(async (req: Request, res: Response) => {
    const body = createSkillSchema.parse(req.body)

    const skill = await SkillService.createSkillService(body)

    return res.status(HTTPSTATUS.CREATED).json({
        message: 'Skill created successfully',
        skill: skill.toJSON(),
    })
})

/**
 * Mengupdate data skill
 */
export const updateSkillController = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const body = updateSkillSchema.parse(req.body)

    const skill = await SkillService.updateSkillService(id.toString(), body)

    return res.status(HTTPSTATUS.OK).json({
        message: 'Skill updated successfully',
        skill: skill.toJSON(),
    })
})

/**
 * Soft delete skill by ID
 */
export const deleteSkillController = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params

    await SkillService.deleteSkillService(id.toString())

    return res.status(HTTPSTATUS.OK).json({
        message: 'Skill deleted successfully',
    })
})

/**
 * Hard delete skill by ID — permanent
 */
export const hardDeleteSkillController = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params

    await SkillService.hardDeleteSkillService(id.toString())

    return res.status(HTTPSTATUS.OK).json({
        message: 'Skill permanently deleted',
    })
})

/**
 * Bulk insert skills — untuk seeding dari SKILL_DATA
 */
export const bulkCreateSkillController = asyncHandler(async (req: Request, res: Response) => {
    const skills = await SkillService.bulkCreateSkillService(req.body)

    return res.status(HTTPSTATUS.CREATED).json({
        message: `${skills.length} skills imported successfully`,
        skills,
    })
})

/**
 * Bulk soft delete skills
 */
export const bulkDeleteSkillController = asyncHandler(async (req: Request, res: Response) => {
    const { ids } = req.body

    if (!Array.isArray(ids)) {
        return res.status(HTTPSTATUS.BAD_REQUEST).json({
            message: 'ids must be an array of skill IDs',
        })
    }

    const count = await SkillService.bulkDeleteSkillService(ids)

    return res.status(HTTPSTATUS.OK).json({
        message: `${count} skills deleted successfully`,
    })
})

/**
 * Bulk hard delete skills — permanent
 */
export const bulkHardDeleteSkillController = asyncHandler(async (req: Request, res: Response) => {
    const { ids } = req.body

    if (!Array.isArray(ids)) {
        return res.status(HTTPSTATUS.BAD_REQUEST).json({
            message: 'ids must be an array of skill IDs',
        })
    }

    const count = await SkillService.bulkHardDeleteSkillService(ids)

    return res.status(HTTPSTATUS.OK).json({
        message: `${count} skills permanently deleted`,
    })
})
