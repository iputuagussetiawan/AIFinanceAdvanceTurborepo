import { Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { eq, and, gt, count, sql } from 'drizzle-orm'
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'

import { DRIZZLE } from '../database/drizzle.provider'
import * as schema from '../database/schema'
import { users } from '../database/schema/users.schema'
import { sessions } from '../database/schema/sessions.schema'
import { verificationCodes, VerificationTypeEnum } from '../database/schema/verification-codes.schema'
import { MailService } from '../mail/mail.service'
import { RoleService } from '../role/role.service'
import {
    BadRequestException,
    NotFoundException,
    UnauthorizedException,
    TooManyRequestsException,
} from '../common/exceptions/app-error'
import type { RegisterDto } from './dto/register.dto'
import type { ResetPasswordDto } from './dto/reset-password.dto'

const COOKIE_OPTS = (maxAge: number) => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge,
})

@Injectable()
export class AuthService {
    constructor(
        @Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>,
        private jwtService: JwtService,
        private mailService: MailService,
        private roleService: RoleService,
    ) {}

    signAccessToken(payload: { userId: string; sessionId: string }) {
        const secret = process.env.JWT_SECRET
        if (!secret) throw new Error('JWT_SECRET is not set')
        return this.jwtService.sign(payload, { secret, expiresIn: '15m' })
    }

    signRefreshToken(payload: { sessionId: string }) {
        const secret = process.env.JWT_REFRESH_SECRET
        if (!secret) throw new Error('JWT_REFRESH_SECRET is not set')
        return this.jwtService.sign(payload, { secret, expiresIn: '30d' })
    }

    async upsertSession(
        userId: string,
        userAgent: string | undefined,
        ip?: string,
        deviceInfo?: { deviceType: string; browser: string; os: string },
    ) {
        const expiredAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

        const uaCondition = userAgent
            ? eq(sessions.userAgent, userAgent)
            : sql`${sessions.userAgent} IS NULL`

        const existing = await this.db
            .select()
            .from(sessions)
            .where(and(eq(sessions.userId, userId), uaCondition))
            .limit(1)

        if (existing.length) {
            const [updated] = await this.db
                .update(sessions)
                .set({ updatedAt: new Date(), expiredAt, ip, ...deviceInfo })
                .where(eq(sessions.id, existing[0].id))
                .returning()
            return updated
        }

        const [created] = await this.db
            .insert(sessions)
            .values({ userId, userAgent, ip, ...deviceInfo, expiredAt })
            .returning()
        return created
    }

    async validateUser(email: string, password: string) {
        const [user] = await this.db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1)

        if (!user || !user.password) return null

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return null

        const { password: _, ...safe } = user
        return safe
    }

    async register(dto: RegisterDto) {
        const firstName = dto.firstName.trim()
        const lastName = dto.lastName.trim()

        const [existing] = await this.db
            .select({ id: users.id })
            .from(users)
            .where(eq(users.email, dto.email))
            .limit(1)

        if (existing) throw new BadRequestException('Email already in use')

        const hashedPassword = await bcrypt.hash(dto.password, 10)

        const [user] = await this.db
            .insert(users)
            .values({
                email: dto.email,
                firstName,
                lastName,
                password: hashedPassword,
                provider: 'email',
                providerId: dto.email,
            })
            .returning()

        const code = crypto.randomBytes(20).toString('hex')
        await this.db.insert(verificationCodes).values({
            userId: user.id,
            code,
            type: VerificationTypeEnum.EMAIL_VERIFICATION,
            expiresAt: new Date(Date.now() + 45 * 60 * 1000),
        })

        const verificationUrl = `${process.env.FRONTEND_ORIGIN}/confirm-account?code=${code}`
        await this.mailService.sendVerificationEmail(user.email, verificationUrl)

        const jobseekerRole = await this.roleService.findByName('jobseeker')
        if (jobseekerRole) await this.roleService.assignRoleToUser(user.id, jobseekerRole.id)

        return { userId: user.id }
    }

    async verifyEmail(code: string) {
        const [record] = await this.db
            .select()
            .from(verificationCodes)
            .where(
                and(
                    eq(verificationCodes.code, code),
                    eq(verificationCodes.type, VerificationTypeEnum.EMAIL_VERIFICATION),
                    gt(verificationCodes.expiresAt, new Date()),
                ),
            )
            .limit(1)

        if (!record) throw new BadRequestException('Invalid or expired verification code')

        await this.db
            .update(users)
            .set({ isEmailVerified: true, updatedAt: new Date() })
            .where(eq(users.id, record.userId))

        await this.db.delete(verificationCodes).where(eq(verificationCodes.id, record.id))

        return { message: 'Email verified successfully' }
    }

    async loginOrCreateAccount(data: {
        provider: string
        providerId: string
        firstName: string
        lastName: string
        email?: string
        picture?: string
    }) {
        const { provider, providerId, firstName, lastName, email, picture } = data

        let [user] = email
            ? await this.db.select().from(users).where(eq(users.email, email)).limit(1)
            : []

        if (!user) {
            const [created] = await this.db
                .insert(users)
                .values({
                    email: email ?? `${provider}.${providerId}@noemail.local`,
                    firstName,
                    lastName,
                    profilePicture: picture,
                    provider,
                    providerId,
                    isEmailVerified: true,
                })
                .returning()
            user = created
        } else {
            await this.db
                .update(users)
                .set({ lastLogin: new Date(), updatedAt: new Date() })
                .where(eq(users.id, user.id))
        }

        return user
    }

    async forgotPassword(email: string) {
        const [user] = await this.db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1)

        if (!user) return { message: 'Password reset email sent' }

        const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000)
        const [{ recentCount }] = await this.db
            .select({ recentCount: count() })
            .from(verificationCodes)
            .where(
                and(
                    eq(verificationCodes.userId, user.id),
                    eq(verificationCodes.type, VerificationTypeEnum.PASSWORD_RESET),
                    gt(verificationCodes.createdAt, threeMinutesAgo),
                ),
            )

        if (recentCount >= 2) {
            throw new TooManyRequestsException('Too many requests, try again later')
        }

        const code = crypto.randomBytes(20).toString('hex')
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

        await this.db.insert(verificationCodes).values({
            userId: user.id,
            code,
            type: VerificationTypeEnum.PASSWORD_RESET,
            expiresAt,
        })

        const resetUrl = `${process.env.FRONTEND_ORIGIN}/reset-password?code=${code}&exp=${expiresAt.getTime()}`
        await this.mailService.sendPasswordResetEmail(user.email, resetUrl)

        return { message: 'Password reset email sent' }
    }

    async resetPassword(dto: ResetPasswordDto) {
        const [record] = await this.db
            .select()
            .from(verificationCodes)
            .where(
                and(
                    eq(verificationCodes.code, dto.verificationCode),
                    eq(verificationCodes.type, VerificationTypeEnum.PASSWORD_RESET),
                    gt(verificationCodes.expiresAt, new Date()),
                ),
            )
            .limit(1)

        if (!record) throw new NotFoundException('Invalid or expired verification code')

        const hashedPassword = await bcrypt.hash(dto.password, 10)

        await this.db
            .update(users)
            .set({ password: hashedPassword, updatedAt: new Date() })
            .where(eq(users.id, record.userId))

        await this.db.delete(verificationCodes).where(eq(verificationCodes.id, record.id))

        return { message: 'Password reset successfully' }
    }

    async refreshToken(token: string) {
        let payload: { sessionId: string }
        try {
            payload = this.jwtService.verify(token, {
                secret: process.env.JWT_REFRESH_SECRET,
            })
        } catch {
            throw new UnauthorizedException('Invalid or expired refresh token')
        }

        const [session] = await this.db
            .select()
            .from(sessions)
            .where(eq(sessions.id, payload.sessionId))
            .limit(1)

        if (!session || session.expiredAt < new Date()) {
            throw new UnauthorizedException('Session expired or revoked')
        }

        const access_token = this.signAccessToken({ userId: session.userId, sessionId: session.id })
        return { access_token }
    }

    async deleteSession(sessionId: string) {
        await this.db.delete(sessions).where(eq(sessions.id, sessionId))
    }

    static cookieOpts = COOKIE_OPTS
}
