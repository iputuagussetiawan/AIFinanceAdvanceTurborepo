import { Router } from 'express'

import { CityController } from './city.controller'

const cityRoutes = Router()

cityRoutes.get('/search', CityController.searchCities)
cityRoutes.get('/', CityController.getCities)
cityRoutes.get('/:id', CityController.getCityById)
cityRoutes.post('/', CityController.createCity)
cityRoutes.post('/bulk', CityController.bulkCreateCity)
cityRoutes.put('/:id', CityController.updateCity)
cityRoutes.delete('/bulk/soft', CityController.bulkDeleteCity)
cityRoutes.delete('/bulk/hard', CityController.bulkHardDeleteCity)
cityRoutes.delete('/hard/:id', CityController.hardDeleteCity)
cityRoutes.delete('/:id', CityController.deleteCity)

export default cityRoutes
