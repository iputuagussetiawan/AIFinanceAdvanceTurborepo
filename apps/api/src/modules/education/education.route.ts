import { Router } from 'express'

import {
    getEducationHistoryController,
    saveEducationHistoryController,
    updateEducationHistoryController,
} from './education.controller'

const educationRoutes = Router()
educationRoutes.post('/create', saveEducationHistoryController)
educationRoutes.get('/get', getEducationHistoryController)
educationRoutes.put('/bulk-update', updateEducationHistoryController)
export default educationRoutes
