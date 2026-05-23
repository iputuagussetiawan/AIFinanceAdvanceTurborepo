import { Inject, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { eq } from 'drizzle-orm'

import { DRIZZLE } from '../../database/drizzle.provider'
import * as schema from '../../database/schema'
import { sessions } from '../../database/schema/sessions.schema'
import { UnauthorizedException } from '../../common/exceptions/app-error'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => req?.cookies?.accessToken ?? null,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET ?? (() => { throw new Error('JWT_SECRET is not set') })(),
        })
    }

    async validate(payload: { userId: string; sessionId: string }) {
        const [session] = await this.db
            .select({ id: sessions.id, expiredAt: sessions.expiredAt })
            .from(sessions)
            .where(eq(sessions.id, payload.sessionId))
            .limit(1)

        if (!session || session.expiredAt < new Date()) {
            throw new UnauthorizedException('Session expired or revoked')
        }

        return { userId: payload.userId, sessionId: payload.sessionId }
    }
}
