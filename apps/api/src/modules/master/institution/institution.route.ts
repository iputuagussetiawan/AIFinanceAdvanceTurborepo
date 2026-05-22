import { Router } from 'express'

import { InstitutionController } from './institution.controller'

const institutionRoutes = Router()

institutionRoutes.post('/', InstitutionController.createInstitution)
institutionRoutes.post('/bulk', InstitutionController.bulkCreateInstitution)
institutionRoutes.get('/', InstitutionController.getInstitutionsSimple)
institutionRoutes.get('/:id', InstitutionController.getInstitutionById)
institutionRoutes.patch('/:id', InstitutionController.updateInstitution)
institutionRoutes.delete('/:id', InstitutionController.deleteInstitution)

export default institutionRoutes
