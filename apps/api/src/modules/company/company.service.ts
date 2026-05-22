import z from 'zod'

import { BadRequestException, NotFoundException } from '../../utils/appError'
import { CompanyModel, type CompanyDocument } from '../company/company.model'
import {
    createCompanySchema,
    type ICompanyInput,
    type ICompanyUpdate,
} from '../company/company.validation'

export const createCompanyService = async (data: ICompanyInput): Promise<CompanyDocument> => {
    const existingSlug = await CompanyModel.findOne({ slug: data.slug })
    if (existingSlug) {
        throw new BadRequestException('Company slug is already in use')
    }
    const company = new CompanyModel(data)
    await company.save()
    return company
}

export const bulkCreateCompanyService = async (companies: ICompanyInput[]) => {
    const bulkSchema = z.array(createCompanySchema)
    const validation = bulkSchema.safeParse(companies)
    try {
        const result = await CompanyModel.insertMany(validation.data, { ordered: true })
        return result as unknown as CompanyDocument[]
    } catch (error: any) {
        if (error.code === 11000) {
            throw new BadRequestException('Bulk insert failed: One or more slugs are duplicated')
        }
        throw error
    }
}

export const updateCompanyService = async (
    companyId: string,
    updateData: ICompanyUpdate,
): Promise<CompanyDocument> => {
    const company = await CompanyModel.findById(companyId)
    if (!company) throw new NotFoundException('Company not found')

    if (updateData.slug && updateData.slug !== company.slug) {
        const slugExists = await CompanyModel.findOne({ slug: updateData.slug })
        if (slugExists) {
            throw new BadRequestException('The new slug is already taken')
        }
    }

    Object.assign(company, updateData)
    await company.save()
    return company
}

export const getCompanyBySlugService = async (slug: string): Promise<CompanyDocument> => {
    const company = await CompanyModel.findOne({ slug, isActive: true })
    if (!company) throw new NotFoundException('Company profile not found')
    return company
}

export const getCompaniesService = async (query: any = {}) => {
    const { page = 1, limit = 10, search = '' } = query
    const skip = (Number(page) - 1) * Number(limit)

    const filter: any = { isActive: true }
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { industry: { $regex: search, $options: 'i' } },
        ]
    }

    const [data, total] = await Promise.all([
        CompanyModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
        CompanyModel.countDocuments(filter),
    ])

    return {
        data: data.map((doc) => doc.toJSON()),
        meta: {
            total,
            page: Number(page),
            limit: Number(limit),
            lastPage: Math.ceil(total / Number(limit)),
        },
    }
}

export const searchCompaniesService = async (search: string = '') => {
    const filter: any = { isActive: true }
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { industry: { $regex: search, $options: 'i' } },
        ]
    }

    const data = await CompanyModel.find(filter).sort({ name: 1 }).limit(20)
    return data.map((doc) => doc.toJSON())
}
