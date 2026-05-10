import { Request, Response } from 'express'

import { HTTPSTATUS } from '../../config/http.config'
import { asyncHandler } from '../../middlewares/asyncHandler.middleware'
import * as CompanyService from './company.service'
import { createCompanySchema, updateCompanySchema } from './company.validation'

/**
 * Mendapatkan daftar perusahaan dengan filter & pagination
 */
export const getCompaniesController = asyncHandler(async (req: Request, res: Response) => {
    const result = await CompanyService.getCompaniesService(req.query)

    return res.status(HTTPSTATUS.OK).json({
        message: 'Companies retrieved successfully',
        ...result,
    })
})

/**
 * @desc    Mendapatkan detail perusahaan berdasarkan slug
 * @route   GET /api/v1/companies/profile/:slug
 * @access  Public
 */
export const getCompanyBySlugController = asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params

    // Memanggil service yang sudah Anda buat
    const company = await CompanyService.getCompanyBySlugService(slug.toString())

    return res.status(HTTPSTATUS.OK).json({
        message: 'Company profile retrieved successfully',
        company,
    })
})

/**
 * Membuat perusahaan baru tunggal
 */
export const createCompanyController = asyncHandler(async (req: Request, res: Response) => {
    // Validasi input menggunakan Zod
    const body = createCompanySchema.parse(req.body)

    const company = await CompanyService.createCompanyService(body)

    return res.status(HTTPSTATUS.CREATED).json({
        message: 'Company created successfully',
        company,
    })
})

/**
 * Mengupdate data perusahaan
 */
export const updateCompanyController = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params

    // partial() memastikan user bisa mengirim field tertentu saja
    const body = updateCompanySchema.parse(req.body)

    const company = await CompanyService.updateCompanyService(id.toString(), body)

    return res.status(HTTPSTATUS.OK).json({
        message: 'Company updated successfully',
        company,
    })
})

/**
 * Import banyak perusahaan sekaligus (Bulk Insert)
 */
export const bulkCreateCompanyController = asyncHandler(async (req: Request, res: Response) => {
    // Pastikan req.body adalah array perusahaan
    const companies = await CompanyService.bulkCreateCompanyService(req.body)

    return res.status(HTTPSTATUS.CREATED).json({
        // message: `${companies.length} companies imported successfully`,
        companies,
    })
})
