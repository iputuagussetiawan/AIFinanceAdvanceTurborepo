/**
 * @jest-environment node
 */
jest.mock('next/navigation', () => ({ redirect: jest.fn() }))
jest.mock('@/features/session/services/session-service', () => ({
    sessionService: { get: jest.fn() },
}))

import { redirect } from 'next/navigation'
import { sessionService } from '@/features/session/services/session-service'
import { protectDashboard } from '../dashboard-guard'

const mockRedirect = redirect as jest.MockedFunction<typeof redirect>
const mockGet = sessionService.get as jest.MockedFunction<typeof sessionService.get>

function makeUser(overrides: Partial<any> = {}) {
    return {
        user: { onboardingComplete: true, email: 'test@example.com', ...overrides },
    } as any
}

beforeEach(() => jest.clearAllMocks())

describe('protectDashboard', () => {
    it('redirects to /signin when sessionService returns null', async () => {
        mockGet.mockResolvedValue(null as any)
        await protectDashboard()
        expect(mockRedirect).toHaveBeenCalledWith('/signin')
    })

    it('redirects to /onboarding when onboardingComplete is false', async () => {
        mockGet.mockResolvedValue(makeUser({ onboardingComplete: false }))
        await protectDashboard()
        expect(mockRedirect).toHaveBeenCalledWith('/onboarding')
    })

    it('does not redirect when user is logged in and onboarding complete', async () => {
        mockGet.mockResolvedValue(makeUser({ onboardingComplete: true }))
        await protectDashboard()
        expect(mockRedirect).not.toHaveBeenCalled()
    })

    it('returns user data when access is granted', async () => {
        const userData = makeUser({ onboardingComplete: true })
        mockGet.mockResolvedValue(userData)
        const result = await protectDashboard()
        expect(result).toEqual(userData)
    })
})
