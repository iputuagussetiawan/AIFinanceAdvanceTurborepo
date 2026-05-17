import mongoose, { FilterQuery } from 'mongoose'

import { BadRequestException, ConflictException, NotFoundException } from '../../utils/appError'
import LanguageModel, { type LanguageDocument } from './language.model'
import type { LanguageDTO, UpdateLanguageDTO } from './language.validation'

export interface PaginationResponse {
    data: LanguageDocument[]
    meta: {
        totalData: number
        totalPage: number
        currentPage: number
        limit: number
    }
}

// Consistent sort order matching the compound index: priority desc, orderPosition asc
const DEFAULT_SORT = { priority: -1, orderPosition: 1 } as const

const toDTO = ({ _id, ...rest }: any) => ({ id: (_id as mongoose.Types.ObjectId).toString(), ...rest })


export const searchLanguagesService = async (search: string = '', priority?: number) => {
    const filter: FilterQuery<LanguageDocument> = { isActive: true }

    if (search) filter.name = { $regex: search, $options: 'i' }
    if (priority !== undefined) filter.priority = priority

    const data = await LanguageModel.find(filter)
        .select('-__v')
        .sort(DEFAULT_SORT)

    return data.map((doc) => doc.toJSON())
}

export const getAllLanguagesService = async (isActive?: boolean) => {
    const query: FilterQuery<LanguageDocument> = {}

    if (typeof isActive === 'boolean') {
        query.isActive = isActive
    }

    const rawItems = await LanguageModel.find(query)
        .select('-__v')
        .sort(DEFAULT_SORT)
        .lean()

    return {
        success: true,
        message: 'Successfully fetched all languages',
        data: rawItems.map(toDTO),
    }
}

export const getLanguagesPaginatedService = async (
    page: number = 1,
    limit: number = 10,
    search?: string,
    isActive?: boolean,
) => {
    if (page < 1 || limit < 1) {
        throw new BadRequestException('Page and limit must be greater than 0')
    }

    const query: FilterQuery<LanguageDocument> = {}

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ]
    }

    if (typeof isActive === 'boolean') {
        query.isActive = isActive
    }

    const skip = (page - 1) * limit

    const [rawItems, totalData] = await Promise.all([
        LanguageModel.find(query)
            .select('-__v')
            .sort(DEFAULT_SORT)
            .skip(skip)
            .limit(limit)
            .lean(),
        LanguageModel.countDocuments(query),
    ])

    return {
        data: rawItems.map(toDTO),
        meta: {
            totalData,
            totalPage: Math.ceil(totalData / limit),
            currentPage: page,
            limit,
        },
    }
}

export const createLanguageService = async (body: LanguageDTO) => {
    const existing = await LanguageModel.findOne({ name: new RegExp(`^${body.name}$`, 'i') }).lean()
    if (existing) {
        throw new ConflictException(`Language "${body.name}" already exists`)
    }

    const session = await mongoose.startSession()
    try {
        session.startTransaction()
        const language = new LanguageModel(body)
        await language.save({ session })
        await session.commitTransaction()
        return language
    } catch (error: any) {
        await session.abortTransaction()
        console.error('❌ [TRANSACTION] Language creation failed:', error.message)
        throw error
    } finally {
        session.endSession()
    }
}

export const bulkCreateLanguageService = async (languages: LanguageDTO[]) => {
    const session = await mongoose.startSession()
    try {
        session.startTransaction()

        const names = languages.map((lang) => lang.name)
        const existingLanguages = await LanguageModel.find({
            name: { $in: names.map((n) => new RegExp(`^${n}$`, 'i')) },
        }).session(session)

        if (existingLanguages.length > 0) {
            const existingNames = existingLanguages.map((l) => l.name).join(', ')
            throw new ConflictException(`Some languages already exist: ${existingNames}`)
        }

        const savedLanguages = await LanguageModel.insertMany(languages, { session })
        await session.commitTransaction()

        return {
            data: savedLanguages,
            count: savedLanguages.length,
        }
    } catch (error: any) {
        await session.abortTransaction()
        console.error('❌ [TRANSACTION] Bulk language insert aborted:', error.message)
        throw error
    } finally {
        session.endSession()
    }
}

export const updateLanguageService = async (id: string, body: UpdateLanguageDTO) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid Language ID format')
    }

    // Check name uniqueness if name is being updated
    if (body.name) {
        const conflict = await LanguageModel.findOne({
            name: new RegExp(`^${body.name}$`, 'i'),
            _id: { $ne: id },
        }).lean()
        if (conflict) {
            throw new ConflictException(`Language "${body.name}" already exists`)
        }
    }

    const session = await mongoose.startSession()
    try {
        session.startTransaction()

        const updatedLanguage = await LanguageModel.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, session, runValidators: true },
        ).select('-__v')

        if (!updatedLanguage) {
            throw new NotFoundException('Language not found')
        }

        await session.commitTransaction()
        return updatedLanguage
    } catch (error: any) {
        await session.abortTransaction()
        throw error
    } finally {
        session.endSession()
    }
}

export const getLanguageByIdService = async (id: string): Promise<LanguageDocument> => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid Language ID format')
    }

    const language = await LanguageModel.findById(id).select('-__v').lean()

    if (!language) {
        throw new NotFoundException('Language record not found')
    }

    return language as unknown as LanguageDocument
}

export const deleteLanguageService = async (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid Language ID format')
    }

    const result = await LanguageModel.findByIdAndDelete(id)

    if (!result) {
        throw new NotFoundException('Language not found')
    }

    return { success: true }
}