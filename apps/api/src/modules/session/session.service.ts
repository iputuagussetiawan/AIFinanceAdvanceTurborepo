import { NotFoundException } from '../../utils/appError'
import MemberModel from '../member/member.model'
import SessionModel from './session.model'

export const getAllSessionService = async (userId: string) => {
    const sessions = await SessionModel.find(
        {
            userId,
            expiredAt: { $gt: Date.now() },
        },
        {
            _id: 1,
            userId: 1,
            userAgent: 1,
            createdAt: 1,
            expiredAt: 1,
        },
        {
            sort: {
                createdAt: -1,
            },
        },
    )
    return {
        sessions,
    }
}

export const getSessionByIdService = async (sessionId: string, userId: string) => {
    const [session, member] = await Promise.all([
        SessionModel.findById(sessionId)
            .populate({ path: 'userId', select: '-password -__v' })
            .select('-expiresAt'),
        MemberModel.findOne({ userId }).populate({ path: 'role', select: 'name permissions' }),
    ])

    if (!session || !session.userId) {
        throw new NotFoundException('Session or User not found')
    }

    const user = session.toJSON().userId as any
    const memberObj = member?.toJSON() || null

    return {
        user: {
            ...user,
            role: memberObj?.role || null,
        },
    }
}

export const deleteSessionService = async (sessionId: string, userId: string) => {
    const deletedSession = await SessionModel.findByIdAndDelete({
        _id: sessionId,
        userId: userId,
    })
    if (!deletedSession) {
        throw new NotFoundException('Session not found')
    }
    return
}
