import { Router } from 'express'

import * as CompanyController from './company.controller'

const companyRoutes = Router()
companyRoutes.get('/', CompanyController.getCompaniesController)
companyRoutes.get('/:slug', CompanyController.getCompanyBySlugController)
companyRoutes.post('/', CompanyController.createCompanyController)
companyRoutes.post('/bulk', CompanyController.bulkCreateCompanyController)
companyRoutes.put('/:id', CompanyController.updateCompanyController)

export default companyRoutes
