// lib/require-auth.ts
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { AUTH_COOKIE_NAME } from '@/lib/constants'
import { sessionService } from '@/features/session/services/session-service'

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function requireAuth() {
    const cookieStore = await cookies()
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
    if (!token) redirect('/signin')
    try {
        await jwtVerify(token, secret)
        // return user
    } catch {
        redirect('/signin')
    }
}