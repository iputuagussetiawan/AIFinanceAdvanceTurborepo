import { Inject, Injectable } from '@nestjs/common'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { eq } from 'drizzle-orm'

import { DRIZZLE } from '../database/drizzle.provider'
import * as schema from '../database/schema'
import { users } from '../database/schema/users.schema'
import { RoleService } from '../role/role.service'
import { NotFoundException } from '../common/exceptions/app-error'

@Injectable()
export class UserService {
    constructor(
        @Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>,
        private roleService: RoleService,
    ) {}

    async getMe(userId: string) {
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

        return {
            ...user,
            role: userRoles[0]?.name ?? null,
            permissions,
        }
    }
}
