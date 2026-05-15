import { Router } from 'express'

import * as SkillController from './skill.controller'

const skillRoutes = Router()

skillRoutes.get('/search', SkillController.searchSkillsController)
skillRoutes.get('/', SkillController.getSkillsController)
skillRoutes.get('/:id', SkillController.getSkillByIdController)
skillRoutes.post('/', SkillController.createSkillController)
skillRoutes.post('/bulk', SkillController.bulkCreateSkillController)
skillRoutes.put('/:id', SkillController.updateSkillController)
skillRoutes.delete('/bulk/soft', SkillController.bulkDeleteSkillController)
skillRoutes.delete('/bulk/hard', SkillController.bulkHardDeleteSkillController)
skillRoutes.delete('/hard/:id', SkillController.hardDeleteSkillController)
skillRoutes.delete('/:id', SkillController.deleteSkillController)

export default skillRoutes
