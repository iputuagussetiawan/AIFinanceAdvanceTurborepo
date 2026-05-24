import type { Request, Response } from 'express'
import z from 'zod'

import { HTTPSTATUS } from '../../config/http.config'
import { asyncHandler } from '../../middlewares/asyncHandler.middleware'
import { NotFoundException } from '../../utils/appError'
import { SessionService } from './session.service'

export const SessionController = {
    getAllSessions: asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?._id
        const sessionId = req.sessionId
        const { sessions } = await SessionService.getAllSessions(userId)
        const modifySessions = sessions.map((session) => ({
            ...session.toObject(),
            ...(session.id === sessionId && { isCurrent: true }),
        }))
        return res.status(HTTPSTATUS.OK).json({ message: 'Retrieved all session successfully', sessions: modifySessions })
    }),

    getSession: asyncHandler(async (req: Request, res: Response) => {
        const sessionId = req?.sessionId
        const userId = req.user?._id
        if (!sessionId) throw new NotFoundException('Session ID not found. Please log in.')

        const { user } = await SessionService.getSessionById(sessionId, userId)
        return res.status(HTTPSTATUS.OK).json({ message: 'Session retrieved successfully', user })
    }),

    deleteSession: asyncHandler(async (req: Request, res: Response) => {
        const sessionId = z.string().parse(req.params.id)
        const userId = req.user?._id
        await SessionService.deleteSession(sessionId, userId)
        return res.status(HTTPSTATUS.OK).json({ message: 'Session remove successfully' })
    }),
}
