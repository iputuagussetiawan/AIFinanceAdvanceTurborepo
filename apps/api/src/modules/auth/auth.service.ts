import mongoose from 'mongoose'

import { config } from '../../config/app.config'
import { ProviderEnum } from '../../enums/account-provider.enum'
import { HTTPSTATUS } from '../../config/http.config'
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
import RoleModel from '../role/roles-permission.model'
import SessionModel from '../session/session.model'
import AccountModel from './account.model'
import UserModel from '../user/user.model'
import VerificationCodeModel from './verification.model'
import type { ResetPasswordDto } from './auth.validation'

export const AuthService = {
    loginOrCreateAccount: async (data: {
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

            let user = await UserModel.findOne({ email }).session(session)

            if (!user) {
                // fix #3: assign GUEST role to new OAuth users
                const guestRole = await RoleModel.findOne({ name: 'GUEST' }).session(session)
                if (!guestRole) throw new NotFoundException('Guest role not found')

                user = new UserModel({
                    email,
                    firstName,
                    lastName,
                    profilePicture: picture || null,
                    isEmailVerified: true,
                    role: guestRole._id,
                    joinedAt: new Date(),
                })
                await user.save({ session })

                const account = new AccountModel({ userId: user._id, provider: provider as any, providerId })
                await account.save({ session })
            } else {
                user.lastLogin = new Date()
                await user.save({ session })
            }

            await session.commitTransaction()
            return { user }
        } catch (error) {
            await session.abortTransaction()
            throw error
        } finally {
            // fix #8: only endSession in finally
            session.endSession()
        }
    },

    registerUser: async (body: { email: string; firstName: string; lastName: string; password: string }) => {
        const { email, firstName, lastName, password } = body
        const session = await mongoose.startSession()

        try {
            session.startTransaction()

            const existingUser = await UserModel.findOne({ email }).session(session)
            if (existingUser) throw new BadRequestException('Email already exists')

            const guestRole = await RoleModel.findOne({ name: 'GUEST' }).session(session)
            if (!guestRole) throw new NotFoundException('Guest role not found')

            const user = new UserModel({ email, firstName, lastName, password, role: guestRole._id, joinedAt: new Date() })
            await user.save({ session })

            const account = new AccountModel({
                userId: user._id,
                provider: ProviderEnum.EMAIL,
                providerId: email,
            })
            await account.save({ session })

            // fix #5: create verification code inside tx with session
            const verification = new VerificationCodeModel({
                userId: user._id,
                type: VerificationEnum.EMAIL_VERIFICATION,
                expiresAt: fortyFiveMinutesFromNow(),
            })
            await verification.save({ session })

            await session.commitTransaction()

            // fix #5: send email AFTER commit so abort doesn't leave orphaned code
            const verificationUrl = `${config.FRONTEND_ORIGIN}/confirm-account?code=${verification.code}`
            await sendEmail({ to: user.email, ...verifyEmailTemplate(verificationUrl) })

            return { userId: user._id }
        } catch (error: any) {
            await session.abortTransaction()
            throw error
        } finally {
            // fix #8: only endSession in finally
            session.endSession()
        }
    },

    verifyEmail: async (code: string) => {
        const validCode = await VerificationCodeModel.findOne({
            code,
            type: VerificationEnum.EMAIL_VERIFICATION,
            expiresAt: { $gt: new Date() },
        })

        if (!validCode) throw new BadRequestException('Invalid or expired verification code')

        const updatedUser = await UserModel.findByIdAndUpdate(
            validCode.userId,
            { isEmailVerified: true },
            { new: true },
        )

        if (!updatedUser) {
            throw new BadRequestException('Unable to verify email address', ErrorCodeEnum.VALIDATION_ERROR)
        }

        await validCode.deleteOne()
        return { user: updatedUser }
    },

    verifyUser: async ({ email, password, provider = ProviderEnum.EMAIL }: { email: string; password: string; provider?: string }) => {
        const account = await AccountModel.findOne({ provider, providerId: email })
        if (!account) throw new NotFoundException('Invalid email or password')

        const user = await UserModel.findById(account.userId).select('+password')
        if (!user) throw new NotFoundException('Invalid email or password')

        const isMatch = await user.comparePassword(password)
        if (!isMatch) throw new UnauthorizedException('Invalid email or password')

        return user.omitPassword()
    },

    verifyUserById: async (userId: string) => {
        const user = await UserModel.findById(userId, { password: false })
        return user || null
    },

    forgotPassword: async (email: string) => {
        const user = await UserModel.findOne({ email })

        // fix #6: anti-enumeration — silent return for unknown email
        if (!user) return { url: null, emailId: null }

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
        const { data, error } = await sendEmail({ to: user.email, ...passwordResetTemplate(resetLink) })

        if (!data?.id) throw new InternalServerException(`From Email :${error?.name} ${error?.message}`)

        return { url: resetLink, emailId: data.id }
    },

    resetPassword: async ({ password, verificationCode }: ResetPasswordDto) => {
        const validCode = await VerificationCodeModel.findOne({
            code: verificationCode,
            type: VerificationEnum.PASSWORD_RESET,
            expiresAt: { $gt: new Date() },
        })
        if (!validCode) throw new NotFoundException('Invalid or expired verification code')

        const hashedPassword = await hashValue(password)
        const updatedUser = await UserModel.findByIdAndUpdate(
            validCode.userId,
            { password: hashedPassword },
            { new: true },
        )
        if (!updatedUser) throw new BadRequestException('Failed to reset password!')

        // fix #5: invalidate all sessions so stolen refresh tokens stop working
        await Promise.all([
            validCode.deleteOne(),
            SessionModel.deleteMany({ userId: validCode.userId }),
        ])

        return { user: updatedUser }
    },
}
