import { v2 as cloudinary } from 'cloudinary'

import { config } from '../../config/app.config'
import { VerificationEnum } from '../../enums/verification-code.enum'
import { sendEmail } from '../../mailers/mailer'
import { verifyEmailTemplate } from '../../mailers/templates/template'
import { BadRequestException, NotFoundException } from '../../utils/appError'
import { fortyFiveMinutesFromNow } from '../../utils/date-time'
import MemberModel from '../member/member.model'
import UserModel from './user.model'
import type { UpdateUserInputType } from './user.validation'
import VerificationCodeModel from './verification.model'

function extractCloudinaryPublicId(url: string): string | null {
    // matches: .../upload/v123456/folder/filename.ext  or  .../upload/folder/filename.ext
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/)
    return match ? match[1] : null
}

async function deleteCloudinaryImage(url: string) {
    const publicId = extractCloudinaryPublicId(url)
    if (!publicId) return
    try {
        await cloudinary.uploader.destroy(publicId, { invalidate: true })
    } catch (error) {
        console.error('Cloudinary cleanup failed:', error)
    }
}

async function handleEmailChange(user: any, newEmail: string) {
    const existingEmail = await UserModel.findOne({ email: newEmail })
    if (existingEmail) throw new BadRequestException('Email already in use')

    user.email = newEmail
    user.isEmailVerified = false

    const verification = await VerificationCodeModel.create({
        userId: user._id,
        type: VerificationEnum.EMAIL_VERIFICATION,
        expiresAt: fortyFiveMinutesFromNow(),
    })
    const verificationUrl = `${config.FRONTEND_ORIGIN}/confirm-account?code=${verification.code}`
    await sendEmail({ to: newEmail, ...verifyEmailTemplate(verificationUrl) })
}

export const getCurrentUserService = async (userId: string) => {
    const member = await MemberModel.findOne({ userId })
        .populate({ path: 'userId', select: '-password -__v' })
        .populate('role')

    if (!member) {
        throw new BadRequestException('User or Member record not found')
    }

    const memberObj = member.toJSON()
    return {
        user: memberObj.userId,
        role: memberObj.role,
        joinedAt: memberObj.joinedAt,
        id: memberObj.id,
    }
}

export const updateUserService = async (
    userId: string,
    body: UpdateUserInputType,
    profilePic?: Express.Multer.File,
) => {
    const [user, member] = await Promise.all([
        UserModel.findById(userId),
        MemberModel.findOne({ userId }).populate('role'),
    ])

    if (!user) throw new NotFoundException('User not found')
    if (!member) throw new BadRequestException('User or Member record not found')

    if (body.email && body.email !== user.email) {
        await handleEmailChange(user, body.email)
    }

    if (profilePic) {
        if (user.profilePicture?.includes('cloudinary')) {
            await deleteCloudinaryImage(user.profilePicture)
        }
        user.profilePicture = profilePic.path
    }

    if (body.firstName !== undefined) user.firstName = body.firstName
    if (body.lastName !== undefined) user.lastName = body.lastName
    if (body.bio !== undefined) user.bio = body.bio
    if (body.phoneNumber !== undefined) user.phoneNumber = body.phoneNumber
    if (body.address !== undefined) user.address = body.address
    if (body.website !== undefined) user.website = body.website
    if (body.birthday !== undefined) user.birthday = body.birthday ? new Date(body.birthday) : undefined

    if (body.password) {
        user.password = body.password
    }

    await user.save()

    return {
        user: user.toObject(),
        role: member.role,
        joinedAt: member.joinedAt,
    }
}

export const updateUserProfileService = async (userId: string, body: UpdateUserInputType) => {
    const [user, member] = await Promise.all([
        UserModel.findById(userId),
        MemberModel.findOne({ userId }).populate('role'),
    ])

    if (!user) throw new NotFoundException('User not found')
    if (!member) throw new BadRequestException('User or Member record not found')

    const { firstName, lastName, bio, phoneNumber, address, website, birthday } = body

    if (firstName !== undefined) user.firstName = firstName
    if (lastName !== undefined) user.lastName = lastName
    if (bio !== undefined) user.bio = bio
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber
    if (address !== undefined) user.address = address
    if (website !== undefined) user.website = website
    if (birthday !== undefined) user.birthday = birthday ? new Date(birthday) : undefined

    await user.save()

    return {
        user: user.toObject(),
        role: member.role,
        joinedAt: member.joinedAt,
    }
}

export const updateUserPhotoProfileService = async (
    userId: string,
    profilePic?: Express.Multer.File,
) => {
    const [user, member] = await Promise.all([
        UserModel.findById(userId),
        MemberModel.findOne({ userId }).populate('role'),
    ])

    if (!user) throw new NotFoundException('User not found')
    if (!member) throw new BadRequestException('User or Member record not found')

    if (profilePic) {
        if (user.profilePicture?.includes('cloudinary')) {
            await deleteCloudinaryImage(user.profilePicture)
        }
        user.profilePicture = profilePic.path
    }

    await user.save()

    return {
        user: user.toObject(),
        role: member.role,
        joinedAt: member.joinedAt,
    }
}
