import { Router } from 'express'

import { passportAuthenticateJWT } from '../../config/passport.config'
import { requireRole } from '../../middlewares/requireRole.middleware'
import { PermissionController } from './permission.controller'

const permissionRoutes = Router()

permissionRoutes.use(passportAuthenticateJWT, requireRole('ADMIN', 'OWNER'))

permissionRoutes.get('/', PermissionController.findAll)
permissionRoutes.get('/:id', PermissionController.findOne)
permissionRoutes.post('/', PermissionController.create)
permissionRoutes.put('/:id', PermissionController.update)
permissionRoutes.delete('/:id', PermissionController.remove)

export default permissionRoutes
