import { Inject, Injectable } from '@nestjs/common'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { eq } from 'drizzle-orm'

import { DRIZZLE } from '../database/drizzle.provider'
import * as schema from '../database/schema'
import { users } from '../database/schema/users.schema'
import { RoleService } from '../role/role.service'
import { SessionService } from '../session/session.service'
import { NotFoundException } from '../common/exceptions/app-error'

@Injectable()
export class UserService {
    constructor(
        @Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>,
        private roleService: RoleService,
        private sessionService: SessionService,
    ) {}

    async getMe(userId: string, sessionId: string) {
        const [user] = await this.db
            .select({
                id: users.id,
                email: users.email,
                firstName: users.firstName,
                lastName: users.lastName,
                profilePicture: users.profilePicture,
                isEmailVerified: users.isEmailVerified,
                isActive: users.isActive,
                provider: users.provider,
                lastLogin: users.lastLogin,
                createdAt: users.createdAt,
                updatedAt: users.updatedAt,
            })
            .from(users)
            .where(eq(users.id, userId))
            .limit(1)

        if (!user) throw new NotFoundException('User not found')

        const userRoles = await this.roleService.getUserRoles(userId)
        const permissions = await this.roleService.getUserPermissions(userId)
        const allSessions = await this.sessionService.getUserSessions(userId, sessionId)
        const currentSession = allSessions.find((s) => s.isCurrent) ?? null
        const otherSessions = allSessions.filter((s) => !s.isCurrent)

        return {
            ...user,
            role: userRoles[0]?.name ?? null,
            permissions,
            currentSession,
            sessions: otherSessions,
        }
    }
}
