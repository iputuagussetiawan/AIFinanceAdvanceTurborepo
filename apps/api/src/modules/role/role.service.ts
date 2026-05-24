import { BadRequestException, NotFoundException } from '../../utils/appError'
import UserModel from '../user/user.model'
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
        await UserModel.findByIdAndUpdate(userId, { role: role._id, joinedAt: new Date() })
        return { message: 'Role assigned to user' }
    },

    removeRoleFromUser: async (userId: string) => {
        await UserModel.findByIdAndUpdate(userId, { $unset: { role: '' }, joinedAt: null })
        return { message: 'Role removed from user' }
    },

    getUserRoles: async (userId: string) => {
        const user = await UserModel.findById(userId).populate('role')
        if (!user?.role) return []
        return [user.role]
    },

    getUserPermissions: async (userId: string) => {
        const user = await UserModel.findById(userId).populate('role')
        const role = user?.role as any
        return role?.permissions ?? []
    },
}
