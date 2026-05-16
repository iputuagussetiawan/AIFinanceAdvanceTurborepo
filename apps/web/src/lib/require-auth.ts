// lib/require-auth.ts
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { decodeJwt } from 'jose'
import { AUTH_COOKIE_NAME } from '@/lib/constants'

export async function requireAuth() {
    const cookieStore = await cookies()
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value

    if (!token) redirect('/signin')

    try {
        const payload = decodeJwt(token)
        if (Date.now() >= (payload.exp || 0) * 1000) redirect('/signin')
    } catch {
        redirect('/signin')
    }
}