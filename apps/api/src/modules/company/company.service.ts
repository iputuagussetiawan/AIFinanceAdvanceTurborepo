import z from 'zod'

import { BadRequestException, NotFoundException } from '../../utils/appError'
import { CompanyModel, type CompanyDocument } from '../company/company.model'
import {
    createCompanySchema,
    type ICompanyInput,
    type ICompanyUpdate,
} from '../company/company.validation'

/**
 * Membuat perusahaan baru
 */
export const createCompanyService = async (data: ICompanyInput): Promise<CompanyDocument> => {
    // 1. Cek apakah slug sudah digunakan
    const existingSlug = await CompanyModel.findOne({ slug: data.slug })
    if (existingSlug) {
        throw new BadRequestException('Company slug is already in use')
    }
    // 2. Simpan ke database
    const company = new CompanyModel(data)
    await company.save()
    return company
}

/**
 * Bulk Insert Perusahaan
 * Cocok untuk import data dari CSV/Excel atau migrasi data
 */
export const bulkCreateCompanyService = async (companies: ICompanyInput[]) => {
    // 1. Validasi seluruh array menggunakan Zod
    const bulkSchema = z.array(createCompanySchema)
    const validation = bulkSchema.safeParse(companies)
    console.log(validation)
    try {
        /**
         * 2. Gunakan insertMany
         * ordered: true -> Akan berhenti jika ada satu yang error (misal duplicate slug)
         * ordered: false -> Akan lanjut memasukkan data lain meskipun ada yang error
         */
        console.log(validation)

        const result = await CompanyModel.insertMany(validation.data, {
            ordered: true,
        })

        return result as unknown as CompanyDocument[]
    } catch (error: any) {
        // Tangani error jika ada duplicate key (E11000) pada slug
        if (error.code === 11000) {
            throw new BadRequestException('Bulk insert failed: One or more slugs are duplicated')
        }
        throw error
    }
}

/**
 * Mengupdate data perusahaan
 */
export const updateCompanyService = async (
    companyId: string,
    updateData: ICompanyUpdate,
): Promise<CompanyDocument> => {
    // 1. Cari perusahaan
    const company = await CompanyModel.findById(companyId)
    if (!company) throw new NotFoundException('Company not found')

    // 2. Jika slug diubah, pastikan slug baru belum dipakai orang lain
    if (updateData.slug && updateData.slug !== company.slug) {
        const slugExists = await CompanyModel.findOne({ slug: updateData.slug })
        if (slugExists) {
            throw new BadRequestException('The new slug is already taken')
        }
    }

    // 3. Update field yang dikirim (Object.assign menangani partial update)
    Object.assign(company, updateData)

    await company.save()
    return company
}

/**
 * Mendapatkan detail perusahaan berdasarkan Slug (untuk Public Profile)
 */
export const getCompanyBySlugService = async (slug: string): Promise<CompanyDocument> => {
    const company = await CompanyModel.findOne({ slug, isActive: true })
    if (!company) throw new NotFoundException('Company profile not found')

    return company
}

/**
 * Mendapatkan daftar perusahaan dengan Filter & Pagination (untuk Admin Panel)
 */
export const getCompaniesService = async (query: any = {}) => {
    const { page = 1, limit = 10, search = '' } = query
    const skip = (page - 1) * limit

    const filter: any = {}
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { industry: { $regex: search, $options: 'i' } },
        ]
    }

    const [data, total] = await Promise.all([
        CompanyModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        CompanyModel.countDocuments(filter),
    ])

    return {
        data,
        meta: {
            total,
            page,
            lastPage: Math.ceil(total / limit),
        },
    }
}
