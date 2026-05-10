export const Roles = {
    // Full access to the entire company/tenant settings and billing
    OWNER: 'OWNER',

    // System administration, user management, and configuration
    ADMIN: 'ADMIN',

    // Chief Financial Officer / Manager: Can approve "POSTED" entries and close Fiscal Years
    MANAGER: 'MANAGER',

    // Accountant: Can create, edit, and delete "DRAFT" journal entries
    ACCOUNTANT: 'ACCOUNTANT',

    // Auditor: Read-only access to all reports and ledger entries for compliance checks
    AUDITOR: 'AUDITOR',

    // Standard employee: Can only view their own data or submit expense requests
    MEMBER: 'MEMBER',

    // External viewer (e.g., a bank or investor) with limited read-only permissions
    GUEST: 'GUEST',
} as const

export type RoleType = keyof typeof Roles

export const Permissions = {
    CREATE_COMPANY: 'CREATE_COMPANY',
    DELETE_COMPANY: 'DELETE_COMPANY',
    EDIT_COMPANY: 'EDIT_COMPANY',
    MANAGE_COMPANY_SETTINGS: 'MANAGE_COMPANY_SETTINGS',

    ADD_COMPANY_USER: 'ADD_COMPANY_USER',
    CHANGE_COMPANY_USER_ROLE: 'CHANGE_COMPANY_USER_ROLE',
    REMOVE_COMPANY_USER: 'REMOVE_COMPANY_USER',
    MANAGE_COMPANY_USER: 'MANAGE_COMPANY_USER',

    CREATE_FISCAL_YEAR: 'CREATE_FISCAL_YEAR',
    DELETE_FISCAL_YEAR: 'DELETE_FISCAL_YEAR',
    EDIT_FISCAL_YEAR: 'EDIT_FISCAL_YEAR',
    MANAGE_FISCAL_YEAR: 'MANAGE_FISCAL_YEAR',

    CREATE_COA: 'CREATE_COA',
    EDIT_COA: 'EDIT_COA',
    DELETE_COA: 'DELETE_COA',
    MANAGE_COA: 'MANAGE_COA',

    CREATE_JOURNAL: 'CREATE_JOURNAL',
    EDIT_JOURNAL: 'EDIT_JOURNAL',
    DELETE_JOURNAL: 'DELETE_JOURNAL',
    MANAGE_JOURNAL: 'MANAGE_JOURNAL',
    APPROVE_JOURNAL: 'APPROVE_JOURNAL',

    VIEW_ONLY: 'VIEW_ONLY',
} as const

export type PermissionType = keyof typeof Permissions
