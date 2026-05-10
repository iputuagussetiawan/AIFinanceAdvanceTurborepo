import { UnauthorizedException } from '../../utils/appError'
import { RolePermissions } from './role-permission.util'
import type { PermissionType } from './role.enum'

export const roleGuard = (
    role: keyof typeof RolePermissions,
    requiredPermissions: PermissionType[],
) => {
    const permissions = RolePermissions[role]
    // If the role doesn't exist or lacks required permissions, throw an exception
    const hasPermission = requiredPermissions.every((permission) =>
        permissions.includes(permission),
    )
    if (!hasPermission) {
        throw new UnauthorizedException(
            'You do not have the necessary permissions to perform this action',
        )
    }
}
