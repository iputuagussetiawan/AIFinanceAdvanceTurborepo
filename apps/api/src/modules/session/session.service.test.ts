jest.mock('../../utils/appError', () => ({
    NotFoundException: class NotFoundException extends Error {
        constructor(message: string) {
            super(message)
            this.name = 'NotFoundException'
        }
    },
}))

jest.mock('./session.model', () => ({
    __esModule: true,
    default: {
        find: jest.fn(),
        findById: jest.fn(),
        findByIdAndDelete: jest.fn(),
    },
}))

jest.mock('../member/member.model', () => ({
    __esModule: true,
    default: { findOne: jest.fn() },
}))

import SessionModel from './session.model'
import MemberModel from '../member/member.model'
import {
    getAllSessionService,
    getSessionByIdService,
    deleteSessionService,
} from './session.service'

// ─── helpers ────────────────────────────────────────────────────────────────

const FUTURE = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
const PAST = new Date(Date.now() - 1000)

function makeSessionDoc(overrides: Partial<any> = {}) {
    const doc = {
        _id: 'sess_1',
        userId: 'user_1',
        userAgent: 'Mozilla/5.0',
        createdAt: new Date(),
        expiredAt: FUTURE,
        toObject: jest.fn().mockReturnThis(),
        toJSON: jest.fn().mockReturnThis(),
        ...overrides,
    }
    doc.toJSON.mockReturnValue({
        _id: doc._id,
        userId: { id: 'user_1', email: 'test@example.com', firstName: 'JOHN' },
        userAgent: doc.userAgent,
        createdAt: doc.createdAt,
        expiredAt: doc.expiredAt,
    })
    return doc
}

function makeMember() {
    return {
        role: { name: 'GUEST', permissions: [] },
        toJSON: jest.fn().mockReturnThis(),
    }
}

// ─── getAllSessionService ────────────────────────────────────────────────────

describe('getAllSessionService', () => {
    beforeEach(() => jest.clearAllMocks())

    it('returns sessions sorted by createdAt desc', async () => {
        const sessions = [makeSessionDoc(), makeSessionDoc({ _id: 'sess_2' })]
        ;(SessionModel.find as jest.Mock).mockResolvedValue(sessions)

        const result = await getAllSessionService('user_1')

        expect(SessionModel.find).toHaveBeenCalledWith(
            { userId: 'user_1', expiredAt: { $gt: expect.any(Number) } },
            expect.any(Object),
            { sort: { createdAt: -1 } },
        )
        expect(result.sessions).toHaveLength(2)
    })

    it('returns empty array when no active sessions exist', async () => {
        ;(SessionModel.find as jest.Mock).mockResolvedValue([])
        const result = await getAllSessionService('user_1')
        expect(result.sessions).toEqual([])
    })
})

// ─── getSessionByIdService ───────────────────────────────────────────────────

describe('getSessionByIdService', () => {
    beforeEach(() => jest.clearAllMocks())

    it('returns merged user + role on success', async () => {
        const session = makeSessionDoc()
        const member = makeMember()

        ;(SessionModel.findById as jest.Mock).mockReturnValue({
            populate: jest.fn().mockReturnValue({
                select: jest.fn().mockResolvedValue(session),
            }),
        })
        ;(MemberModel.findOne as jest.Mock).mockReturnValue({
            populate: jest.fn().mockResolvedValue(member),
        })

        const result = await getSessionByIdService('sess_1', 'user_1')

        expect(result.user).toBeDefined()
        expect(result.user.role).toEqual({ name: 'GUEST', permissions: [] })
    })

    it('runs session and member queries in parallel', async () => {
        const order: string[] = []
        const session = makeSessionDoc()
        const member = makeMember()

        ;(SessionModel.findById as jest.Mock).mockReturnValue({
            populate: jest.fn().mockReturnValue({
                select: jest.fn().mockImplementation(
                    () => new Promise((r) => setTimeout(() => { order.push('session'); r(session) }, 10)),
                ),
            }),
        })
        ;(MemberModel.findOne as jest.Mock).mockReturnValue({
            populate: jest.fn().mockImplementation(
                () => new Promise((r) => setTimeout(() => { order.push('member'); r(member) }, 5)),
            ),
        })

        await getSessionByIdService('sess_1', 'user_1')

        // member resolves faster (5ms) — confirms parallel execution
        expect(order).toEqual(['member', 'session'])
    })

    it('throws NotFoundException when session not found', async () => {
        ;(SessionModel.findById as jest.Mock).mockReturnValue({
            populate: jest.fn().mockReturnValue({
                select: jest.fn().mockResolvedValue(null),
            }),
        })
        ;(MemberModel.findOne as jest.Mock).mockReturnValue({
            populate: jest.fn().mockResolvedValue(makeMember()),
        })

        await expect(getSessionByIdService('sess_bad', 'user_1')).rejects.toThrow(
            'Session or User not found',
        )
    })

    it('merges null role when member not found', async () => {
        const session = makeSessionDoc()
        ;(SessionModel.findById as jest.Mock).mockReturnValue({
            populate: jest.fn().mockReturnValue({
                select: jest.fn().mockResolvedValue(session),
            }),
        })
        ;(MemberModel.findOne as jest.Mock).mockReturnValue({
            populate: jest.fn().mockResolvedValue(null),
        })

        const result = await getSessionByIdService('sess_1', 'user_1')
        expect(result.user.role).toBeNull()
    })
})

// ─── deleteSessionService ────────────────────────────────────────────────────

describe('deleteSessionService', () => {
    beforeEach(() => jest.clearAllMocks())

    it('deletes the session and returns undefined', async () => {
        ;(SessionModel.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: 'sess_1' })
        await expect(deleteSessionService('sess_1', 'user_1')).resolves.toBeUndefined()
        expect(SessionModel.findByIdAndDelete).toHaveBeenCalledWith({
            _id: 'sess_1',
            userId: 'user_1',
        })
    })

    it('throws NotFoundException when session not found', async () => {
        ;(SessionModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null)
        await expect(deleteSessionService('sess_bad', 'user_1')).rejects.toThrow('Session not found')
    })
})
