import { Request, Response, NextFunction } from 'express'

import { HTTPSTATUS } from '../config/http.config'
import UserModel from '../modules/user/user.model'

export const requireRole = (...allowedRoles: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
        const user = req.user as any
        if (!user) {
            return res.status(HTTPSTATUS.UNAUTHORIZED).json({ message: 'Unauthorized' })
        }

        const userDoc = await UserModel.findById(user._id).populate('role')
        if (!userDoc?.role) {
            return res.status(HTTPSTATUS.FORBIDDEN).json({ message: 'No role assigned' })
        }

        const role = userDoc.role as any
        const roleName: string = role?.name ?? role

        if (!allowedRoles.includes(roleName)) {
            return res.status(HTTPSTATUS.FORBIDDEN).json({ message: 'Insufficient permissions' })
        }

        next()
    }
