import { Inject, Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { eq } from 'drizzle-orm'

import { DRIZZLE } from '../database/drizzle.provider'
import * as schema from '../database/schema'
import { users } from '../database/schema/users.schema'
import { RoleService } from '../role/role.service'
import { SessionService } from '../session/session.service'
import { UploadService } from '../upload/upload.service'
import { BadRequestException, NotFoundException, UnauthorizedException } from '../common/exceptions/app-error'
import type { UpdateProfileDto } from './dto/update-profile.dto'
import type { ChangePasswordDto } from './dto/change-password.dto'

@Injectable()
export class UserService {
    constructor(
        @Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>,
        private roleService: RoleService,
        private sessionService: SessionService,
        private uploadService: UploadService,
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

    async updateAvatar(userId: string, file: Express.Multer.File) {
        this.uploadService.validateImage(file)

        const [user] = await this.db
            .select({ id: users.id, profilePicture: users.profilePicture })
            .from(users)
            .where(eq(users.id, userId))
            .limit(1)

        if (!user) throw new NotFoundException('User not found')

        if (user.profilePicture) {
            await this.uploadService.deleteByUrl(user.profilePicture)
        }

        const result = await this.uploadService.uploadStream(file.buffer, 'profile-pictures')

        await this.db
            .update(users)
            .set({ profilePicture: result.secure_url, updatedAt: new Date() })
            .where(eq(users.id, userId))

        return { profilePicture: result.secure_url }
    }

    async updateProfile(userId: string, dto: UpdateProfileDto) {
        if (!dto.firstName && !dto.lastName) {
            throw new BadRequestException('At least one field must be provided')
        }

        const patch: Record<string, unknown> = { updatedAt: new Date() }
        if (dto.firstName) patch.firstName = dto.firstName.trim()
        if (dto.lastName) patch.lastName = dto.lastName.trim()

        const [updated] = await this.db
            .update(users)
            .set(patch)
            .where(eq(users.id, userId))
            .returning({
                id: users.id,
                firstName: users.firstName,
                lastName: users.lastName,
                updatedAt: users.updatedAt,
            })

        if (!updated) throw new NotFoundException('User not found')

        return updated
    }

    async changePassword(userId: string, dto: ChangePasswordDto) {
        const [user] = await this.db
            .select({ id: users.id, password: users.password, provider: users.provider })
            .from(users)
            .where(eq(users.id, userId))
            .limit(1)

        if (!user) throw new NotFoundException('User not found')

        if (user.provider !== 'email' || !user.password) {
            throw new BadRequestException('Password change is only available for email accounts')
        }

        const isMatch = await bcrypt.compare(dto.currentPassword, user.password)
        if (!isMatch) throw new UnauthorizedException('Current password is incorrect')

        if (dto.currentPassword === dto.newPassword) {
            throw new BadRequestException('New password must be different from current password')
        }

        const hashed = await bcrypt.hash(dto.newPassword, 10)

        await this.db
            .update(users)
            .set({ password: hashed, updatedAt: new Date() })
            .where(eq(users.id, userId))

        return { message: 'Password changed successfully' }
    }
}
