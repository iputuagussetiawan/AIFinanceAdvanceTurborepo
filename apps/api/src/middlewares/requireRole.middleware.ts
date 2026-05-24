import { Request, Response, NextFunction } from 'express'

import { HTTPSTATUS } from '../config/http.config'
import MemberModel from '../modules/member/member.model'
import RoleModel from '../modules/role/roles-permission.model'
export const requireRole = (...allowedRoles: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
        const user = req.user as any
        if (!user) {
            return res.status(HTTPSTATUS.UNAUTHORIZED).json({ message: 'Unauthorized' })
        }

        const member = await MemberModel.findOne({ userId: user._id }).populate('role')
        if (!member) {
            return res.status(HTTPSTATUS.FORBIDDEN).json({ message: 'No role assigned' })
        }

        const role = member.role as any
        const roleName: string = role?.name ?? role

        if (!allowedRoles.includes(roleName)) {
            return res.status(HTTPSTATUS.FORBIDDEN).json({ message: 'Insufficient permissions' })
        }

        next()
    }
