import { Router } from 'express'

import { deleteSession, getAllSession, getSession } from './session.controller'

const sessionRoutes = Router()
sessionRoutes.get('/all', getAllSession)
sessionRoutes.get('/', getSession)
sessionRoutes.delete('/:id', deleteSession)
export default sessionRoutes
