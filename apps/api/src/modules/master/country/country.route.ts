import { Router } from 'express'

import { CountryController } from './country.controller'

const countryRoutes = Router()

countryRoutes.get('/search', CountryController.searchCountries)
countryRoutes.get('/', CountryController.getCountries)
countryRoutes.get('/:id', CountryController.getCountryById)
countryRoutes.post('/', CountryController.createCountry)
countryRoutes.post('/bulk', CountryController.bulkCreateCountry)
countryRoutes.put('/:id', CountryController.updateCountry)
countryRoutes.delete('/bulk/soft', CountryController.bulkDeleteCountry)
countryRoutes.delete('/bulk/hard', CountryController.bulkHardDeleteCountry)
countryRoutes.delete('/hard/:id', CountryController.hardDeleteCountry)
countryRoutes.delete('/:id', CountryController.deleteCountry)

export default countryRoutes
