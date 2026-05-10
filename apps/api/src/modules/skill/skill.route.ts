import { Router } from 'express'

import * as SkillController from './skill.controller'

const skillRoutes = Router()
skillRoutes.get('/', SkillController.getSkillsController)
skillRoutes.get('/search', SkillController.searchSkillsController)
skillRoutes.post('/', SkillController.createSkillController)
skillRoutes.post('/bulk', SkillController.bulkCreateSkillController)
skillRoutes.put('/:id', SkillController.updateSkillController)
skillRoutes.delete('/:id', SkillController.deleteSkillController)

export default skillRoutes