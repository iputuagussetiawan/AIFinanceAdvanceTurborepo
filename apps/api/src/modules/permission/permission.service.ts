import { BadRequestException, NotFoundException } from '../../utils/appError'
import PermissionModel from './permission.model'

export const PermissionService = {
    findAll: async () => {
        return PermissionModel.find().sort({ name: 1 })
    },

    findById: async (id: string) => {
        const perm = await PermissionModel.findById(id)
        if (!perm) throw new NotFoundException('Permission not found')
        return perm
    },

    create: async (data: { name: string; description?: string }) => {
        const existing = await PermissionModel.findOne({ name: data.name.toUpperCase() })
        if (existing) throw new BadRequestException('Permission already exists')

        const perm = new PermissionModel(data)
        await perm.save()
        return perm
    },

    update: async (id: string, data: { name?: string; description?: string }) => {
        const perm = await PermissionModel.findById(id)
        if (!perm) throw new NotFoundException('Permission not found')

        if (data.name) {
            const conflict = await PermissionModel.findOne({ name: data.name.toUpperCase(), _id: { $ne: id } })
            if (conflict) throw new BadRequestException('Permission name already in use')
            perm.name = data.name.toUpperCase()
        }
        if (data.description !== undefined) perm.description = data.description

        await perm.save()
        return perm
    },

    remove: async (id: string) => {
        const perm = await PermissionModel.findById(id)
        if (!perm) throw new NotFoundException('Permission not found')
        await PermissionModel.findByIdAndDelete(id)
        return { message: 'Permission deleted' }
    },
}
