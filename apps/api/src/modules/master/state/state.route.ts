import { Router } from 'express'

import { StateController } from './state.controller'

const stateRoutes = Router()

stateRoutes.get('/search', StateController.searchStates)
stateRoutes.get('/', StateController.getStates)
stateRoutes.get('/:id', StateController.getStateById)
stateRoutes.post('/', StateController.createState)
stateRoutes.post('/bulk', StateController.bulkCreateState)
stateRoutes.put('/:id', StateController.updateState)
stateRoutes.delete('/bulk/soft', StateController.bulkDeleteState)
stateRoutes.delete('/bulk/hard', StateController.bulkHardDeleteState)
stateRoutes.delete('/hard/:id', StateController.hardDeleteState)
stateRoutes.delete('/:id', StateController.deleteState)

export default stateRoutes
