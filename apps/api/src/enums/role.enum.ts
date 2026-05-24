export const Roles = {
    OWNER:      'OWNER',
    ADMIN:      'ADMIN',
    MANAGER:    'MANAGER',
    ACCOUNTANT: 'ACCOUNTANT',
    AUDITOR:    'AUDITOR',
    MEMBER:     'MEMBER',
    GUEST:      'GUEST',
} as const

export type RoleType = keyof typeof Roles

export const Permissions = {
    CREATE_COMPANY:          'company:create',
    DELETE_COMPANY:          'company:delete',
    EDIT_COMPANY:            'company:update',
    MANAGE_COMPANY_SETTINGS: 'company:manage-settings',

    ADD_COMPANY_USER:         'company-user:add',
    CHANGE_COMPANY_USER_ROLE: 'company-user:change-role',
    REMOVE_COMPANY_USER:      'company-user:remove',
    MANAGE_COMPANY_USER:      'company-user:manage',

    CREATE_FISCAL_YEAR: 'fiscal-year:create',
    DELETE_FISCAL_YEAR: 'fiscal-year:delete',
    EDIT_FISCAL_YEAR:   'fiscal-year:update',
    MANAGE_FISCAL_YEAR: 'fiscal-year:manage',

    CREATE_COA: 'coa:create',
    EDIT_COA:   'coa:update',
    DELETE_COA: 'coa:delete',
    MANAGE_COA: 'coa:manage',

    CREATE_JOURNAL: 'journal:create',
    EDIT_JOURNAL:   'journal:update',
    DELETE_JOURNAL: 'journal:delete',
    MANAGE_JOURNAL: 'journal:manage',
    APPROVE_JOURNAL:'journal:approve',

    VIEW_ONLY: 'view:only',
} as const

export type PermissionType = typeof Permissions[keyof typeof Permissions]
