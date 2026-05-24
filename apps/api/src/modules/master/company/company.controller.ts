import { Request, Response } from 'express'

import { HTTPSTATUS } from '../../../config/http.config'
import { asyncHandler } from '../../../middlewares/asyncHandler.middleware'
import { CompanyService } from './company.service'
import { createCompanySchema, updateCompanySchema } from './company.validation'

export const CompanyController = {
    searchCompanies: asyncHandler(async (req: Request, res: Response) => {
        const search = req.query.search as string | undefined
        const data = await CompanyService.searchCompanies(search)
        return res.status(HTTPSTATUS.OK).json({ message: 'Companies retrieved successfully', data })
    }),

    getCompanies: asyncHandler(async (req: Request, res: Response) => {
        const result = await CompanyService.getCompanies(req.query)
        return res.status(HTTPSTATUS.OK).json({ message: 'Companies retrieved successfully', ...result })
    }),

    getCompanyBySlug: asyncHandler(async (req: Request, res: Response) => {
        const { slug } = req.params
        const company = await CompanyService.getCompanyBySlug(slug.toString())
        return res.status(HTTPSTATUS.OK).json({ message: 'Company profile retrieved successfully', company })
    }),

    createCompany: asyncHandler(async (req: Request, res: Response) => {
        const body = createCompanySchema.parse(req.body)
        const company = await CompanyService.createCompany(body)
        return res.status(HTTPSTATUS.CREATED).json({ message: 'Company created successfully', company })
    }),

    updateCompany: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params
        const body = updateCompanySchema.parse(req.body)
        const company = await CompanyService.updateCompany(id.toString(), body)
        return res.status(HTTPSTATUS.OK).json({ message: 'Company updated successfully', company })
    }),

    bulkCreateCompany: asyncHandler(async (req: Request, res: Response) => {
        const companies = await CompanyService.bulkCreateCompany(req.body)
        return res.status(HTTPSTATUS.CREATED).json({ companies })
    }),
}
