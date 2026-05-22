import z from 'zod'

import { BadRequestException, NotFoundException } from '../../../utils/appError'
import { CityModel, type CityDocument } from './city.model'
import { createCitySchema, type ICityInput, type ICityUpdate } from './city.validation'

export const CityService = {
    createCity: async (data: ICityInput): Promise<CityDocument> => {
        const existing = await CityModel.findOne({
            name: { $regex: `^${data.name}$`, $options: 'i' },
            state: data.state,
        })
        if (existing) throw new BadRequestException('City with this name already exists in the given state')

        const city = new CityModel(data)
        await city.save()
        return city.populate([
            { path: 'state', select: 'name code' },
            { path: 'country', select: 'name code' },
        ])
    },

    bulkCreateCity: async (cities: ICityInput[]) => {
        const bulkSchema = z.array(createCitySchema)
        const validation = bulkSchema.safeParse(cities)
        if (!validation.success) throw new BadRequestException('Invalid city data')

        try {
            const result = await CityModel.insertMany(validation.data, { ordered: false })
            return result as unknown as CityDocument[]
        } catch (error: any) {
            if (error.code === 11000) {
                throw new BadRequestException('Bulk insert failed: One or more cities are duplicated')
            }
            throw error
        }
    },

    updateCity: async (cityId: string, updateData: ICityUpdate): Promise<CityDocument> => {
        const city = await CityModel.findById(cityId)
        if (!city) throw new NotFoundException('City not found')

        if (updateData.name) {
            const stateId = updateData.state || city.state?.toString()
            const nameExists = await CityModel.findOne({
                name: { $regex: `^${updateData.name}$`, $options: 'i' },
                state: stateId,
                _id: { $ne: cityId },
            })
            if (nameExists) throw new BadRequestException('City with this name already exists in the given state')
        }

        Object.assign(city, updateData)
        await city.save()
        return city.populate([
            { path: 'state', select: 'name code' },
            { path: 'country', select: 'name code' },
        ])
    },

    searchCities: async (search: string = '', stateId?: string, countryId?: string) => {
        const filter: any = { isActive: true }
        if (search) filter.name = { $regex: search, $options: 'i' }
        if (stateId) filter.state = stateId
        if (countryId) filter.country = countryId

        const data = await CityModel.find(filter)
            .populate([{ path: 'state', select: 'name code' }, { path: 'country', select: 'name code' }])
            .sort({ name: 1 })
        return data.map((doc) => doc.toJSON())
    },

    getCities: async (query: any = {}) => {
        const { page = 1, limit = 10, search = '', stateId = '', countryId = '' } = query
        const skip = (Number(page) - 1) * Number(limit)

        const filter: any = { isActive: true }
        if (search) filter.name = { $regex: search, $options: 'i' }
        if (stateId) filter.state = stateId
        if (countryId) filter.country = countryId

        const [data, total] = await Promise.all([
            CityModel.find(filter)
                .populate([{ path: 'state', select: 'name code' }, { path: 'country', select: 'name code' }])
                .sort({ name: 1 })
                .skip(skip)
                .limit(Number(limit)),
            CityModel.countDocuments(filter),
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

    getCityById: async (cityId: string): Promise<CityDocument> => {
        const city = await CityModel.findById(cityId).populate([
            { path: 'state', select: 'name code' },
            { path: 'country', select: 'name code' },
        ])
        if (!city) throw new NotFoundException('City not found')
        return city
    },

    deleteCity: async (cityId: string): Promise<void> => {
        const city = await CityModel.findById(cityId)
        if (!city) throw new NotFoundException('City not found')

        city.isActive = false
        await city.save()
    },

    hardDeleteCity: async (cityId: string): Promise<void> => {
        const result = await CityModel.findByIdAndDelete(cityId)
        if (!result) throw new NotFoundException('City not found')
    },

    bulkDeleteCity: async (cityIds: string[]): Promise<number> => {
        if (!cityIds.length) throw new BadRequestException('No city IDs provided')

        const result = await CityModel.updateMany(
            { _id: { $in: cityIds } },
            { $set: { isActive: false } },
        )

        if (result.matchedCount === 0) throw new NotFoundException('No cities found for the given IDs')

        return result.modifiedCount
    },

    bulkHardDeleteCity: async (cityIds: string[]): Promise<number> => {
        if (!cityIds.length) throw new BadRequestException('No city IDs provided')

        const result = await CityModel.deleteMany({ _id: { $in: cityIds } })

        if (result.deletedCount === 0) throw new NotFoundException('No cities found for the given IDs')

        return result.deletedCount
    },
}
