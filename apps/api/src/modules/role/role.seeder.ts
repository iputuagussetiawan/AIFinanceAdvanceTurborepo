import { RolePermissions } from './role-permission.util'
import RoleModel from './roles-permission.model'

export const seedRoles = async () => {
    console.log('🧹 Clearing existing roles...')
    await RoleModel.deleteMany({})

    for (const roleName in RolePermissions) {
        const role = roleName as keyof typeof RolePermissions
        const permissions = RolePermissions[role]

        const newRole = new RoleModel({
            name: role,
            permissions: permissions,
        })

        await newRole.save()
        console.log(`🌱 [Seeder] Role "${role}" added.`)
    }
}
