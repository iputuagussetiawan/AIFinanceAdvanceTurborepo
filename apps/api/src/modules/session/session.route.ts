import { Router } from 'express'

import { SessionController } from './session.controller'

const sessionRoutes = Router()
sessionRoutes.get('/all', SessionController.getAllSessions)
sessionRoutes.get('/', SessionController.getSession)
sessionRoutes.delete('/:id', SessionController.deleteSession)
export default sessionRoutes
