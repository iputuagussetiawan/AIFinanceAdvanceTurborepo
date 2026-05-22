import { Router } from 'express'
import passport from 'passport'

import { config } from '../../config/app.config'
import { passportAuthenticateJWT } from '../../config/passport.config'
import { AuthController } from './auth.controller'

const failedUrl = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`
const authRoutes = Router()
authRoutes.post('/register', AuthController.registerUser)
authRoutes.post('/verify/email', AuthController.verifyEmail)
authRoutes.post('/password/forgot', AuthController.forgotPassword)
authRoutes.post('/password/reset', AuthController.resetPassword)
authRoutes.post('/login', AuthController.login)
authRoutes.post('/refresh', AuthController.refreshToken)
authRoutes.post('/logout', passportAuthenticateJWT, AuthController.logout)

authRoutes.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'], session: false }),
)
authRoutes.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: failedUrl, session: false }),
    AuthController.googleLoginCallback,
)

export default authRoutes
