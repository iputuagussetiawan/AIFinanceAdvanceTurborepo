import { Router } from 'express'

import { CompanyController } from './company.controller'

const companyRoutes = Router()
companyRoutes.get('/', CompanyController.getCompanies)
companyRoutes.get('/search', CompanyController.searchCompanies)
companyRoutes.get('/:slug', CompanyController.getCompanyBySlug)
companyRoutes.post('/', CompanyController.createCompany)
companyRoutes.post('/bulk', CompanyController.bulkCreateCompany)
companyRoutes.put('/:id', CompanyController.updateCompany)

export default companyRoutes
