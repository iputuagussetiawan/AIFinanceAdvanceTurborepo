import type { Request, Response } from 'express'
import z from 'zod'

import { HTTPSTATUS } from '../../config/http.config'
import { asyncHandler } from '../../middlewares/asyncHandler.middleware'
import { NotFoundException } from '../../utils/appError'
import {
    deleteSessionService,
    getAllSessionService,
    getSessionByIdService,
} from './session.service'

export const getAllSession = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id
    const sessionId = req.sessionId
    const { sessions } = await getAllSessionService(userId)
    const modifySessions = sessions.map((session) => ({
        ...session.toObject(),
        ...(session.id === sessionId && {
            isCurrent: true,
        }),
    }))
    return res.status(HTTPSTATUS.OK).json({
        message: 'Retrieved all session successfully',
        sessions: modifySessions,
    })
})

export const getSession = asyncHandler(async (req: Request, res: Response) => {
    const sessionId = req?.sessionId
    const userId = req.user?._id
    if (!sessionId) {
        throw new NotFoundException('Session ID not found. Please log in.')
    }
    const { user } = await getSessionByIdService(sessionId, userId)
    return res.status(HTTPSTATUS.OK).json({
        message: 'Session retrieved successfully',
        user,
    })
})

export const deleteSession = asyncHandler(async (req: Request, res: Response) => {
    const sessionId = z.string().parse(req.params.id)
    const userId = req.user?._id
    await deleteSessionService(sessionId, userId)
    return res.status(HTTPSTATUS.OK).json({
        message: 'Session remove successfully',
    })
})
