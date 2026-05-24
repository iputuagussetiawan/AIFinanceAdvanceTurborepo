import {
    Controller,
    Post,
    Get,
    Body,
    Req,
    Res,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Request, Response } from 'express'

import { AuthService } from './auth.service'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { RegisterDto } from './dto/register.dto'
import { VerifyEmailDto } from './dto/verify-email.dto'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'

const ACCESS_MAX_AGE = 15 * 60 * 1000
const REFRESH_MAX_AGE = 30 * 24 * 60 * 60 * 1000
const IS_PROD = process.env.NODE_ENV === 'production'

function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: IS_PROD, sameSite: 'lax', maxAge: ACCESS_MAX_AGE })
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: IS_PROD, sameSite: 'lax', maxAge: REFRESH_MAX_AGE })
}

function clearAuthCookies(res: Response) {
    res.clearCookie('accessToken', { httpOnly: true, secure: IS_PROD, sameSite: 'lax', path: '/' })
    res.clearCookie('refreshToken', { httpOnly: true, secure: IS_PROD, sameSite: 'lax', path: '/' })
}

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() dto: RegisterDto) {
        await this.authService.register(dto)
        return { message: 'User created successfully' }
    }

    @Post('verify/email')
    @HttpCode(HttpStatus.OK)
    async verifyEmail(@Body() dto: VerifyEmailDto) {
        return this.authService.verifyEmail(dto.code)
    }

    @Post('login')
    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const user = req.user as any
        const session = await this.authService.upsertSession(user.id, req.headers['user-agent'])
        const accessToken = this.authService.signAccessToken({ userId: user.id, sessionId: session.id })
        const refreshToken = this.authService.signRefreshToken({ sessionId: session.id })

        setAuthCookies(res, accessToken, refreshToken)

        return {
            message: 'Logged in successfully',
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                profilePicture: user.profilePicture,
                isActive: user.isActive,
            },
            access_token: accessToken,
        }
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const token: string | undefined = req.cookies?.refreshToken
        if (!token) {
            res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Refresh token missing' })
            return
        }
        const { access_token } = await this.authService.refreshToken(token)
        res.cookie('accessToken', access_token, { httpOnly: true, secure: IS_PROD, sameSite: 'lax', maxAge: ACCESS_MAX_AGE })
        return { message: 'Token refreshed successfully', access_token }
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const user = req.user as any
        if (user?.sessionId) await this.authService.deleteSession(user.sessionId)
        clearAuthCookies(res)
        return { message: 'Logged out successfully' }
    }

    @Post('password/forgot')
    @HttpCode(HttpStatus.OK)
    async forgotPassword(@Body() dto: ForgotPasswordDto) {
        return this.authService.forgotPassword(dto.email)
    }

    @Post('password/reset')
    @HttpCode(HttpStatus.OK)
    async resetPassword(@Body() dto: ResetPasswordDto, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.resetPassword(dto)
        res.clearCookie('accessToken', { httpOnly: true, secure: IS_PROD, sameSite: 'lax', path: '/' })
        return result
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    googleLogin() {}

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleCallback(@Req() req: Request, @Res() res: Response) {
        try {
            const user = req.user as any
            const session = await this.authService.upsertSession(user.id, req.headers['user-agent'])
            const accessToken = this.authService.signAccessToken({ userId: user.id, sessionId: session.id })
            const refreshToken = this.authService.signRefreshToken({ sessionId: session.id })

            setAuthCookies(res, accessToken, refreshToken)
            return res.redirect(`${process.env.FRONTEND_ORIGIN}/onboarding?status=success&provider=google`)
        } catch {
            return res.redirect(`${process.env.FRONTEND_ORIGIN}/signin?status=error`)
        }
    }
}
