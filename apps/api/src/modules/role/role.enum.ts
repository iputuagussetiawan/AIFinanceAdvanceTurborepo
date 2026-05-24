export const Roles = {
    OWNER:      'OWNER',
    ADMIN:      'ADMIN',
    MANAGER:    'MANAGER',
    ACCOUNTANT: 'ACCOUNTANT',
    AUDITOR:    'AUDITOR',
    MEMBER:     'MEMBER',
    JOBSEEKER:  'JOBSEEKER',
    COMPANY:    'COMPANY',
    GUEST:      'GUEST',
} as const

export type RoleType = keyof typeof Roles

export const Permissions = {
    // CV
    CREATE_CV:  'cv:create',
    DELETE_CV:  'cv:delete',
    EDIT_CV:    'cv:update',
    MANAGE_CV:  'cv:manage',

    // Company
    CREATE_COMPANY:          'company:create',
    DELETE_COMPANY:          'company:delete',
    EDIT_COMPANY:            'company:update',
    MANAGE_COMPANY_SETTINGS: 'company:manage-settings',

    // Company users
    ADD_COMPANY_USER:         'company-user:add',
    CHANGE_COMPANY_USER_ROLE: 'company-user:change-role',
    REMOVE_COMPANY_USER:      'company-user:remove',
    MANAGE_COMPANY_USER:      'company-user:manage',

    // Members
    ADD_MEMBER:         'member:add',
    CHANGE_MEMBER_ROLE: 'member:change-role',
    REMOVE_MEMBER:      'member:remove',

    // Fiscal year
    CREATE_FISCAL_YEAR: 'fiscal-year:create',
    DELETE_FISCAL_YEAR: 'fiscal-year:delete',
    EDIT_FISCAL_YEAR:   'fiscal-year:update',
    MANAGE_FISCAL_YEAR: 'fiscal-year:manage',

    // Chart of accounts
    CREATE_COA: 'coa:create',
    EDIT_COA:   'coa:update',
    DELETE_COA: 'coa:delete',
    MANAGE_COA: 'coa:manage',

    // Journal
    CREATE_JOURNAL: 'journal:create',
    EDIT_JOURNAL:   'journal:update',
    DELETE_JOURNAL: 'journal:delete',
    MANAGE_JOURNAL: 'journal:manage',
    APPROVE_JOURNAL:'journal:approve',

    // General
    VIEW_ONLY: 'view:only',

    // Jobs
    POST_JOB:            'job:create',
    EDIT_JOB:            'job:update',
    DELETE_JOB:          'job:delete',
    MANAGE_JOBS:         'job:manage',
    VIEW_APPLICATIONS:   'application:read',
    MANAGE_APPLICATIONS: 'application:manage',
    APPLY_JOB:           'job:apply',
    VIEW_JOBS:           'job:read',
} as const

export type PermissionType = typeof Permissions[keyof typeof Permissions]
