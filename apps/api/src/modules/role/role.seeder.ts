import RoleModel from './roles-permission.model'

const ROLES = [
    { name: 'ADMIN' },
    { name: 'COMPANY' },
    { name: 'JOBSEEKER' },
]

const ROLE_PERMISSIONS: Record<string, string[]> = {
    ADMIN: [
        'company:create', 'company:delete', 'company:update', 'company:manage-settings',
        'company-user:add', 'company-user:change-role', 'company-user:remove', 'company-user:manage',
        'fiscal-year:create', 'fiscal-year:delete', 'fiscal-year:update', 'fiscal-year:manage',
        'coa:create', 'coa:update', 'coa:delete', 'coa:manage',
        'journal:create', 'journal:update', 'journal:delete', 'journal:manage',
        'job:create', 'job:update', 'job:delete', 'job:manage',
        'application:read', 'application:manage',
        'job:read', 'view:only',
    ],
    COMPANY: [
        'job:create', 'job:update', 'job:delete', 'job:manage',
        'application:read', 'application:manage',
        'company:update', 'company:manage-settings',
        'company-user:add', 'company-user:remove',
        'view:only',
    ],
    JOBSEEKER: [
        'cv:create', 'cv:delete', 'cv:update', 'cv:manage',
        'job:apply', 'job:read',
    ],
}

export const seedRoles = async (): Promise<Map<string, string>> => {
    const map = new Map<string, string>()
    console.log('Seeding roles...')
    for (const row of ROLES) {
        const existing = await RoleModel.findOne({ name: row.name })
        if (existing) {
            map.set(row.name, existing.id as string)
            console.log(`  skip  role: ${row.name}`)
        } else {
            const created = await RoleModel.create({ name: row.name, permissions: [] })
            map.set(row.name, created.id as string)
            console.log(`  seed  role: ${row.name}`)
        }
    }
    return map
}

export const assignPermissions = async (roleMap: Map<string, string>) => {
    console.log('\nAssigning permissions to roles...')
    for (const [roleName, roleId] of roleMap) {
        const perms = ROLE_PERMISSIONS[roleName]
        if (!perms) continue
        await RoleModel.findByIdAndUpdate(roleId, { permissions: perms })
        console.log(`  ${roleName} -> [${perms.join(', ')}]`)
    }
}
