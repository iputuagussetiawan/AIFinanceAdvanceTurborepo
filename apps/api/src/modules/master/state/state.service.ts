import z from 'zod'

import { BadRequestException, NotFoundException } from '../../../utils/appError'
import { StateModel, type StateDocument } from './state.model'
import { createStateSchema, type IStateInput, type IStateUpdate } from './state.validation'

export const StateService = {
    createState: async (data: IStateInput): Promise<StateDocument> => {
        const existing = await StateModel.findOne({
            name: { $regex: `^${data.name}$`, $options: 'i' },
            country: data.country,
        })
        if (existing) throw new BadRequestException('State with this name already exists in the given country')

        const state = new StateModel(data)
        await state.save()
        return state.populate('country', 'name code')
    },

    bulkCreateState: async (states: IStateInput[]) => {
        const bulkSchema = z.array(createStateSchema)
        const validation = bulkSchema.safeParse(states)
        if (!validation.success) throw new BadRequestException('Invalid state data')

        try {
            const result = await StateModel.insertMany(validation.data, { ordered: false })
            return result as unknown as StateDocument[]
        } catch (error: any) {
            if (error.code === 11000) {
                throw new BadRequestException('Bulk insert failed: One or more states are duplicated')
            }
            throw error
        }
    },

    updateState: async (stateId: string, updateData: IStateUpdate): Promise<StateDocument> => {
        const state = await StateModel.findById(stateId)
        if (!state) throw new NotFoundException('State not found')

        if (updateData.name) {
            const countryId = updateData.country || state.country?.toString()
            const nameExists = await StateModel.findOne({
                name: { $regex: `^${updateData.name}$`, $options: 'i' },
                country: countryId,
                _id: { $ne: stateId },
            })
            if (nameExists) throw new BadRequestException('State with this name already exists in the given country')
        }

        Object.assign(state, updateData)
        await state.save()
        return state.populate('country', 'name code')
    },

    searchStates: async (search: string = '', countryId?: string) => {
        const filter: any = { isActive: true }
        if (search) filter.name = { $regex: search, $options: 'i' }
        if (countryId) filter.country = countryId

        const data = await StateModel.find(filter).populate('country', 'name code').sort({ name: 1 })
        return data.map((doc) => doc.toJSON())
    },

    getStates: async (query: any = {}) => {
        const { page = 1, limit = 10, search = '', countryId = '' } = query
        const skip = (Number(page) - 1) * Number(limit)

        const filter: any = { isActive: true }
        if (search) filter.name = { $regex: search, $options: 'i' }
        if (countryId) filter.country = countryId

        const [data, total] = await Promise.all([
            StateModel.find(filter).populate('country', 'name code').sort({ name: 1 }).skip(skip).limit(Number(limit)),
            StateModel.countDocuments(filter),
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

    getStateById: async (stateId: string): Promise<StateDocument> => {
        const state = await StateModel.findById(stateId).populate('country', 'name code')
        if (!state) throw new NotFoundException('State not found')
        return state
    },

    deleteState: async (stateId: string): Promise<void> => {
        const state = await StateModel.findById(stateId)
        if (!state) throw new NotFoundException('State not found')

        state.isActive = false
        await state.save()
    },

    hardDeleteState: async (stateId: string): Promise<void> => {
        const result = await StateModel.findByIdAndDelete(stateId)
        if (!result) throw new NotFoundException('State not found')
    },

    bulkDeleteState: async (stateIds: string[]): Promise<number> => {
        if (!stateIds.length) throw new BadRequestException('No state IDs provided')

        const result = await StateModel.updateMany(
            { _id: { $in: stateIds } },
            { $set: { isActive: false } },
        )

        if (result.matchedCount === 0) throw new NotFoundException('No states found for the given IDs')

        return result.modifiedCount
    },

    bulkHardDeleteState: async (stateIds: string[]): Promise<number> => {
        if (!stateIds.length) throw new BadRequestException('No state IDs provided')

        const result = await StateModel.deleteMany({ _id: { $in: stateIds } })

        if (result.deletedCount === 0) throw new NotFoundException('No states found for the given IDs')

        return result.deletedCount
    },
}
