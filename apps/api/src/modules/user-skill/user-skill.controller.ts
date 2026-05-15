import { Request, Response } from 'express'
import { z } from 'zod'

import { HTTPSTATUS } from '../../config/http.config'
import { asyncHandler } from '../../middlewares/asyncHandler.middleware'
import { BadRequestException } from '../../utils/appError'
import * as UserSkillService from './user-skill.service'
import { userSkillValidation, userSkillsArrayValidation } from './user-skill.validation'

export const UserSkillController = {
    /**
     * Update atau Tambah skill tunggal
     * PUT /api/users/skills
     */
    upsertSkill: asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?._id as string
        if (!userId) throw new BadRequestException('User authentication required')

        // Validasi body dengan Zod (Single Skill)
        const body = userSkillValidation.parse(req.body)

        const data = await UserSkillService.updateUserSkillService(userId, body)

        return res.status(HTTPSTATUS.OK).json({
            success: true,
            message: 'Skill updated successfully',
            data,
        })
    }),

    /**
     * Sinkronisasi Massal Skill (Sync/Reorder)
     * PUT /api/users/skills/bulk
     */
    bulkUpsertSkills: asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?._id as string
        if (!userId) throw new BadRequestException('User authentication required')

        // Ambil dan validasi array menggunakan skema array
        const { skills } = req.body
        const validatedSkills = userSkillsArrayValidation.parse(skills)

        const data = await UserSkillService.bulkUpdateUserSkillsService(
            userId,
            validatedSkills,
        )

        return res.status(HTTPSTATUS.OK).json({
            success: true,
            message: 'Skill history synced successfully',
            data,
        })
    }),

    /**
     * Hapus satu entri skill
     * DELETE /api/users/skills/:entryId
     */
    removeSkill: asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?._id as string
        if (!userId) throw new BadRequestException('User authentication required')

        const { entryId } = req.params
        if (!entryId) throw new BadRequestException('Skill entry ID is required')

        const data = await UserSkillService.removeUserSkillService(
            userId,
            entryId.toString(),
        )

        return res.status(HTTPSTATUS.OK).json({
            success: true,
            message: 'Skill entry removed from profile',
            data,
        })
    }),

    /**
     * Hapus banyak entri skill sekaligus (Opsional jika dibutuhkan)
     * DELETE /api/users/skills/bulk
     */
    bulkRemoveSkills: asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?._id as string
        if (!userId) throw new BadRequestException('User authentication required')

        const { skillIds } = req.body
        const validatedIds = z.array(z.string()).parse(skillIds)

        // Asumsi Anda sudah mengimplementasikan bulkRemove di service
        // Jika belum, fungsi ini bisa ditambahkan nanti sesuai kebutuhan
        const data = await UserSkillService.bulkRemoveUserSkillsService(userId, validatedIds)

        return res.status(HTTPSTATUS.OK).json({
            success: true,
            message: 'Selected skill entries removed',
            data,
        })
    }),
}