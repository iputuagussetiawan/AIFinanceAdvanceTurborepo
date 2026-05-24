import PermissionModel from './permission.model'

const PERMISSIONS = [
    { name: 'cv:create',  description: 'Create a CV/resume' },
    { name: 'cv:delete',  description: 'Delete a CV/resume' },
    { name: 'cv:update',  description: 'Edit a CV/resume' },
    { name: 'cv:manage',  description: 'Full CV management' },

    { name: 'company:create',          description: 'Create a company' },
    { name: 'company:delete',          description: 'Delete a company' },
    { name: 'company:update',          description: 'Edit company details' },
    { name: 'company:manage-settings', description: 'Manage company settings' },

    { name: 'company-user:add',         description: 'Add a user to a company' },
    { name: 'company-user:change-role', description: 'Change a company user role' },
    { name: 'company-user:remove',      description: 'Remove a user from a company' },
    { name: 'company-user:manage',      description: 'Full company user management' },

    { name: 'member:add',         description: 'Add a member' },
    { name: 'member:change-role', description: 'Change a member role' },
    { name: 'member:remove',      description: 'Remove a member' },

    { name: 'fiscal-year:create', description: 'Create a fiscal year' },
    { name: 'fiscal-year:delete', description: 'Delete a fiscal year' },
    { name: 'fiscal-year:update', description: 'Edit a fiscal year' },
    { name: 'fiscal-year:manage', description: 'Full fiscal year management' },

    { name: 'coa:create', description: 'Create a chart of accounts entry' },
    { name: 'coa:update', description: 'Edit a chart of accounts entry' },
    { name: 'coa:delete', description: 'Delete a chart of accounts entry' },
    { name: 'coa:manage', description: 'Full chart of accounts management' },

    { name: 'journal:create',  description: 'Create a journal entry' },
    { name: 'journal:update',  description: 'Edit a journal entry' },
    { name: 'journal:delete',  description: 'Delete a journal entry' },
    { name: 'journal:manage',  description: 'Full journal management' },
    { name: 'journal:approve', description: 'Approve and post journal entries' },

    { name: 'view:only', description: 'Read-only access' },

    { name: 'job:create',          description: 'Post a job listing' },
    { name: 'job:update',          description: 'Edit a job listing' },
    { name: 'job:delete',          description: 'Delete a job listing' },
    { name: 'job:manage',          description: 'Full job listing management' },
    { name: 'application:read',    description: 'View job applications' },
    { name: 'application:manage',  description: 'Manage job applications' },
    { name: 'job:apply',           description: 'Apply for a job' },
    { name: 'job:read',            description: 'View job listings' },
]

export const seedPermissions = async (): Promise<Map<string, string>> => {
    const map = new Map<string, string>()
    console.log('\nSeeding permissions...')
    for (const perm of PERMISSIONS) {
        const existing = await PermissionModel.findOne({ name: perm.name })
        if (existing) {
            map.set(perm.name, existing.id as string)
            console.log(`  skip  permission: ${perm.name}`)
        } else {
            const created = await PermissionModel.create(perm)
            map.set(perm.name, created.id as string)
            console.log(`  seed  permission: ${perm.name}`)
        }
    }
    return map
}
