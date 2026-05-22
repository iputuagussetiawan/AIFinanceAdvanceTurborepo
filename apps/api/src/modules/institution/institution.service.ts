import mongoose, { FilterQuery } from 'mongoose'

import { BadRequestException, ConflictException, NotFoundException } from '../../utils/appError'
import InstitutionModel, { type IInstitution, type InstitutionDocument } from './institution.model'
import type { InstitutionDTO, UpdateInstitutionDTO } from './institution.validation'

export interface InstitutionPaginationResponse {
    data: IInstitution[]
    meta: {
        totalData: number
        totalPage: number
        currentPage: number
        limit: number
    }
}

export const getInstitutionsService = async () => {
    const institutions = await InstitutionModel.find()
        .select('-__v')
        .sort({ orderPosition: 1, name: 1 })
        .lean()

    return institutions.map(({ _id, ...rest }) => ({
        id: _id.toString(),
        ...rest,
    }))
}

export const getInstitutionsPaginatedService = async (
    page: number = 1,
    limit: number = 10,
    search?: string,
    type?: string,
    isActive?: boolean,
): Promise<InstitutionPaginationResponse> => {
    if (page < 1 || limit < 1) {
        throw new BadRequestException('Page and limit must be greater than 0')
    }

    const query: FilterQuery<InstitutionDocument> = {}

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { location: { $regex: search, $options: 'i' } },
        ]
    }

    if (type) {
        query.type = type
    }

    if (typeof isActive === 'boolean') {
        query.isActive = isActive
    }

    const skip = (page - 1) * limit

    const [data, totalData] = await Promise.all([
        InstitutionModel.find(query)
            .select('-__v')
            .sort({ orderPosition: 1, name: 1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        InstitutionModel.countDocuments(query),
    ])

    return {
        data,
        meta: {
            totalData,
            totalPage: Math.ceil(totalData / limit),
            currentPage: page,
            limit,
        },
    }
}

export const createInstitutionService = async (body: InstitutionDTO) => {
    const session = await mongoose.startSession()
    try {
        session.startTransaction()

        const existing = await InstitutionModel.findOne({ name: body.name }).session(session)
        if (existing) throw new ConflictException('Institution name already exists')

        const institution = new InstitutionModel(body)
        await institution.save({ session })

        await session.commitTransaction()
        return institution
    } catch (error: any) {
        await session.abortTransaction()
        throw error
    } finally {
        session.endSession()
    }
}

export const bulkCreateInstitutionService = async (institutions: InstitutionDTO[]) => {
    const session = await mongoose.startSession()
    try {
        session.startTransaction()

        const names = institutions.map((inst) => inst.name)
        const existingInstitutions = await InstitutionModel.find({
            name: { $in: names },
        }).session(session)

        if (existingInstitutions.length > 0) {
            const existingNames = existingInstitutions.map((l) => l.name).join(', ')
            throw new ConflictException(`Some institutions already exist: ${existingNames}`)
        }

        const savedData = await InstitutionModel.insertMany(institutions, { session })

        await session.commitTransaction()
        return { data: savedData, count: savedData.length }
    } catch (error: any) {
        await session.abortTransaction()
        throw error
    } finally {
        session.endSession()
    }
}

export const updateInstitutionService = async (id: string, body: UpdateInstitutionDTO) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid Institution ID format')
    }

    const session = await mongoose.startSession()
    try {
        session.startTransaction()

        const updated = await InstitutionModel.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, session, runValidators: true },
        )

        if (!updated) throw new NotFoundException('Institution not found')

        await session.commitTransaction()
        return updated
    } catch (error: any) {
        await session.abortTransaction()
        throw error
    } finally {
        session.endSession()
    }
}

export const getInstitutionByIdService = async (id: string): Promise<IInstitution> => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid Institution ID format')
    }

    const institution = await InstitutionModel.findById(id).select('-__v').lean().exec()

    if (!institution) {
        throw new NotFoundException('Institution record not found')
    }

    return institution as IInstitution
}

export const deleteInstitutionService = async (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid Institution ID format')
    }

    const result = await InstitutionModel.findByIdAndDelete(id)
    if (!result) throw new NotFoundException('Institution not found')

    return { success: true }
}
