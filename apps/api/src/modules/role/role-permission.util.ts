import { Permissions, type PermissionType, type RoleType } from './role.enum'

export const RolePermissions: Record<RoleType, Array<PermissionType>> = {
    OWNER: [
        Permissions.CREATE_COMPANY,
        Permissions.DELETE_COMPANY,
        Permissions.EDIT_COMPANY,
        Permissions.MANAGE_COMPANY_SETTINGS,

        Permissions.ADD_COMPANY_USER,
        Permissions.CHANGE_COMPANY_USER_ROLE,
        Permissions.REMOVE_COMPANY_USER,
        Permissions.MANAGE_COMPANY_USER,

        Permissions.CREATE_FISCAL_YEAR,
        Permissions.DELETE_FISCAL_YEAR,
        Permissions.EDIT_FISCAL_YEAR,
        Permissions.MANAGE_FISCAL_YEAR,

        Permissions.CREATE_COA,
        Permissions.EDIT_COA,
        Permissions.DELETE_COA,
        Permissions.MANAGE_COA,

        Permissions.CREATE_JOURNAL,
        Permissions.EDIT_JOURNAL,
        Permissions.DELETE_JOURNAL,
        Permissions.MANAGE_JOURNAL,

        Permissions.VIEW_ONLY,
    ],
    ADMIN: [
        Permissions.CREATE_COMPANY,
        Permissions.DELETE_COMPANY,
        Permissions.EDIT_COMPANY,
        Permissions.MANAGE_COMPANY_SETTINGS,

        Permissions.ADD_COMPANY_USER,
        Permissions.CHANGE_COMPANY_USER_ROLE,
        Permissions.REMOVE_COMPANY_USER,
        Permissions.MANAGE_COMPANY_USER,

        Permissions.CREATE_FISCAL_YEAR,
        Permissions.DELETE_FISCAL_YEAR,
        Permissions.EDIT_FISCAL_YEAR,
        Permissions.MANAGE_FISCAL_YEAR,

        Permissions.CREATE_COA,
        Permissions.EDIT_COA,
        Permissions.DELETE_COA,
        Permissions.MANAGE_COA,

        Permissions.CREATE_JOURNAL,
        Permissions.EDIT_JOURNAL,
        Permissions.DELETE_JOURNAL,
        Permissions.MANAGE_JOURNAL,

        Permissions.POST_JOB,
        Permissions.EDIT_JOB,
        Permissions.DELETE_JOB,
        Permissions.MANAGE_JOBS,
        Permissions.VIEW_APPLICATIONS,
        Permissions.MANAGE_APPLICATIONS,
        Permissions.VIEW_JOBS,

        Permissions.VIEW_ONLY,
    ],
    MANAGER: [Permissions.APPROVE_JOURNAL, Permissions.MANAGE_JOURNAL, Permissions.VIEW_ONLY],
    ACCOUNTANT: [
        Permissions.CREATE_JOURNAL,
        Permissions.EDIT_JOURNAL,
        Permissions.DELETE_JOURNAL,
        Permissions.MANAGE_JOURNAL,
    ],
    AUDITOR: [Permissions.VIEW_ONLY],
    MEMBER: [Permissions.VIEW_ONLY],
    JOBSEEKER: [
        Permissions.CREATE_CV,
        Permissions.DELETE_CV,
        Permissions.EDIT_CV,
        Permissions.MANAGE_CV,
        Permissions.APPLY_JOB,
        Permissions.VIEW_JOBS,
    ],
    COMPANY: [
        Permissions.POST_JOB,
        Permissions.EDIT_JOB,
        Permissions.DELETE_JOB,
        Permissions.MANAGE_JOBS,
        Permissions.VIEW_APPLICATIONS,
        Permissions.MANAGE_APPLICATIONS,
        Permissions.EDIT_COMPANY,
        Permissions.MANAGE_COMPANY_SETTINGS,
        Permissions.ADD_COMPANY_USER,
        Permissions.REMOVE_COMPANY_USER,
        Permissions.VIEW_ONLY,
    ],
    GUEST: [Permissions.VIEW_ONLY, Permissions.VIEW_JOBS],
}
