import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { jwtVerify } from 'jose'

import { AUTH_COOKIE_NAME, SIGNIN_URL } from '@/lib/constants'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

// redirectPath: the page to return to after a successful silent refresh
export async function requireAuth(redirectPath: string = '/dashboard') {
    const cookieStore = await cookies()
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value

    if (!token) {
        redirect(`/api/auth/silent-refresh?redirect=${encodeURIComponent(redirectPath)}`)
    }

    try {
        await jwtVerify(token, SECRET, { audience: 'user' })
    } catch {
        // Token expired — silent-refresh will get a new one and redirect back
        redirect(`/api/auth/silent-refresh?redirect=${encodeURIComponent(redirectPath)}`)
    }
}
