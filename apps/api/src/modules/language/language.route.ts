import { Router } from 'express'

import {
    bulkCreateLanguageController,
    createLanguageController,
    deleteLanguageController,
    getAllLanguagesController,
    getLanguageByIdController,
    updateLanguageController,
} from './language.controller'

const languageRoutes = Router()

// 1. Create a new language
// POST /api/languages
languageRoutes.post('/', createLanguageController)

// 2. Bulk create languages (Operasi banyak data sekaligus)
// POST /api/languages/bulk
languageRoutes.post('/bulk', bulkCreateLanguageController)

// 3. Get all languages (Use ?active=true for frontend dropdowns)
// GET /api/languages
languageRoutes.get('/', getAllLanguagesController)

// 4. Get a single language by its ID
// GET /api/languages/:id
languageRoutes.get('/:id', getLanguageByIdController)

// 4. Update a language by ID
// PATCH /api/languages/:id
languageRoutes.patch('/:id', updateLanguageController)

// 5. Delete a language by ID
// DELETE /api/languages/:id
languageRoutes.delete('/:id', deleteLanguageController)

export default languageRoutes
