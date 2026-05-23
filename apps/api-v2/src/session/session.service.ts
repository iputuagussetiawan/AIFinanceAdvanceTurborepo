import { Inject, Injectable } from '@nestjs/common'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { eq, and, ne } from 'drizzle-orm'

import { DRIZZLE } from '../database/drizzle.provider'
import * as schema from '../database/schema'
import { sessions } from '../database/schema/sessions.schema'
import { ForbiddenException, NotFoundException } from '../common/exceptions/app-error'

function extractVersion(ua: string, pattern: RegExp): string {
    const match = ua.match(pattern)
    return match?.[1] ?? ''
}

export function parseUserAgent(ua: string = '') {
    // --- API clients (check before browser detection) ---
    if (/apidog/i.test(ua)) {
        const v = extractVersion(ua, /apidog\/([\d.]+)/i)
        return { deviceType: 'api-client', browser: v ? `Apidog ${v}` : 'Apidog', os: 'API Client' }
    }
    if (/PostmanRuntime/i.test(ua)) {
        const v = extractVersion(ua, /PostmanRuntime\/([\d.]+)/i)
        return { deviceType: 'api-client', browser: v ? `Postman ${v}` : 'Postman', os: 'API Client' }
    }
    if (/insomnia/i.test(ua)) {
        const v = extractVersion(ua, /insomnia\/([\d.]+)/i)
        return { deviceType: 'api-client', browser: v ? `Insomnia ${v}` : 'Insomnia', os: 'API Client' }
    }
    if (/Thunder ?Client/i.test(ua)) {
        const v = extractVersion(ua, /Thunder ?Client\/([\d.]+)/i)
        return { deviceType: 'api-client', browser: v ? `Thunder Client ${v}` : 'Thunder Client', os: 'API Client' }
    }
    if (/HTTPie/i.test(ua)) {
        const v = extractVersion(ua, /HTTPie\/([\d.]+)/i)
        return { deviceType: 'api-client', browser: v ? `HTTPie ${v}` : 'HTTPie', os: 'API Client' }
    }
    if (/^curl\//i.test(ua)) {
        const v = extractVersion(ua, /curl\/([\d.]+)/i)
        return { deviceType: 'api-client', browser: v ? `curl ${v}` : 'curl', os: 'API Client' }
    }
    if (/python-requests/i.test(ua)) {
        const v = extractVersion(ua, /python-requests\/([\d.]+)/i)
        return { deviceType: 'api-client', browser: v ? `Python Requests ${v}` : 'Python Requests', os: 'API Client' }
    }
    if (/axios/i.test(ua)) {
        const v = extractVersion(ua, /axios\/([\d.]+)/i)
        return { deviceType: 'api-client', browser: v ? `Axios ${v}` : 'Axios', os: 'API Client' }
    }
    if (/node-fetch/i.test(ua)) {
        return { deviceType: 'api-client', browser: 'node-fetch', os: 'API Client' }
    }

    // --- OS ---
    let os = 'Unknown'
    if (/Windows NT ([\d.]+)/i.test(ua)) {
        const ntMap: Record<string, string> = {
            '10.0': 'Windows 10/11', '6.3': 'Windows 8.1',
            '6.2': 'Windows 8', '6.1': 'Windows 7',
        }
        const ntV = extractVersion(ua, /Windows NT ([\d.]+)/i)
        os = ntMap[ntV] ?? `Windows NT ${ntV}`
    } else if (/Android ([\d.]+)/i.test(ua)) {
        const v = extractVersion(ua, /Android ([\d.]+)/i)
        os = v ? `Android ${v}` : 'Android'
    } else if (/iPhone OS ([\d_]+)/i.test(ua)) {
        const v = extractVersion(ua, /iPhone OS ([\d_]+)/i).replace(/_/g, '.')
        os = v ? `iOS ${v}` : 'iOS'
    } else if (/iPad.*OS ([\d_]+)/i.test(ua)) {
        const v = extractVersion(ua, /OS ([\d_]+)/i).replace(/_/g, '.')
        os = v ? `iPadOS ${v}` : 'iPadOS'
    } else if (/Mac OS X ([\d_]+)/i.test(ua)) {
        const v = extractVersion(ua, /Mac OS X ([\d_.]+)/i).replace(/_/g, '.')
        os = v ? `macOS ${v}` : 'macOS'
    } else if (/Linux/i.test(ua)) {
        os = 'Linux'
    }

    // --- Device type ---
    let deviceType = 'desktop'
    if (/iPad/i.test(ua)) deviceType = 'tablet'
    else if (/Mobile|Android|iPhone|iPod/i.test(ua)) deviceType = 'mobile'

    // --- Browser (order matters) ---
    let browser = 'Unknown'
    if (/Edg\/([\d.]+)/i.test(ua)) {
        const v = extractVersion(ua, /Edg\/([\d.]+)/i).split('.')[0]
        browser = `Edge ${v}`
    } else if (/OPR\/([\d.]+)/i.test(ua)) {
        const v = extractVersion(ua, /OPR\/([\d.]+)/i).split('.')[0]
        browser = `Opera ${v}`
    } else if (/SamsungBrowser\/([\d.]+)/i.test(ua)) {
        const v = extractVersion(ua, /SamsungBrowser\/([\d.]+)/i).split('.')[0]
        browser = `Samsung Browser ${v}`
    } else if (/Chrome\/([\d.]+)/i.test(ua)) {
        const v = extractVersion(ua, /Chrome\/([\d.]+)/i).split('.')[0]
        browser = `Chrome ${v}`
    } else if (/Firefox\/([\d.]+)/i.test(ua)) {
        const v = extractVersion(ua, /Firefox\/([\d.]+)/i).split('.')[0]
        browser = `Firefox ${v}`
    } else if (/Version\/([\d.]+).*Safari/i.test(ua)) {
        const v = extractVersion(ua, /Version\/([\d.]+)/i).split('.')[0]
        browser = `Safari ${v}`
    } else if (/Safari/i.test(ua)) {
        browser = 'Safari'
    }

    return { deviceType, browser, os }
}

@Injectable()
export class SessionService {
    constructor(
        @Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>,
    ) {}

    async getUserSessions(userId: string, currentSessionId: string) {
        const rows = await this.db
            .select()
            .from(sessions)
            .where(eq(sessions.userId, userId))
            .orderBy(sessions.updatedAt)

        return rows.map((s) => ({
            id: s.id,
            ip: s.ip,
            deviceType: s.deviceType,
            browser: s.browser,
            os: s.os,
            expiredAt: s.expiredAt,
            createdAt: s.createdAt,
            updatedAt: s.updatedAt,
            isCurrent: s.id === currentSessionId,
        }))
    }

    async revokeSession(userId: string, sessionId: string) {
        const [session] = await this.db
            .select()
            .from(sessions)
            .where(and(eq(sessions.id, sessionId), eq(sessions.userId, userId)))
            .limit(1)

        if (!session) throw new NotFoundException('Session not found')

        await this.db.delete(sessions).where(eq(sessions.id, sessionId))
        return { message: 'Session revoked' }
    }

    async revokeAllOtherSessions(userId: string, currentSessionId: string) {
        const deleted = await this.db
            .delete(sessions)
            .where(and(eq(sessions.userId, userId), ne(sessions.id, currentSessionId)))
            .returning({ id: sessions.id })

        return { message: `${deleted.length} session(s) revoked` }
    }
}
