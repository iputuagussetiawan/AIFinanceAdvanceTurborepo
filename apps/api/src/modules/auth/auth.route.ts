import { Router } from 'express'
import passport from 'passport'

import { config } from '../../config/app.config'
import { passportAuthenticateJWT } from '../../config/passport.config'
import {
    forgotPasswordController,
    googleLoginCallback,
    loginController,
    logOutController,
    registerUserController,
    resetPasswordController,
    verifyEmailController,
} from './auth.controller'

const failedUrl = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`
const authRoutes = Router()
authRoutes.post('/register', registerUserController)
authRoutes.post('/verify/email', verifyEmailController)
authRoutes.post('/password/forgot', forgotPasswordController)
authRoutes.post('/password/reset', resetPasswordController)
authRoutes.post('/login', loginController)
authRoutes.post('/logout', passportAuthenticateJWT, logOutController)

authRoutes.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false,
    }),
)
authRoutes.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: failedUrl,
        session: false,
    }),
    googleLoginCallback,
)

export default authRoutes
