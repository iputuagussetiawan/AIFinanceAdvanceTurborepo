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

export const getCurrentUserService = async (userId: string) => {
    const member = await MemberModel.findOne({ userId })
        .populate({
            path: 'userId',
            select: '-password -__v',
            populate: [
                {
                    path: 'languages.language',
                    select: '-__v -createdAt -updatedAt',
                    model: 'Language',
                },
                {
                    path: 'educations.institution',
                    select: '-__v -createdAt -updatedAt',
                    model: 'Institution',
                },
            ],
        })
        .populate('role')

    if (!member) {
        throw new BadRequestException('User or Member record not found')
    }

    // Panggil toJSON agar transformasi schema di langkah #1 berjalan otomatis
    // Ini akan mengubah _id -> id di semua level (nested populate)
    const memberObj = member.toJSON()

    const userDoc = memberObj.userId

    return {
        // Karena kita sudah memanggil toJSON(), semua _id di dalam userDoc
        // dan role sudah berubah menjadi id
        user: userDoc,
        role: memberObj.role,
        joinedAt: memberObj.joinedAt,
        id: memberObj.id, // id milik record Member
    }
}

export const updateUserService = async (
    userId: string,
    body: UpdateUserInputType,
    profilePic?: Express.Multer.File,
) => {
    const user = await UserModel.findById(userId)
    if (!user) throw new NotFoundException('User not found')

    // 1. Find the Member record associated with this User ID
    // 2. Populate 'userId' but exclude the password
    // 3. Populate 'role' to get permissions/details
    const member = await MemberModel.findOne({ userId })
        .populate({
            path: 'userId',
            select: '-password',
        })
        .populate('role')

    if (!member) {
        throw new BadRequestException('User or Member record not found')
    }

    if (body.email && body.email !== user.email) {
        // Optional: Check if the new email is already taken by another user
        const existingEmail = await UserModel.findOne({ email: body.email })
        if (existingEmail) throw new BadRequestException('Email already in use')

        user.email = body.email
        user.isEmailVerified = false // Reset verification status

        // Trigger your verification function here
        const verification = await VerificationCodeModel.create({
            userId: user._id,
            type: VerificationEnum.EMAIL_VERIFICATION,
            expiresAt: fortyFiveMinutesFromNow(),
        })

        const verificationUrl = `${config.FRONTEND_ORIGIN}/confirm-account?code=${verification.code}`
        await sendEmail({
            to: user.email,
            ...verifyEmailTemplate(verificationUrl),
        })
    }

    if (profilePic) {
        if (user.profilePicture && user.profilePicture.includes('cloudinary')) {
            try {
                // Robust extraction: get everything between /upload/v12345/ and the extension
                const splitUrl = user.profilePicture.split('/')
                const lastPart = splitUrl[splitUrl.length - 1].split('.')[0]
                const folderPart = splitUrl[splitUrl.length - 2]

                // If your images are in a folder, publicId must be "folder/filename"
                const publicId = user.profilePicture.includes('upload/v')
                    ? `${folderPart}/${lastPart}`
                    : lastPart

                await cloudinary.uploader.destroy(publicId, { invalidate: true })
            } catch (error) {
                console.error('Cloudinary cleanup failed:', error)
            }
        }
        user.profilePicture = profilePic.path
    }

    user.bio = body.bio || user.bio

    if (body.password) {
        user.password = body.password // Ensure this is hashed via middleware
    }

    await user.save()
    return {
        user: member.userId,
        role: member.role,
        joinedAt: member.joinedAt,
    }
}

export const updateUserProfileService = async (userId: string, body: UpdateUserInputType) => {
    const user = await UserModel.findById(userId)
    if (!user) throw new NotFoundException('User not found')

    // 1. Find the Member record associated with this User ID
    // 2. Populate 'userId' but exclude the password
    // 3. Populate 'role' to get permissions/details
    const member = await MemberModel.findOne({ userId })
        .populate({
            path: 'userId',
            select: '-password',
        })
        .populate('role')

    if (!member) {
        throw new BadRequestException('User or Member record not found')
    }

    if (body.email && body.email !== user.email) {
        // Optional: Check if the new email is already taken by another user
        const existingEmail = await UserModel.findOne({ email: body.email })
        if (existingEmail) throw new BadRequestException('Email already in use')

        user.email = body.email
        user.isEmailVerified = false // Reset verification status

        // Trigger your verification function here
        const verification = await VerificationCodeModel.create({
            userId: user._id,
            type: VerificationEnum.EMAIL_VERIFICATION,
            expiresAt: fortyFiveMinutesFromNow(),
        })

        const verificationUrl = `${config.FRONTEND_ORIGIN}/confirm-account?code=${verification.code}`
        await sendEmail({
            to: user.email,
            ...verifyEmailTemplate(verificationUrl),
        })
    }

    const { name, firstName, lastName, jobTitle, bio, phoneNumber, address, website } = body

    user.bio = bio || user.bio

    user.firstName = firstName || user.firstName
    user.lastName = lastName || user.lastName
    user.jobTitle = jobTitle !== undefined ? jobTitle : user.jobTitle
    user.bio = bio !== undefined ? bio : user.bio
    user.phoneNumber = phoneNumber !== undefined ? phoneNumber : user.phoneNumber
    user.address = address !== undefined ? address : user.address
    user.website = website !== undefined ? website : user.website

    if (body.password) {
        user.password = body.password // Ensure this is hashed via middleware
    }

    await user.save()
    return {
        user: member.userId,
        role: member.role,
        joinedAt: member.joinedAt,
    }
}

export const updateUserPhotoProfileService = async (
    userId: string,
    profilePic?: Express.Multer.File,
) => {
    const user = await UserModel.findById(userId)
    if (!user) throw new NotFoundException('User not found')

    // 1. Find the Member record associated with this User ID
    // 2. Populate 'userId' but exclude the password
    // 3. Populate 'role' to get permissions/details
    const member = await MemberModel.findOne({ userId })
        .populate({
            path: 'userId',
            select: '-password',
        })
        .populate('role')

    if (!member) {
        throw new BadRequestException('User or Member record not found')
    }

    if (profilePic) {
        if (user.profilePicture && user.profilePicture.includes('cloudinary')) {
            try {
                // Robust extraction: get everything between /upload/v12345/ and the extension
                const splitUrl = user.profilePicture.split('/')
                const lastPart = splitUrl[splitUrl.length - 1].split('.')[0]
                const folderPart = splitUrl[splitUrl.length - 2]

                // If your images are in a folder, publicId must be "folder/filename"
                const publicId = user.profilePicture.includes('upload/v')
                    ? `${folderPart}/${lastPart}`
                    : lastPart

                await cloudinary.uploader.destroy(publicId, { invalidate: true })
            } catch (error) {
                console.error('Cloudinary cleanup failed:', error)
            }
        }
        user.profilePicture = profilePic.path
    }

    await user.save()
    return {
        user: member.userId,
        role: member.role,
        joinedAt: member.joinedAt,
    }
}
