import { Router } from 'express'

import {
    bulkCreateLanguageController,
    createLanguageController,
    deleteLanguageController,
    getAllLanguagesController,
    getLanguageByIdController,
    searchLanguagesController,
    updateLanguageController,
} from './language.controller'

const languageRoutes = Router()

languageRoutes.post('/', createLanguageController)
languageRoutes.post('/bulk', bulkCreateLanguageController)
languageRoutes.get('/search', searchLanguagesController)
languageRoutes.get('/', getAllLanguagesController)
languageRoutes.get('/:id', getLanguageByIdController)
languageRoutes.patch('/:id', updateLanguageController)
languageRoutes.delete('/:id', deleteLanguageController)

export default languageRoutes