import { Router } from 'express'

import { LanguageController } from './language.controller'

const languageRoutes = Router()

languageRoutes.post('/', LanguageController.createLanguage)
languageRoutes.post('/bulk', LanguageController.bulkCreateLanguage)
languageRoutes.get('/search', LanguageController.searchLanguages)
languageRoutes.get('/', LanguageController.getAllLanguages)
languageRoutes.get('/:id', LanguageController.getLanguageById)
languageRoutes.patch('/:id', LanguageController.updateLanguage)
languageRoutes.delete('/:id', LanguageController.deleteLanguage)

export default languageRoutes
