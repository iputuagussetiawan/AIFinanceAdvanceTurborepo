import { v2 as cloudinary } from 'cloudinary'

import { BadRequestException, NotFoundException } from '../../utils/appError'
import MemberModel from '../member/member.model'
import UserModel from './user.model'
import type { UpdateUserInputType } from './user.validation'

// ─── Private Helpers ─────────────────────────────────────────────────────────

function extractCloudinaryPublicId(url: string): string | null {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/)
    return match ? match[1] : null
}

async function deleteCloudinaryImage(url: string) {
    const publicId = extractCloudinaryPublicId(url)
    if (!publicId) return
    try {
        await cloudinary.uploader.destroy(publicId, { invalidate: true })
    } catch {}
}

async function findUserAndMember(userId: string) {
    const [user, member] = await Promise.all([
        UserModel.findById(userId),
        MemberModel.findOne({ userId }).populate('role'),
    ])
    if (!user) throw new NotFoundException('User not found')
    if (!member) throw new BadRequestException('User or Member record not found')
    return { user, member }
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const UserService = {
    getCurrentUser: async (userId: string) => {
        const member = await MemberModel.findOne({ userId })
            .populate({ path: 'userId', select: '-password -__v' })
            .populate('role')

        if (!member) throw new BadRequestException('User or Member record not found')

        const { userId: user, role, joinedAt } = member.toJSON()
        return { user, role, joinedAt }
    },

    updateProfile: async (userId: string, body: UpdateUserInputType) => {
        const { user, member } = await findUserAndMember(userId)

        const { firstName, lastName, bio, phoneNumber, address, website, birthday } = body
        if (firstName !== undefined) user.firstName = firstName
        if (lastName !== undefined) user.lastName = lastName
        if (bio !== undefined) user.bio = bio
        if (phoneNumber !== undefined) user.phoneNumber = phoneNumber
        if (address !== undefined) user.address = address
        if (website !== undefined) user.website = website
        if (birthday !== undefined) user.birthday = birthday ? new Date(birthday) : undefined

        await user.save()
        return { user: user.toJSON(), role: member.role, joinedAt: member.joinedAt }
    },

    updatePhoto: async (userId: string, profilePic?: Express.Multer.File) => {
        const { user, member } = await findUserAndMember(userId)

        if (profilePic) {
            if (user.profilePicture?.includes('cloudinary')) {
                await deleteCloudinaryImage(user.profilePicture)
            }
            user.profilePicture = profilePic.path
        }

        await user.save()
        return { user: user.toJSON(), role: member.role, joinedAt: member.joinedAt }
    },
}
