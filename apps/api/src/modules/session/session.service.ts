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

export const getSessionByIdService = async (sessionId: string) => {
    // 1. Fetch Session and Populate User (Strictly exclude password)
    const session = await SessionModel.findById(sessionId)
        .populate({
            path: 'userId',
            select: '-password -__v', // 👈 Password excluded here
            populate: [
                {
                    path: 'languages.language',
                    select: '-__v -createdAt -updatedAt',
                    model: 'Language',
                },
                {
                    path: 'educations.institution', // Populating the institution inside educations
                    select: '-__v -createdAt -updatedAt',
                    model: 'Institution', // Ensure this matches your Institution model name
                },
                {
                    path: 'experiences.company', // Populating the company inside experiences
                    select: '-__v -createdAt -updatedAt',
                    model: 'Company', // Ensure this matches your Company model name
                },
                {
                    path: 'skills.skill', // Populating the skill inside skills
                    select: '-__v -createdAt -updatedAt',
                    model: 'Skill', // Ensure this matches your Skill model name
                },
            ],
        })
        .select('-expiresAt')

    if (!session || !session.userId) {
        throw new NotFoundException('Session or User not found')
    }

    const sessionObj = session.toJSON()
    const user = sessionObj.userId as any

    const member = await MemberModel.findOne({ userId: user.id }) // user.id sudah string
        .populate({ path: 'role', select: 'name permissions' })

    const memberObj = member?.toJSON() || null

    // 3. Merge and return
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
