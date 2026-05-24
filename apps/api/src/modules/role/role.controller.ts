import { Request, Response } from 'express'
import { z } from 'zod'

import { HTTPSTATUS } from '../../config/http.config'
import { asyncHandler } from '../../middlewares/asyncHandler.middleware'
import { RoleService } from './role.service'

const createRoleSchema = z.object({
    name: z.string().min(1).max(50),
    description: z.string().optional(),
})

const assignPermissionsSchema = z.object({
    permissions: z.array(z.string()),
})

const assignRoleSchema = z.object({
    roleId: z.string().min(1),
})

export const RoleController = {
    findAll: asyncHandler(async (_req: Request, res: Response) => {
        const data = await RoleService.findAll()
        return res.status(HTTPSTATUS.OK).json({ message: 'Roles retrieved', data })
    }),

    findOne: asyncHandler(async (req: Request, res: Response) => {
        const role = await RoleService.findById(req.params.id)
        return res.status(HTTPSTATUS.OK).json({ message: 'Role retrieved', data: role })
    }),

    getRolePermissions: asyncHandler(async (req: Request, res: Response) => {
        const data = await RoleService.getRolePermissions(req.params.id)
        return res.status(HTTPSTATUS.OK).json({ message: 'Permissions retrieved', data })
    }),

    create: asyncHandler(async (req: Request, res: Response) => {
        const body = createRoleSchema.parse(req.body)
        const role = await RoleService.create(body)
        return res.status(HTTPSTATUS.CREATED).json({ message: 'Role created', data: role })
    }),

    update: asyncHandler(async (req: Request, res: Response) => {
        const body = createRoleSchema.partial().parse(req.body)
        const role = await RoleService.update(req.params.id, body)
        return res.status(HTTPSTATUS.OK).json({ message: 'Role updated', data: role })
    }),

    remove: asyncHandler(async (req: Request, res: Response) => {
        const result = await RoleService.remove(req.params.id)
        return res.status(HTTPSTATUS.OK).json(result)
    }),

    assignPermissions: asyncHandler(async (req: Request, res: Response) => {
        const { permissions } = assignPermissionsSchema.parse(req.body)
        const result = await RoleService.assignPermissions(req.params.id, permissions as any)
        return res.status(HTTPSTATUS.OK).json(result)
    }),

    assignRoleToUser: asyncHandler(async (req: Request, res: Response) => {
        const { roleId } = assignRoleSchema.parse(req.body)
        const result = await RoleService.assignRoleToUser(req.params.userId, roleId)
        return res.status(HTTPSTATUS.OK).json(result)
    }),

    removeRoleFromUser: asyncHandler(async (req: Request, res: Response) => {
        const result = await RoleService.removeRoleFromUser(req.params.userId)
        return res.status(HTTPSTATUS.OK).json(result)
    }),

    getUserRoles: asyncHandler(async (req: Request, res: Response) => {
        const data = await RoleService.getUserRoles(req.params.userId)
        return res.status(HTTPSTATUS.OK).json({ message: 'User roles retrieved', data })
    }),
}
