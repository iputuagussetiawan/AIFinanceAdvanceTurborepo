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
import {
    forgotPasswordService,
    registerUserService,
    resetPasswordService,
    verifyEmailService,
} from './auth.service'
import {
    emailSchema,
    registerSchema,
    resetPasswordSchema,
    verificationEmailSchema,
} from './auth.validation'

export const googleLoginCallback = async (req: Request, res: Response) => {
    try {
        // 1. Passport attaches the user to req.user after successful strategy
        const userAgent = req.headers['user-agent']
        const user = req.user as any

        // 1. Look for an existing session for this user on this browser
        // 2. If found, update the 'updatedAt' timestamp
        // 3. If not found, create a new one (upsert: true)

        if (!user) {
            console.log('⚠️[AUTH] Google authentication failed: No user found.')
            return res.redirect(
                `${config.FRONTEND_ORIGIN}/signin?status=error&message=unauthorized`,
            )
        }

        const session = await SessionModel.findOneAndUpdate(
            {
                userId: user._id,
                userAgent: userAgent,
            },
            {
                $set: { updatedAt: new Date() },
            },
            {
                upsert: true,
                new: true,
            },
        )

        const access_token = signJwtToken(
            { userId: user._id, sessionId: session._id },
            accessTokenSignOptions,
        )
        const refresh_token = signJwtToken(
            { sessionId: session._id } as any,
            refreshTokenSignOptions,
        )

        res.cookie('accessToken', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 15 * 60 * 1000, // 15 min
            sameSite: 'lax',
        })
        res.cookie('refreshToken', refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            sameSite: 'lax',
        })

        // 4. Redirect to the frontend (No token in the URL!)
        return res.redirect(`${config.FRONTEND_ORIGIN}/onboarding?status=success&provider=google`)
    } catch (error: any) {
        console.error('❌[AUTH] Callback Error:', error)
        const errorType = error.name === 'NotFoundException' ? 'user_not_found' : 'server_error'
        return res.redirect(`${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=error&code=${errorType}`)
    }
}

export const registerUserController = asyncHandler(async (req: Request, res: Response) => {
    const body = registerSchema.parse({
        ...req.body,
    })
    await registerUserService(body)
    return res.status(HTTPSTATUS.CREATED).json({
        message: 'User created successfully',
    })
})

export const verifyEmailController = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
        const { code } = verificationEmailSchema.parse(req.body)
        await verifyEmailService(code)
        return res.status(HTTPSTATUS.OK).json({
            message: 'Email verified successfully',
        })
    },
)

export const loginController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        // We use { session: false } because we are using JWT, not Express sessions
        passport.authenticate(
            'local',
            { session: false },
            async (
                err: Error | null,
                user: any, // Use your AuthenticatedUser interface here
                info: { message: string } | undefined,
            ) => {
                // 1. Handle system errors
                if (err) {
                    console.error('❌ [AUTH] Login internal error:', err)
                    return next(err)
                }

                // 2. Handle invalid credentials
                if (!user) {
                    console.log(`⚠️  [AUTH] Login failed: ${info?.message}`)
                    return res.status(HTTPSTATUS.UNAUTHORIZED).json({
                        message: info?.message || 'Invalid email or password',
                    })
                }

                const userAgent = req.headers['user-agent']
                // 1. Look for an existing session for this user on this browser
                // 2. If found, update the 'updatedAt' timestamp
                // 3. If not found, create a new one (upsert: true)
                const session = await SessionModel.findOneAndUpdate(
                    {
                        userId: user._id,
                        userAgent: userAgent,
                    },
                    {
                        $set: { updatedAt: new Date() },
                    },
                    {
                        upsert: true,
                        new: true,
                    },
                )

                const access_token = signJwtToken(
                    { userId: user._id, sessionId: session._id },
                    accessTokenSignOptions,
                )
                const refresh_token = signJwtToken(
                    { sessionId: session._id } as any,
                    refreshTokenSignOptions,
                )
                res.cookie('accessToken', access_token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 15 * 60 * 1000, // 15 min
                    sameSite: 'lax',
                })
                res.cookie('refreshToken', refresh_token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
                    sameSite: 'lax',
                })

                console.log(`✅ [AUTH] User logged in: ${user.email}`)

                // 5. Return success (Notice we still return access_token for debugging,

                // but the browser will primarily use the cookie)
                return res.status(HTTPSTATUS.OK).json({
                    message: 'Logged in successfully',
                    user: {
                        _id: user._id,
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
    },
)

export const logOutController = asyncHandler(async (req: Request, res: Response) => {
    // 1. Grab the ID attached by your middleware
    const sessionId = req.sessionId

    // 2. Delete from DB (The most important part for security)
    if (sessionId) {
        console.log(sessionId)
        await SessionModel.findByIdAndDelete(sessionId)
        console.log('success delete session')
    } else {
        console.warn('⚠️ [AUTH] Logout called but no sessionId found in request.')
    }

    // 3. Clear cookies
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    })
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/api/auth/refresh',
    })

    // 4. Cleanup local objects
    req.user = undefined

    return res.status(HTTPSTATUS.OK).json({
        message: 'Logged out successfully',
    })
})

export const forgotPasswordController = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
        const email = emailSchema.parse(req.body.email)
        await forgotPasswordService(email)
        return res.status(HTTPSTATUS.OK).json({
            message: 'Password reset email sent',
        })
    },
)

export const resetPasswordController = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
        const body = resetPasswordSchema.parse(req.body)
        await resetPasswordService(body)
        res.cookie('accessToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires: new Date(0),
            path: '/',
        })
        return res.status(HTTPSTATUS.OK).json({
            message: 'Password reset successfully',
        })
    },
)

export const refreshTokenController = asyncHandler(async (req: Request, res: Response) => {
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
        maxAge: 15 * 60 * 1000, // 15 min
        sameSite: 'lax',
    })

    return res.status(HTTPSTATUS.OK).json({ message: 'Token refreshed successfully', access_token })
})
