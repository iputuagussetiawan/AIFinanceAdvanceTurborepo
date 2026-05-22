import { Request, Response } from 'express'

import { HTTPSTATUS } from '../../config/http.config'
import { asyncHandler } from '../../middlewares/asyncHandler.middleware'
import { UserService } from './user.service'
import { updateUserSchema } from './user.validation'

export const UserController = {
    getCurrentUser: asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?._id
        const { user, role, joinedAt } = await UserService.getCurrentUser(userId)
        return res.status(HTTPSTATUS.OK).json({ message: 'User fetch successfully', user, role, joinedAt })
    }),

    updateUser: asyncHandler(async (req: Request, res: Response) => {
        const body = updateUserSchema.parse(req.body)
        const userId = req.user?._id
        const profilePic = req.file
        const { user, role, joinedAt } = await UserService.updateUser(userId, body, profilePic)
        return res.status(HTTPSTATUS.OK).json({ message: 'User profile updated successfully', user, role, joinedAt })
    }),

    updateUserProfile: asyncHandler(async (req: Request, res: Response) => {
        const body = updateUserSchema.parse(req.body)
        const userId = req.user?._id
        const { user, role, joinedAt } = await UserService.updateUserProfile(userId, body)
        return res.status(HTTPSTATUS.OK).json({ message: 'User profile updated successfully', user, role, joinedAt })
    }),

    updateUserPhotoProfile: asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?._id
        const profilePic = req.file
        const { user, role, joinedAt } = await UserService.updateUserPhotoProfile(userId, profilePic)
        return res.status(HTTPSTATUS.OK).json({ message: 'User profile updated successfully', user, role, joinedAt })
    }),
}
