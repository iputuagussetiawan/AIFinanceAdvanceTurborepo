import 'dotenv/config'

import session from 'cookie-session'
import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import passport from 'passport'

import { config } from './config/app.config'
import connectDatabase from './config/database.config'
import { HTTPSTATUS } from './config/http.config'
import { asyncHandler } from './middlewares/asyncHandler.middleware'
import { errorHandler } from './middlewares/errorHandler.middleware'

import './config/passport.config'

import cookieParser from 'cookie-parser'

import { passportAuthenticateJWT } from './config/passport.config'
import authRoutes from './modules/auth/auth.route'
import companyRoutes from './modules/company/company.route'
import institutionRoutes from './modules/institution/institution.route'
import jobseekerRoutes from './modules/jobseeker/jobseeker.route'
import languageRoutes from './modules/language/language.route'
import sessionRoutes from './modules/session/session.route'
import skillRoutes from './modules/skill/skill.route'
import userRoutes from './modules/user/user.route'

const app = express()
app.use(helmet())
app.use(cookieParser())
const BASE_PATH = config.BASE_PATH

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: 'Too many attempts, try again later' },
    standardHeaders: true,
    legacyHeaders: false,
})

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
})

app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

app.use(passport.initialize())

app.use(
    cors({
        origin: config.FRONTEND_ORIGIN,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'x-csrf-token'],
    }),
)
app.use(globalLimiter)

app.get(
    '/',
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        return res.status(HTTPSTATUS.OK).json({
            message: 'Welcome to AI Finance APP',
        })
    }),
)

app.use(`${BASE_PATH}/auth/login`, authLimiter)
app.use(`${BASE_PATH}/auth/refresh`, authLimiter)
app.use(`${BASE_PATH}/auth/register`, authLimiter)
app.use(`${BASE_PATH}/auth`, authRoutes)
app.use(`${BASE_PATH}/user`, passportAuthenticateJWT, userRoutes)
app.use(`${BASE_PATH}/company`, passportAuthenticateJWT, companyRoutes)

app.use(`${BASE_PATH}/session`, passportAuthenticateJWT, sessionRoutes)
app.use(`${BASE_PATH}/jobseeker`, passportAuthenticateJWT, jobseekerRoutes)
app.use(`${BASE_PATH}/language`, passportAuthenticateJWT, languageRoutes)
app.use(`${BASE_PATH}/institution`, passportAuthenticateJWT, institutionRoutes)
app.use(`${BASE_PATH}/skill`, passportAuthenticateJWT, skillRoutes)

app.use(errorHandler)

app.listen(config.PORT, async () => {
    await connectDatabase()
})
