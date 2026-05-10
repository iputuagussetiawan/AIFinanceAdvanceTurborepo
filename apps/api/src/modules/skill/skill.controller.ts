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
 * Membuat skill baru
 */
export const createSkillController = asyncHandler(async (req: Request, res: Response) => {
    const body = createSkillSchema.parse(req.body)

    const skill = await SkillService.createSkillService(body)

    return res.status(HTTPSTATUS.CREATED).json({
        message: 'Skill created successfully',
        skill,
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
        skill,
    })
})

/**
 * Soft delete skill
 */
export const deleteSkillController = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params

    await SkillService.deleteSkillService(id.toString())

    return res.status(HTTPSTATUS.OK).json({
        message: 'Skill deleted successfully',
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