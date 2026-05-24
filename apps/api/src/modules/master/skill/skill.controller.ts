import { Request, Response } from 'express'

import { HTTPSTATUS } from '../../../config/http.config'
import { asyncHandler } from '../../../middlewares/asyncHandler.middleware'
import { SkillService } from './skill.service'
import { createSkillSchema, updateSkillSchema } from './skill.validation'

export const SkillController = {
    searchSkills: asyncHandler(async (req: Request, res: Response) => {
        const search = req.query.search as string | undefined
        const category = req.query.category as string | undefined

        const data = await SkillService.searchSkills(search, category)

        return res.status(HTTPSTATUS.OK).json({ message: 'Skills retrieved successfully', data })
    }),

    getSkills: asyncHandler(async (req: Request, res: Response) => {
        const result = await SkillService.getSkills(req.query)

        return res.status(HTTPSTATUS.OK).json({ message: 'Skills retrieved successfully', ...result })
    }),

    getSkillById: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params
        const skill = await SkillService.getSkillById(id.toString())

        return res.status(HTTPSTATUS.OK).json({ message: 'Skill retrieved successfully', skill: skill.toJSON() })
    }),

    createSkill: asyncHandler(async (req: Request, res: Response) => {
        const body = createSkillSchema.parse(req.body)
        const skill = await SkillService.createSkill(body)

        return res.status(HTTPSTATUS.CREATED).json({ message: 'Skill created successfully', skill: skill.toJSON() })
    }),

    updateSkill: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params
        const body = updateSkillSchema.parse(req.body)
        const skill = await SkillService.updateSkill(id.toString(), body)

        return res.status(HTTPSTATUS.OK).json({ message: 'Skill updated successfully', skill: skill.toJSON() })
    }),

    deleteSkill: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params
        await SkillService.deleteSkill(id.toString())

        return res.status(HTTPSTATUS.OK).json({ message: 'Skill deleted successfully' })
    }),

    hardDeleteSkill: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params
        await SkillService.hardDeleteSkill(id.toString())

        return res.status(HTTPSTATUS.OK).json({ message: 'Skill permanently deleted' })
    }),

    bulkCreateSkill: asyncHandler(async (req: Request, res: Response) => {
        const skills = await SkillService.bulkCreateSkill(req.body)

        return res.status(HTTPSTATUS.CREATED).json({ message: `${skills.length} skills imported successfully`, skills })
    }),

    bulkDeleteSkill: asyncHandler(async (req: Request, res: Response) => {
        const { ids } = req.body

        if (!Array.isArray(ids)) {
            return res.status(HTTPSTATUS.BAD_REQUEST).json({ message: 'ids must be an array of skill IDs' })
        }

        const count = await SkillService.bulkDeleteSkill(ids)

        return res.status(HTTPSTATUS.OK).json({ message: `${count} skills deleted successfully` })
    }),

    bulkHardDeleteSkill: asyncHandler(async (req: Request, res: Response) => {
        const { ids } = req.body

        if (!Array.isArray(ids)) {
            return res.status(HTTPSTATUS.BAD_REQUEST).json({ message: 'ids must be an array of skill IDs' })
        }

        const count = await SkillService.bulkHardDeleteSkill(ids)

        return res.status(HTTPSTATUS.OK).json({ message: `${count} skills permanently deleted` })
    }),
}
