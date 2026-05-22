import { Router } from 'express'

import { SkillController } from './skill.controller'

const skillRoutes = Router()

skillRoutes.get('/search', SkillController.searchSkills)
skillRoutes.get('/', SkillController.getSkills)
skillRoutes.get('/:id', SkillController.getSkillById)
skillRoutes.post('/', SkillController.createSkill)
skillRoutes.post('/bulk', SkillController.bulkCreateSkill)
skillRoutes.put('/:id', SkillController.updateSkill)
skillRoutes.delete('/bulk/soft', SkillController.bulkDeleteSkill)
skillRoutes.delete('/bulk/hard', SkillController.bulkHardDeleteSkill)
skillRoutes.delete('/hard/:id', SkillController.hardDeleteSkill)
skillRoutes.delete('/:id', SkillController.deleteSkill)

export default skillRoutes
