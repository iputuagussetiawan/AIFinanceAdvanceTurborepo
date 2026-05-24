import { Router } from 'express'

import { passportAuthenticateJWT } from '../../config/passport.config'
import { requireRole } from '../../middlewares/requireRole.middleware'
import { RoleController } from './role.controller'

const roleRoutes = Router()

roleRoutes.use(passportAuthenticateJWT, requireRole('ADMIN', 'OWNER'))

roleRoutes.get('/', RoleController.findAll)
roleRoutes.get('/:id', RoleController.findOne)
roleRoutes.get('/:id/permissions', RoleController.getRolePermissions)
roleRoutes.post('/', RoleController.create)
roleRoutes.put('/:id', RoleController.update)
roleRoutes.delete('/:id', RoleController.remove)
roleRoutes.post('/:id/permissions', RoleController.assignPermissions)
roleRoutes.post('/users/:userId/assign', RoleController.assignRoleToUser)
roleRoutes.delete('/users/:userId/role', RoleController.removeRoleFromUser)
roleRoutes.get('/users/:userId', RoleController.getUserRoles)

export default roleRoutes
