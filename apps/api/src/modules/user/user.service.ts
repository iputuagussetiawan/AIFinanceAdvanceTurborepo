import { v2 as cloudinary } from 'cloudinary'

import { BadRequestException, NotFoundException } from '../../utils/appError'
import UserModel from './user.model'
import type { UpdateUserInputType } from './user.validation'

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

async function findUser(userId: string) {
    const user = await UserModel.findById(userId).populate('role')
    if (!user) throw new NotFoundException('User not found')
    return user
}

export const UserService = {
    getCurrentUser: async (userId: string) => {
        const user = await UserModel.findById(userId)
            .populate({ path: 'role', select: 'name permissions' })
            .select('-password -__v')
        if (!user) throw new NotFoundException('User not found')
        const { role, joinedAt, ...rest } = user.toJSON() as any
        return { user: rest, role, joinedAt }
    },

    updateProfile: async (userId: string, body: UpdateUserInputType) => {
        const user = await findUser(userId)

        const { firstName, lastName, bio, phoneNumber, address, website, birthday } = body
        if (firstName !== undefined) user.firstName = firstName
        if (lastName !== undefined) user.lastName = lastName
        if (bio !== undefined) user.bio = bio
        if (phoneNumber !== undefined) user.phoneNumber = phoneNumber
        if (address !== undefined) user.address = address
        if (website !== undefined) user.website = website
        if (birthday !== undefined) user.birthday = birthday ? new Date(birthday) : undefined

        await user.save()
        const { role, joinedAt, ...rest } = user.toJSON() as any
        return { user: rest, role, joinedAt }
    },

    updatePhoto: async (userId: string, profilePic?: Express.Multer.File) => {
        const user = await findUser(userId)

        if (profilePic) {
            if (user.profilePicture?.includes('cloudinary')) {
                await deleteCloudinaryImage(user.profilePicture)
            }
            user.profilePicture = profilePic.path
        }

        await user.save()
        const { role, joinedAt, ...rest } = user.toJSON() as any
        return { user: rest, role, joinedAt }
    },
}
