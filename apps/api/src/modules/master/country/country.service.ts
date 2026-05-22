import { BadRequestException, NotFoundException } from '../../../utils/appError'
import { CountryModel, type CountryDocument } from './country.model'
import { createCountrySchema, type ICountryInput, type ICountryUpdate } from './country.validation'
import z from 'zod'

export const CountryService = {
    createCountry: async (data: ICountryInput): Promise<CountryDocument> => {
        const existing = await CountryModel.findOne({
            $or: [
                { name: { $regex: `^${data.name}$`, $options: 'i' } },
                { code: data.code.toUpperCase() },
            ],
        })
        if (existing) throw new BadRequestException('Country with this name or code already exists')

        const country = new CountryModel(data)
        await country.save()
        return country
    },

    bulkCreateCountry: async (countries: ICountryInput[]) => {
        const bulkSchema = z.array(createCountrySchema)
        const validation = bulkSchema.safeParse(countries)
        if (!validation.success) throw new BadRequestException('Invalid country data')

        try {
            const result = await CountryModel.insertMany(validation.data, { ordered: false })
            return result as unknown as CountryDocument[]
        } catch (error: any) {
            if (error.code === 11000) {
                throw new BadRequestException('Bulk insert failed: One or more country names or codes are duplicated')
            }
            throw error
        }
    },

    updateCountry: async (countryId: string, updateData: ICountryUpdate): Promise<CountryDocument> => {
        const country = await CountryModel.findById(countryId)
        if (!country) throw new NotFoundException('Country not found')

        if (updateData.name && updateData.name !== country.name) {
            const nameExists = await CountryModel.findOne({
                name: { $regex: `^${updateData.name}$`, $options: 'i' },
            })
            if (nameExists) throw new BadRequestException('Country with this name already exists')
        }

        if (updateData.code && updateData.code.toUpperCase() !== country.code) {
            const codeExists = await CountryModel.findOne({ code: updateData.code.toUpperCase() })
            if (codeExists) throw new BadRequestException('Country with this code already exists')
        }

        Object.assign(country, updateData)
        await country.save()
        return country
    },

    searchCountries: async (search: string = '') => {
        const filter: any = { isActive: true }
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { code: { $regex: search, $options: 'i' } },
            ]
        }

        const data = await CountryModel.find(filter).sort({ name: 1 })
        return data.map((doc) => doc.toJSON())
    },

    getCountries: async (query: any = {}) => {
        const { page = 1, limit = 10, search = '' } = query
        const skip = (Number(page) - 1) * Number(limit)

        const filter: any = { isActive: true }
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { code: { $regex: search, $options: 'i' } },
            ]
        }

        const [data, total] = await Promise.all([
            CountryModel.find(filter).sort({ name: 1 }).skip(skip).limit(Number(limit)),
            CountryModel.countDocuments(filter),
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
    },

    getCountryById: async (countryId: string): Promise<CountryDocument> => {
        const country = await CountryModel.findById(countryId)
        if (!country) throw new NotFoundException('Country not found')
        return country
    },

    deleteCountry: async (countryId: string): Promise<void> => {
        const country = await CountryModel.findById(countryId)
        if (!country) throw new NotFoundException('Country not found')

        country.isActive = false
        await country.save()
    },

    hardDeleteCountry: async (countryId: string): Promise<void> => {
        const result = await CountryModel.findByIdAndDelete(countryId)
        if (!result) throw new NotFoundException('Country not found')
    },

    bulkDeleteCountry: async (countryIds: string[]): Promise<number> => {
        if (!countryIds.length) throw new BadRequestException('No country IDs provided')

        const result = await CountryModel.updateMany(
            { _id: { $in: countryIds } },
            { $set: { isActive: false } },
        )

        if (result.matchedCount === 0) throw new NotFoundException('No countries found for the given IDs')

        return result.modifiedCount
    },

    bulkHardDeleteCountry: async (countryIds: string[]): Promise<number> => {
        if (!countryIds.length) throw new BadRequestException('No country IDs provided')

        const result = await CountryModel.deleteMany({ _id: { $in: countryIds } })

        if (result.deletedCount === 0) throw new NotFoundException('No countries found for the given IDs')

        return result.deletedCount
    },
}
