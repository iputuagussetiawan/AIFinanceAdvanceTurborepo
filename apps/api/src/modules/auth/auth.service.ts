import mongoose from 'mongoose'

import { config } from '../../config/app.config'
import { HTTPSTATUS } from '../../config/http.config'
import { ProviderEnum } from '../../enums/account-provider.enum'
import { ErrorCodeEnum } from '../../enums/error-code.enum'
import { VerificationEnum } from '../../enums/verification-code.enum'
import { sendEmail } from '../../mailers/mailer'
import { passwordResetTemplate, verifyEmailTemplate } from '../../mailers/templates/template'
import {
    BadRequestException,
    HttpException,
    InternalServerException,
    NotFoundException,
    UnauthorizedException,
} from '../../utils/appError'
import { hashValue } from '../../utils/bcrypt'
import { anHourFromNow, fortyFiveMinutesFromNow, threeMinutesAgo } from '../../utils/date-time'
import MemberModel from '../member/member.model'
import { Roles } from '../role/role.enum'
import RoleModel from '../role/roles-permission.model'
import AccountModel from '../user/account.model'
import UserModel from '../user/user.model'
import VerificationCodeModel from '../user/verification.model'
import type { ResetPasswordDto } from './auth.validation'

export const loginOrCreateAccountService = async (data: {
    provider: string
    firstName: string
    lastName: string
    providerId: string
    picture?: string
    email?: string
}) => {
    const { providerId, provider, firstName, lastName, email, picture } = data
    const session = await mongoose.startSession()
    try {
        session.startTransaction()
        console.log('Started Session...')

        //check user on db
        let user = await UserModel.findOne({ email }).session(session)

        //jika tidak ada user, maka buat user baru
        if (!user) {
            //buat user baru
            user = new UserModel({
                email,
                firstName: firstName,
                lastName: lastName,
                profilePicture: picture || null,
                isEmailVerified: true,
            })
            await user.save({ session })

            //buat akun baru
            const account = new AccountModel({
                userId: user._id,
                provider: provider,
                providerId: providerId,
            })
            await account.save({ session })
        } else {
            // 4. Update existing user's lastLogin field
            user.lastLogin = new Date()
            await user.save({ session })
        }
        await session.commitTransaction()
        session.endSession()
        console.log('End Session...')
        return { user }
    } catch (error) {
        await session.abortTransaction()
        throw error
    } finally {
        session.endSession()
    }
}

/**
 * Service to handle new user registration and account creation
 */
export const registerUserService = async (body: {
    email: string
    name: string
    password: string
}) => {
    const { email, name, password } = body
    // Create a Mongoose session for the transaction
    const session = await mongoose.startSession()
    try {
        // Start the atomic transaction
        session.startTransaction()
        console.log('🏁 [TRANSACTION] Registration started...')
        // 1. Search for existing user with the same email within the session
        const existingUser = await UserModel.findOne({ email }).session(session)
        // 2. If a user is found, prevent duplicate registration
        if (existingUser) {
            console.log(`⚠️[AUTH] Registration failed: Email ${email} already exists.`)
            throw new BadRequestException('Email already exists')
        }
        // 3. Initialize a new User document (middleware handles password hashing)
        const user = new UserModel({
            email,
            name,
            password,
        })
        // 4. Save the user document as part of the transaction
        await user.save({ session })

        // 5. Initialize the associated Account (Auth Provider) for the user
        const account = new AccountModel({
            userId: user._id,
            provider: ProviderEnum.EMAIL,
            providerId: email,
        })
        // 6. Save the account document as part of the transaction
        await account.save({ session })

        const guestRole = await RoleModel.findOne({
            name: Roles.GUEST,
        }).session(session)

        if (!guestRole) {
            throw new NotFoundException('Guest role not found')
        }

        const member = new MemberModel({
            userId: user._id,
            role: guestRole._id,
            joinedAt: new Date(),
        })
        await member.save({ session })

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
        console.log(`Verification URL (send this to user via email): ${verificationUrl}`)
        // 7. Commit all changes to the database permanently
        await session.commitTransaction()
        session.endSession()
        console.log('✅ [TRANSACTION] Registration successful and committed.')
        return {
            userId: user._id,
        }
    } catch (error: any) {
        await session.abortTransaction()
        console.error('❌ [TRANSACTION] Registration aborted due to error:', error.message)
        throw error
    } finally {
        session.endSession()
    }
}

export const verifyEmailService = async (code: string) => {
    // 1. Find the verification code document that matches the provided code, is of type EMAIL_VERIFICATION, and has not expired
    const validCode = await VerificationCodeModel.findOne({
        code: code,
        type: VerificationEnum.EMAIL_VERIFICATION,
        expiresAt: { $gt: new Date() },
    })

    if (!validCode) {
        throw new BadRequestException('Invalid or expired verification code')
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
        validCode.userId,
        {
            isEmailVerified: true,
        },
        { new: true },
    )

    if (!updatedUser) {
        throw new BadRequestException(
            'Unable to verify email address',
            ErrorCodeEnum.VALIDATION_ERROR,
        )
    }

    await validCode.deleteOne()
    return {
        user: updatedUser,
    }
}

export const verifyUserService = async ({
    email,
    password,
    provider = ProviderEnum.EMAIL,
}: {
    email: string
    password: string
    provider?: string
}) => {
    //check account di database dengan pencocokan email
    const account = await AccountModel.findOne({ provider, providerId: email })

    //jika account tidak ditemukan, maka tampilkan error
    if (!account) {
        throw new NotFoundException('Invalid email or password')
    }

    //check password
    const user = await UserModel.findById(account.userId)
    //jika user tidak ditemukan, maka tampilkan error
    if (!user) {
        throw new NotFoundException('User not found for the given account')
    }

    //check password
    const isMatch = await user.comparePassword(password)
    //jika password tidak cocok, maka tampilkan error
    if (!isMatch) {
        throw new UnauthorizedException('Invalid email or password')
    }
    return user.omitPassword()
}

export const verifyUserByIdService = async (userId: string) => {
    const user = await UserModel.findById(userId, {
        password: false,
    })
    return user || null
}

export const forgotPasswordService = async (email: string) => {
    const user = await UserModel.findOne({
        email: email,
    })

    if (!user) {
        throw new NotFoundException('User not found')
    }

    //check mail rate limit is 2 emails per 3 or 10 min
    const timeAgo = threeMinutesAgo()
    const maxAttempts = 2

    const count = await VerificationCodeModel.countDocuments({
        userId: user._id,
        type: VerificationEnum.PASSWORD_RESET,
        createdAt: { $gt: timeAgo },
    })

    if (count >= maxAttempts) {
        throw new HttpException(
            'Too many request, try again later',
            HTTPSTATUS.TOO_MANY_REQUESTS,
            ErrorCodeEnum.AUTH_TOO_MANY_ATTEMPTS,
        )
    }

    const expiresAt = anHourFromNow()
    const validCode = await VerificationCodeModel.create({
        userId: user._id,
        type: VerificationEnum.PASSWORD_RESET,
        expiresAt,
    })

    const resetLink = `${config.FRONTEND_ORIGIN}/reset-password?code=${validCode.code}&exp=${expiresAt.getTime()}`

    const { data, error } = await sendEmail({
        to: user.email,
        ...passwordResetTemplate(resetLink),
    })

    if (!data?.id) {
        throw new InternalServerException(`From Email :${error?.name} ${error?.message}`)
    }

    return {
        url: resetLink,
        emailId: data.id,
    }
}

export const resetPasswordService = async ({ password, verificationCode }: ResetPasswordDto) => {
    const validCode = await VerificationCodeModel.findOne({
        code: verificationCode,
        type: VerificationEnum.PASSWORD_RESET,
        expiresAt: { $gt: new Date() },
    })
    if (!validCode) {
        throw new NotFoundException('Invalid or expired verification code')
    }
    const hashedPassword = await hashValue(password)
    const updatedUser = await UserModel.findByIdAndUpdate(validCode.userId, {
        password: hashedPassword,
    })
    if (!updatedUser) {
        throw new BadRequestException('Failed to reset password!')
    }
    await validCode.deleteOne()
    return {
        user: updatedUser,
    }
}
