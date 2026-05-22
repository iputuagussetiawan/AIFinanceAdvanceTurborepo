/**
 * @jest-environment node
 */
jest.mock('next/navigation', () => ({ redirect: jest.fn() }))
jest.mock('@/features/session/services/session-service', () => ({
    sessionService: { get: jest.fn() },
}))

import { redirect } from 'next/navigation'
import { sessionService } from '@/features/session/services/session-service'
import { protectOnboarding } from '../onboarding-guard'

const mockRedirect = redirect as jest.MockedFunction<typeof redirect>
const mockGet = sessionService.get as jest.MockedFunction<typeof sessionService.get>

function makeUser(onboardingComplete: boolean) {
    return { user: { onboardingComplete, email: 'test@example.com' } } as any
}

beforeEach(() => jest.clearAllMocks())

describe('protectOnboarding', () => {
    it('redirects to /signin when sessionService returns null', async () => {
        mockGet.mockResolvedValue(null as any)
        await protectOnboarding()
        expect(mockRedirect).toHaveBeenCalledWith('/signin')
    })

    it('redirects to /dashboard when onboardingComplete is true', async () => {
        mockGet.mockResolvedValue(makeUser(true))
        await protectOnboarding()
        expect(mockRedirect).toHaveBeenCalledWith('/dashboard')
    })

    it('does not redirect when onboarding is incomplete', async () => {
        mockGet.mockResolvedValue(makeUser(false))
        await protectOnboarding()
        expect(mockRedirect).not.toHaveBeenCalled()
    })

    it('returns user data when access is granted', async () => {
        const userData = makeUser(false)
        mockGet.mockResolvedValue(userData)
        const result = await protectOnboarding()
        expect(result).toEqual(userData)
    })
})
