import { BadRequestException, NotFoundException } from '../../utils/appError'
import MemberModel from '../member/member.model'
import RoleModel from './roles-permission.model'

export const RoleService = {
    findAll: async () => {
        return RoleModel.find().sort({ name: 1 })
    },

    findById: async (id: string) => {
        const role = await RoleModel.findById(id)
        if (!role) throw new NotFoundException('Role not found')
        return role
    },

    findByName: async (name: string) => {
        return RoleModel.findOne({ name })
    },

    create: async (data: { name: string; description?: string }) => {
        const existing = await RoleModel.findOne({ name: data.name })
        if (existing) throw new BadRequestException('Role already exists')
        const role = new RoleModel({ name: data.name, permissions: [] })
        await role.save()
        return role
    },

    update: async (id: string, data: { name?: string; description?: string }) => {
        const role = await RoleModel.findById(id)
        if (!role) throw new NotFoundException('Role not found')
        if (data.name) role.name = data.name
        await role.save()
        return role
    },

    remove: async (id: string) => {
        const role = await RoleModel.findById(id)
        if (!role) throw new NotFoundException('Role not found')
        await RoleModel.findByIdAndDelete(id)
        return { message: 'Role deleted' }
    },

    assignPermissions: async (roleId: string, permissionNames: string[]) => {
        const role = await RoleModel.findById(roleId)
        if (!role) throw new NotFoundException('Role not found')
        role.permissions = permissionNames
        await role.save()
        return { message: 'Permissions assigned' }
    },

    getRolePermissions: async (roleId: string) => {
        const role = await RoleModel.findById(roleId)
        if (!role) throw new NotFoundException('Role not found')
        return role.permissions
    },

    assignRoleToUser: async (userId: string, roleId: string) => {
        const role = await RoleModel.findById(roleId)
        if (!role) throw new NotFoundException('Role not found')

        const existing = await MemberModel.findOne({ userId })
        if (existing) {
            existing.role = role as any
            await existing.save()
        } else {
            await MemberModel.create({ userId, role: role._id, joinedAt: new Date() })
        }
        return { message: 'Role assigned to user' }
    },

    removeRoleFromUser: async (userId: string) => {
        await MemberModel.findOneAndDelete({ userId })
        return { message: 'Role removed from user' }
    },

    getUserRoles: async (userId: string) => {
        const member = await MemberModel.findOne({ userId }).populate('role')
        if (!member) return []
        return [member.role]
    },

    getUserPermissions: async (userId: string) => {
        const member = await MemberModel.findOne({ userId }).populate('role')
        if (!member) return []
        const role = member.role as any
        return role?.permissions ?? []
    },
}
