import { NextFunction, Request, Response } from 'express'
import passport from 'passport'

import { config } from '../../config/app.config'
import { HTTPSTATUS } from '../../config/http.config'
import { asyncHandler } from '../../middlewares/asyncHandler.middleware'
import {
    accessTokenSignOptions,
    refreshTokenSignOptions,
    signJwtToken,
    verifyJwtToken,
    type RefreshTPayload,
} from '../../utils/jwt'
import SessionModel from '../session/session.model'
import { AuthService } from './auth.service'
import { emailSchema, registerSchema, resetPasswordSchema, verificationEmailSchema } from './auth.validation'

export const AuthController = {
    googleLoginCallback: async (req: Request, res: Response) => {
        try {
            const userAgent = req.headers['user-agent']
            const user = req.user as any

            if (!user) {
                return res.redirect(`${config.FRONTEND_ORIGIN}/signin?status=error&message=unauthorized`)
            }

            const session = await SessionModel.findOneAndUpdate(
                { userId: user._id, userAgent },
                { $set: { updatedAt: new Date() } },
                { upsert: true, new: true },
            )

            const access_token = signJwtToken({ userId: user._id, sessionId: session._id }, accessTokenSignOptions)
            const refresh_token = signJwtToken({ sessionId: session._id } as any, refreshTokenSignOptions)

            res.cookie('accessToken', access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 15 * 60 * 1000,
                sameSite: 'lax',
            })
            res.cookie('refreshToken', refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 30 * 24 * 60 * 60 * 1000,
                sameSite: 'lax',
            })

            return res.redirect(`${config.FRONTEND_ORIGIN}/onboarding?status=success&provider=google`)
        } catch (error: any) {
            const errorType = error.name === 'NotFoundException' ? 'user_not_found' : 'server_error'
            return res.redirect(`${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=error&code=${errorType}`)
        }
    },

    registerUser: asyncHandler(async (req: Request, res: Response) => {
        const body = registerSchema.parse({ ...req.body })
        await AuthService.registerUser(body)
        return res.status(HTTPSTATUS.CREATED).json({ message: 'User created successfully' })
    }),

    verifyEmail: asyncHandler(async (req: Request, res: Response): Promise<any> => {
        const { code } = verificationEmailSchema.parse(req.body)
        await AuthService.verifyEmail(code)
        return res.status(HTTPSTATUS.OK).json({ message: 'Email verified successfully' })
    }),

    login: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate(
            'local',
            { session: false },
            async (err: Error | null, user: any, info: { message: string } | undefined) => {
                if (err) return next(err)

                if (!user) {
                    return res.status(HTTPSTATUS.UNAUTHORIZED).json({
                        message: info?.message || 'Invalid email or password',
                    })
                }

                const userAgent = req.headers['user-agent']
                const session = await SessionModel.findOneAndUpdate(
                    { userId: user._id, userAgent },
                    { $set: { updatedAt: new Date() } },
                    { upsert: true, new: true },
                )

                const access_token = signJwtToken({ userId: user._id, sessionId: session._id }, accessTokenSignOptions)
                const refresh_token = signJwtToken({ sessionId: session._id } as any, refreshTokenSignOptions)

                res.cookie('accessToken', access_token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 15 * 60 * 1000,
                    sameSite: 'lax',
                })
                res.cookie('refreshToken', refresh_token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    sameSite: 'lax',
                })

                return res.status(HTTPSTATUS.OK).json({
                    message: 'Logged in successfully',
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        profilePicture: user.profilePicture,
                        isActive: user.isActive,
                        lastLogin: user.lastLogin,
                        createdAt: user.createdAt,
                        updatedAt: user.updatedAt,
                        currentCompany: user.currentCompany,
                    },
                    access_token,
                    refresh_token,
                })
            },
        )(req, res, next)
    }),

    logout: asyncHandler(async (req: Request, res: Response) => {
        const sessionId = req.sessionId
        if (sessionId) await SessionModel.findByIdAndDelete(sessionId)

        res.clearCookie('accessToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' })
        res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' })

        req.user = undefined
        return res.status(HTTPSTATUS.OK).json({ message: 'Logged out successfully' })
    }),

    forgotPassword: asyncHandler(async (req: Request, res: Response): Promise<any> => {
        const email = emailSchema.parse(req.body.email)
        await AuthService.forgotPassword(email)
        return res.status(HTTPSTATUS.OK).json({ message: 'Password reset email sent' })
    }),

    resetPassword: asyncHandler(async (req: Request, res: Response): Promise<any> => {
        const body = resetPasswordSchema.parse(req.body)
        await AuthService.resetPassword(body)
        res.cookie('accessToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires: new Date(0),
            path: '/',
        })
        return res.status(HTTPSTATUS.OK).json({ message: 'Password reset successfully' })
    }),

    refreshToken: asyncHandler(async (req: Request, res: Response) => {
        const token: string | undefined = req.cookies?.refreshToken

        if (!token) {
            return res.status(HTTPSTATUS.UNAUTHORIZED).json({ message: 'Refresh token missing' })
        }

        const result = verifyJwtToken<RefreshTPayload>(token, config.REFRESH_JWT_SECRET)

        if ('error' in result) {
            return res.status(HTTPSTATUS.UNAUTHORIZED).json({ message: 'Invalid or expired refresh token' })
        }

        const { sessionId } = result.payload
        const session = await SessionModel.findById(sessionId)

        if (!session || session.expiredAt < new Date()) {
            return res.status(HTTPSTATUS.UNAUTHORIZED).json({ message: 'Session expired or revoked' })
        }

        const access_token = signJwtToken(
            { userId: session.userId as any, sessionId: session._id },
            accessTokenSignOptions,
        )

        res.cookie('accessToken', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 15 * 60 * 1000,
            sameSite: 'lax',
        })

        return res.status(HTTPSTATUS.OK).json({ message: 'Token refreshed successfully', access_token })
    }),
}
