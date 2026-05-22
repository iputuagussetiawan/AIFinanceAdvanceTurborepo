jest.mock('../../config/app.config', () => ({
    config: {
        REFRESH_JWT_SECRET: 'test_refresh_secret',
        JWT_SECRET: 'test_access_secret',
        JWT_EXPIRES_IN: '15m',
        REFRESH_JWT_EXPIRES_IN: '30d',
        FRONTEND_ORIGIN: 'http://localhost:3000',
        FRONTEND_GOOGLE_CALLBACK_URL: 'http://localhost:3000/google/oauth/callback',
        NODE_ENV: 'test',
    },
}))

jest.mock('../session/session.model', () => ({
    __esModule: true,
    default: {
        findById: jest.fn(),
        findOneAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn(),
    },
}))

jest.mock('../../utils/jwt', () => ({
    verifyJwtToken: jest.fn(),
    signJwtToken: jest.fn(),
    accessTokenSignOptions: { secret: 'test_access_secret', expiresIn: '15m' },
    refreshTokenSignOptions: { secret: 'test_refresh_secret', expiresIn: '30d' },
}))

jest.mock('./auth.service', () => ({
    forgotPasswordService: jest.fn(),
    registerUserService: jest.fn(),
    resetPasswordService: jest.fn(),
    verifyEmailService: jest.fn(),
    loginOrCreateAccountService: jest.fn(),
    verifyUserService: jest.fn(),
    verifyUserByIdService: jest.fn(),
}))

jest.mock('./auth.validation', () => ({
    emailSchema: { parse: jest.fn((v) => v) },
    registerSchema: { parse: jest.fn((v) => v) },
    resetPasswordSchema: { parse: jest.fn((v) => v) },
    verificationEmailSchema: { parse: jest.fn((v) => v) },
}))

jest.mock('passport', () => ({
    authenticate: jest.fn(() => (_req: any, _res: any, next: any) => next()),
    use: jest.fn(),
    serializeUser: jest.fn(),
    deserializeUser: jest.fn(),
}))

import { refreshTokenController } from './auth.controller'
import SessionModel from '../session/session.model'
import { verifyJwtToken, signJwtToken } from '../../utils/jwt'

const mockVerifyJwt = verifyJwtToken as jest.MockedFunction<typeof verifyJwtToken>
const mockSignJwt = signJwtToken as jest.MockedFunction<typeof signJwtToken>
const mockFindById = SessionModel.findById as jest.MockedFunction<typeof SessionModel.findById>

function mockReq(cookies: Record<string, string> = {}) {
    return { cookies, headers: {}, user: undefined, sessionId: undefined } as any
}

function mockRes() {
    const res: any = {}
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    res.cookie = jest.fn().mockReturnValue(res)
    res.clearCookie = jest.fn().mockReturnValue(res)
    return res
}

describe('refreshTokenController', () => {
    let res: ReturnType<typeof mockRes>
    let next: jest.Mock

    beforeEach(() => {
        jest.clearAllMocks()
        res = mockRes()
        next = jest.fn()
    })

    it('returns 401 when refreshToken cookie is missing', async () => {
        await refreshTokenController(mockReq({}), res, next)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: expect.stringMatching(/missing/i) }),
        )
    })

    it('returns 401 when refreshToken is invalid or malformed', async () => {
        mockVerifyJwt.mockReturnValue({ error: 'jwt malformed' })
        await refreshTokenController(mockReq({ refreshToken: 'bad_token' }), res, next)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: expect.stringMatching(/invalid|expired/i) }),
        )
    })

    it('returns 401 when session does not exist', async () => {
        mockVerifyJwt.mockReturnValue({ payload: { sessionId: 'sess_1' } as any })
        mockFindById.mockResolvedValue(null as any)
        await refreshTokenController(mockReq({ refreshToken: 'valid_token' }), res, next)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: expect.stringMatching(/session/i) }),
        )
    })

    it('returns 401 when session is expired', async () => {
        mockVerifyJwt.mockReturnValue({ payload: { sessionId: 'sess_1' } as any })
        mockFindById.mockResolvedValue({
            _id: 'sess_1',
            userId: 'user_1',
            expiredAt: new Date(Date.now() - 1000), // 1 sec in the past
        } as any)
        await refreshTokenController(mockReq({ refreshToken: 'valid_token' }), res, next)
        expect(res.status).toHaveBeenCalledWith(401)
    })

    it('returns 200 with new access_token on success', async () => {
        mockVerifyJwt.mockReturnValue({ payload: { sessionId: 'sess_1' } as any })
        mockFindById.mockResolvedValue({
            _id: 'sess_1',
            userId: 'user_1',
            expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        } as any)
        mockSignJwt.mockReturnValue('new_access_token')

        await refreshTokenController(mockReq({ refreshToken: 'valid_token' }), res, next)

        expect(res.cookie).toHaveBeenCalledWith('accessToken', 'new_access_token', expect.any(Object))
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.stringMatching(/refreshed/i),
                access_token: 'new_access_token',
            }),
        )
    })

    it('calls next(error) when an unexpected error is thrown', async () => {
        mockVerifyJwt.mockImplementation(() => {
            throw new Error('Unexpected DB failure')
        })
        await refreshTokenController(mockReq({ refreshToken: 'some_token' }), res, next)
        expect(next).toHaveBeenCalledWith(expect.any(Error))
        expect(res.status).not.toHaveBeenCalled()
    })
})
