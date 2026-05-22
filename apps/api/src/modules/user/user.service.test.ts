// --- mocks must come before any imports ---
jest.mock('../../config/app.config', () => ({
    config: {
        FRONTEND_ORIGIN: 'http://localhost:3000',
        JWT_SECRET: 'test_secret',
        REFRESH_JWT_SECRET: 'test_refresh_secret',
        JWT_EXPIRES_IN: '15m',
        REFRESH_JWT_EXPIRES_IN: '30d',
    },
}))

jest.mock('cloudinary', () => ({
    v2: {
        uploader: {
            destroy: jest.fn().mockResolvedValue({ result: 'ok' }),
        },
    },
}))

jest.mock('../member/member.model', () => ({
    __esModule: true,
    default: { findOne: jest.fn() },
}))

jest.mock('./user.model', () => ({
    __esModule: true,
    default: {
        findById: jest.fn(),
        findOne: jest.fn(),
    },
}))

jest.mock('./verification.model', () => ({
    __esModule: true,
    default: { create: jest.fn() },
}))

jest.mock('../../mailers/mailer', () => ({
    sendEmail: jest.fn().mockResolvedValue({}),
}))

import { v2 as cloudinary } from 'cloudinary'
import MemberModel from '../member/member.model'
import UserModel from './user.model'
import VerificationCodeModel from './verification.model'
import {
    getCurrentUserService,
    updateUserService,
    updateUserPhotoProfileService,
    updateUserProfileService,
} from './user.service'

// ─── helpers ────────────────────────────────────────────────────────────────

function makeUser(overrides: Record<string, any> = {}) {
    const base: Record<string, any> = {
        _id: 'user_1',
        email: 'test@example.com',
        firstName: 'JOHN',
        lastName: 'DOE',
        jobTitle: '',
        bio: 'dev',
        phoneNumber: '',
        address: '',
        website: '',
        isEmailVerified: true,
        profilePicture: null,
        toObject: jest.fn().mockReturnThis(),
        save: jest.fn().mockResolvedValue(undefined),
        ...overrides,
    }
    return base
}

function makeMember(userOverride?: any) {
    const member = {
        userId: userOverride || makeUser(),
        role: { name: 'GUEST' },
        joinedAt: new Date('2024-01-01'),
        id: 'member_1',
        toJSON: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
    }
    member.toJSON.mockReturnValue(member)
    return member
}

function chainPopulate(returnValue: any) {
    const chain = { populate: jest.fn().mockReturnValue(returnValue) }
    return chain
}

// ─── getCurrentUserService ──────────────────────────────────────────────────

describe('getCurrentUserService', () => {
    beforeEach(() => jest.clearAllMocks())

    it('returns user, role, joinedAt on success', async () => {
        const member = makeMember()
        ;(MemberModel.findOne as jest.Mock).mockReturnValue({
            populate: jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue(member),
            }),
        })

        const result = await getCurrentUserService('user_1')
        expect(result.user).toBeDefined()
        expect(result.role).toEqual({ name: 'GUEST' })
        expect(result.joinedAt).toBeInstanceOf(Date)
    })

    it('throws BadRequestException when member not found', async () => {
        ;(MemberModel.findOne as jest.Mock).mockReturnValue({
            populate: jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue(null),
            }),
        })

        await expect(getCurrentUserService('user_1')).rejects.toThrow(
            'User or Member record not found',
        )
    })
})

// ─── updateUserService ──────────────────────────────────────────────────────

describe('updateUserService', () => {
    beforeEach(() => jest.clearAllMocks())

    it('throws NotFoundException when user not found', async () => {
        ;(UserModel.findById as jest.Mock).mockResolvedValue(null)
        ;(MemberModel.findOne as jest.Mock).mockReturnValue({
            populate: jest.fn().mockResolvedValue(makeMember()),
        })

        await expect(updateUserService('user_1', {} as any)).rejects.toThrow('User not found')
    })

    it('throws BadRequestException when member not found', async () => {
        ;(UserModel.findById as jest.Mock).mockResolvedValue(makeUser())
        ;(MemberModel.findOne as jest.Mock).mockReturnValue({
            populate: jest.fn().mockResolvedValue(null),
        })

        await expect(updateUserService('user_1', {} as any)).rejects.toThrow(
            'User or Member record not found',
        )
    })

    it('saves user and returns fresh user data (not stale member.userId)', async () => {
        const user = makeUser({ bio: 'old bio' })
        const member = makeMember()
        ;(UserModel.findById as jest.Mock).mockResolvedValue(user)
        ;(MemberModel.findOne as jest.Mock).mockReturnValue({
            populate: jest.fn().mockResolvedValue(member),
        })

        const result = await updateUserService('user_1', { bio: 'new bio' } as any)

        expect(user.save).toHaveBeenCalledTimes(1)
        expect(user.bio).toBe('new bio')
        // returns user.toObject(), not member.userId
        expect(result.user).toBe(user)
    })

    it('updates profile picture and deletes old cloudinary image', async () => {
        const user = makeUser({
            profilePicture: 'https://res.cloudinary.com/demo/image/upload/v1234/avatars/old.jpg',
        })
        const member = makeMember()
        ;(UserModel.findById as jest.Mock).mockResolvedValue(user)
        ;(MemberModel.findOne as jest.Mock).mockReturnValue({
            populate: jest.fn().mockResolvedValue(member),
        })

        const profilePic = { path: 'https://res.cloudinary.com/demo/image/upload/v5678/avatars/new.jpg' } as any
        await updateUserService('user_1', {} as any, profilePic)

        expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(
            'avatars/old',
            { invalidate: true },
        )
        expect(user.profilePicture).toBe(profilePic.path)
    })

    it('does NOT call cloudinary.destroy when there is no existing picture', async () => {
        const user = makeUser({ profilePicture: null })
        const member = makeMember()
        ;(UserModel.findById as jest.Mock).mockResolvedValue(user)
        ;(MemberModel.findOne as jest.Mock).mockReturnValue({
            populate: jest.fn().mockResolvedValue(member),
        })

        const profilePic = { path: 'https://res.cloudinary.com/demo/image/upload/new.jpg' } as any
        await updateUserService('user_1', {} as any, profilePic)

        expect(cloudinary.uploader.destroy).not.toHaveBeenCalled()
    })

    it('sends verification email and resets isEmailVerified on email change', async () => {
        const user = makeUser({ email: 'old@example.com', isEmailVerified: true })
        const member = makeMember()
        ;(UserModel.findById as jest.Mock).mockResolvedValue(user)
        ;(UserModel.findOne as jest.Mock).mockResolvedValue(null) // no duplicate email
        ;(MemberModel.findOne as jest.Mock).mockReturnValue({
            populate: jest.fn().mockResolvedValue(member),
        })
        ;(VerificationCodeModel.create as jest.Mock).mockResolvedValue({ code: 'CODE123' })

        await updateUserService('user_1', { email: 'new@example.com' } as any)

        expect(user.email).toBe('new@example.com')
        expect(user.isEmailVerified).toBe(false)
        expect(VerificationCodeModel.create).toHaveBeenCalledTimes(1)
    })

    it('throws BadRequestException when new email is already taken', async () => {
        const user = makeUser({ email: 'old@example.com' })
        ;(UserModel.findById as jest.Mock).mockResolvedValue(user)
        ;(UserModel.findOne as jest.Mock).mockResolvedValue({ email: 'new@example.com' }) // duplicate
        ;(MemberModel.findOne as jest.Mock).mockReturnValue({
            populate: jest.fn().mockResolvedValue(makeMember()),
        })

        await expect(
            updateUserService('user_1', { email: 'new@example.com' } as any),
        ).rejects.toThrow('Email already in use')
    })

    it('runs UserModel.findById and MemberModel.findOne in parallel', async () => {
        const order: string[] = []
        ;(UserModel.findById as jest.Mock).mockImplementation(
            () => new Promise((r) => setTimeout(() => { order.push('user'); r(makeUser()) }, 10)),
        )
        ;(MemberModel.findOne as jest.Mock).mockReturnValue({
            populate: jest.fn().mockImplementation(
                () => new Promise((r) => setTimeout(() => { order.push('member'); r(makeMember()) }, 5)),
            ),
        })

        await updateUserService('user_1', {} as any)

        // member resolves first (5ms) before user (10ms) — proves parallel, not sequential
        expect(order).toEqual(['member', 'user'])
    })
})

// ─── updateUserProfileService ───────────────────────────────────────────────

describe('updateUserProfileService', () => {
    beforeEach(() => jest.clearAllMocks())

    it('updates only provided fields, leaves others unchanged', async () => {
        const user = makeUser({
            firstName: 'JOHN',
            lastName: 'DOE',
            jobTitle: 'Engineer',
            bio: 'old',
            phoneNumber: '000',
            address: 'old address',
            website: 'old.com',
        })
        ;(UserModel.findById as jest.Mock).mockResolvedValue(user)
        ;(MemberModel.findOne as jest.Mock).mockReturnValue({
            populate: jest.fn().mockResolvedValue(makeMember()),
        })

        await updateUserProfileService('user_1', { firstName: 'JANE', bio: 'new bio' } as any)

        expect(user.firstName).toBe('JANE')
        expect(user.bio).toBe('new bio')
        expect(user.lastName).toBe('DOE')      // unchanged
        expect(user.jobTitle).toBe('Engineer') // unchanged
        expect(user.save).toHaveBeenCalledTimes(1)
    })

    it('throws NotFoundException when user not found', async () => {
        ;(UserModel.findById as jest.Mock).mockResolvedValue(null)
        ;(MemberModel.findOne as jest.Mock).mockReturnValue({
            populate: jest.fn().mockResolvedValue(makeMember()),
        })

        await expect(updateUserProfileService('user_1', {} as any)).rejects.toThrow('User not found')
    })
})

// ─── updateUserPhotoProfileService ─────────────────────────────────────────

describe('updateUserPhotoProfileService', () => {
    beforeEach(() => jest.clearAllMocks())

    it('sets new profile picture and deletes old one from cloudinary', async () => {
        const user = makeUser({
            profilePicture: 'https://res.cloudinary.com/demo/image/upload/v999/folder/old.png',
        })
        ;(UserModel.findById as jest.Mock).mockResolvedValue(user)
        ;(MemberModel.findOne as jest.Mock).mockReturnValue({
            populate: jest.fn().mockResolvedValue(makeMember()),
        })

        const file = { path: 'https://res.cloudinary.com/demo/image/upload/new.png' } as any
        await updateUserPhotoProfileService('user_1', file)

        expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('folder/old', { invalidate: true })
        expect(user.profilePicture).toBe(file.path)
        expect(user.save).toHaveBeenCalledTimes(1)
    })

    it('skips photo update when no file is provided', async () => {
        const user = makeUser({ profilePicture: 'https://res.cloudinary.com/demo/image/upload/existing.png' })
        ;(UserModel.findById as jest.Mock).mockResolvedValue(user)
        ;(MemberModel.findOne as jest.Mock).mockReturnValue({
            populate: jest.fn().mockResolvedValue(makeMember()),
        })

        await updateUserPhotoProfileService('user_1', undefined)

        expect(cloudinary.uploader.destroy).not.toHaveBeenCalled()
        expect(user.profilePicture).toBe('https://res.cloudinary.com/demo/image/upload/existing.png')
    })

    it('throws NotFoundException when user not found', async () => {
        ;(UserModel.findById as jest.Mock).mockResolvedValue(null)
        ;(MemberModel.findOne as jest.Mock).mockReturnValue({
            populate: jest.fn().mockResolvedValue(makeMember()),
        })

        await expect(updateUserPhotoProfileService('user_1')).rejects.toThrow('User not found')
    })
})

// ─── Cloudinary publicId extraction (via integration path) ──────────────────

describe('Cloudinary public ID extraction', () => {
    const cases: [string, string | null][] = [
        ['https://res.cloudinary.com/demo/image/upload/v1234/folder/file.jpg', 'folder/file'],
        ['https://res.cloudinary.com/demo/image/upload/folder/file.png', 'folder/file'],
        ['https://res.cloudinary.com/demo/image/upload/v999/file.jpg', 'file'],
        ['https://res.cloudinary.com/demo/image/upload/a/b/c/file.webp', 'a/b/c/file'],
        ['https://example.com/not-cloudinary.jpg', null],
    ]

    beforeEach(() => jest.clearAllMocks())

    it.each(cases)('extracts correct publicId from %s', async (url, expectedPublicId) => {
        const user = makeUser({ profilePicture: url })
        ;(UserModel.findById as jest.Mock).mockResolvedValue(user)
        ;(MemberModel.findOne as jest.Mock).mockReturnValue({
            populate: jest.fn().mockResolvedValue(makeMember()),
        })

        const file = { path: 'https://res.cloudinary.com/demo/image/upload/new.jpg' } as any
        await updateUserPhotoProfileService('user_1', file)

        if (expectedPublicId && url.includes('cloudinary')) {
            expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(
                expectedPublicId,
                { invalidate: true },
            )
        } else {
            expect(cloudinary.uploader.destroy).not.toHaveBeenCalled()
        }
    })
})
