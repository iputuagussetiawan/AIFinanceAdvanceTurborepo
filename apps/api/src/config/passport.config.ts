import { Request } from 'express'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { ExtractJwt, Strategy as JwtStrategy, StrategyOptions } from 'passport-jwt'
import { Strategy as LocalStrategy } from 'passport-local'

import { ProviderEnum } from '../enums/account-provider.enum'
import {
    loginOrCreateAccountService,
    verifyUserByIdService,
    verifyUserService,
} from '../modules/auth/auth.service'
import SessionModel from '../modules/session/session.model'
import { NotFoundException } from '../utils/appError'
import { signJwtToken } from '../utils/jwt'
import { config } from './app.config'

interface JwtPayload {
    userId: string
    sessionId: string
}

const cookieExtractor = (req: Request) => {
    let token = null
    if (req && req.cookies) {
        token = req.cookies['accessToken'] // Matches the name in your loginController
    }
    return token
}

const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        cookieExtractor,
    ]),
    secretOrKey: config.JWT_SECRET,
    audience: ['user'],
    algorithms: ['HS256'],
    passReqToCallback: true,
}

passport.use(
    new GoogleStrategy(
        {
            clientID: config.GOOGLE_CLIENT_ID,
            clientSecret: config.GOOGLE_CLIENT_SECRET,
            callbackURL: config.GOOGLE_CALLBACK_URL,
            scope: ['profile', 'email'],
            passReqToCallback: true,
        },
        async (req: Request, accessToken, refreshToken, profile, done) => {
            try {
                const { email, sub: googleId, picture } = profile._json
                console.log(profile, 'profile')
                console.log(googleId, 'googleId')
                if (!googleId) {
                    throw new NotFoundException('Google ID (sub) is missing')
                }
                const { user } = await loginOrCreateAccountService({
                    provider: ProviderEnum.GOOGLE,
                    firstName: profile.name?.givenName || profile.displayName || 'Your First Name', 
                    lastName: profile.name?.familyName || profile.displayName || 'Your Last Name',
                    providerId: googleId,
                    picture: picture,
                    email: email,
                })
                const jwt = signJwtToken({ userId: user._id })
                req.jwt = jwt
                done(null, user)
            } catch (error) {
                done(error, false)
            }
        },
    ),
)

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            session: false,
        },
        async (email, password, done) => {
            try {
                const user = await verifyUserService({ email, password })
                return done(null, user)
            } catch (error: any) {
                return done(error, false, { message: error?.message })
            }
        },
    ),
)

passport.use(
    new JwtStrategy(options, async (req, payload: JwtPayload, done) => {
        try {
            const user = await verifyUserByIdService(payload.userId)
            if (!user) {
                return done(null, false)
            }

            // 2. NEW: Verify the session still exists in the database
            // If you deleted the session via deleteSessionService, this will be null
            const activeSession = await SessionModel.findById(payload.sessionId)

            if (!activeSession) {
                // This triggers if the session was revoked/deleted
                return done(null, false, { message: 'Session has been revoked' })
            }
            req.sessionId = payload.sessionId
            return done(null, user)
        } catch (error: any) {
            return done(error, false, { message: error?.message })
        }
    }),
)

passport.serializeUser((user: any, done) => done(null, user))
passport.deserializeUser((user: any, done) => done(null, user))

//This line of code creates a "Guard" or "Bouncer" for your application's protected routes.  you would place this middleware in front of sensitive routes—like viewing bank balances or posting transactions—to ensure only authenticated users can get through.
//passport.authenticate("jwt", ...): This tells Passport to use the JWT Strategy that you (or we) have configured. It will look for a token, verify its signature using your secret key, and check if it has expired.
//{ session: false }: This is the most important part of your stateless architecture. It tells Passport: "Don't try to create a session in the database or store a session ID in a cookie. Just verify the token for this single request and move on." This prevents the req.session.save errors we discussed earlier.
export const passportAuthenticateJWT = passport.authenticate('jwt', { session: false })
