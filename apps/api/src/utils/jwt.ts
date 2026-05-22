import jwt, { SignOptions } from 'jsonwebtoken'

import { config } from '../config/app.config'
import type { SessionDocument } from '../modules/session/session.model'
import type { UserDocument } from '../modules/user/user.model'

export type AccessTPayload = {
    userId: UserDocument['_id']
    sessionId?: SessionDocument['_id']
}

export type RefreshTPayload = {
    sessionId: SessionDocument['_id']
}

type SignOptsAndSecret = SignOptions & {
    secret: string
}

const defaults: SignOptions = {
    audience: ['user'],
}

export const accessTokenSignOptions: SignOptsAndSecret = {
    expiresIn: config.JWT_EXPIRES_IN as any,
    secret: config.JWT_SECRET,
}

export const refreshTokenSignOptions: SignOptsAndSecret = {
    expiresIn: config.REFRESH_JWT_EXPIRES_IN as any,
    secret: config.REFRESH_JWT_SECRET,
}

export const signJwtToken = (payload: AccessTPayload, options?: SignOptsAndSecret) => {
    const { secret, ...opts } = options || accessTokenSignOptions
    return jwt.sign(payload, secret, { ...defaults, ...opts })
}

export const verifyJwtToken = <TPayload extends object = AccessTPayload>(
    token: string,
    secret: string = config.JWT_SECRET,
): { payload: TPayload } | { error: string } => {
    try {
        const payload = jwt.verify(token, secret, { audience: ['user'] }) as TPayload
        return { payload }
    } catch (err: any) {
        return { error: err.message }
    }
}
