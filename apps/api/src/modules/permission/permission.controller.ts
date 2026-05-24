import { Request, Response } from 'express'
import { z } from 'zod'

import { HTTPSTATUS } from '../../config/http.config'
import { asyncHandler } from '../../middlewares/asyncHandler.middleware'
import { PermissionService } from './permission.service'

const createPermissionSchema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
})

export const PermissionController = {
    findAll: asyncHandler(async (_req: Request, res: Response) => {
        const data = await PermissionService.findAll()
        return res.status(HTTPSTATUS.OK).json({ message: 'Permissions retrieved', data })
    }),

    findOne: asyncHandler(async (req: Request, res: Response) => {
        const perm = await PermissionService.findById(req.params.id)
        return res.status(HTTPSTATUS.OK).json({ message: 'Permission retrieved', data: perm })
    }),

    create: asyncHandler(async (req: Request, res: Response) => {
        const body = createPermissionSchema.parse(req.body)
        const perm = await PermissionService.create(body)
        return res.status(HTTPSTATUS.CREATED).json({ message: 'Permission created', data: perm })
    }),

    update: asyncHandler(async (req: Request, res: Response) => {
        const body = createPermissionSchema.partial().parse(req.body)
        const perm = await PermissionService.update(req.params.id, body)
        return res.status(HTTPSTATUS.OK).json({ message: 'Permission updated', data: perm })
    }),

    remove: asyncHandler(async (req: Request, res: Response) => {
        const result = await PermissionService.remove(req.params.id)
        return res.status(HTTPSTATUS.OK).json(result)
    }),
}
