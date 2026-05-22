import { Request, Response } from 'express'

import { HTTPSTATUS } from '../../../config/http.config'
import { asyncHandler } from '../../../middlewares/asyncHandler.middleware'
import { StateService } from './state.service'
import { createStateSchema, updateStateSchema } from './state.validation'

export const StateController = {
    searchStates: asyncHandler(async (req: Request, res: Response) => {
        const search = req.query.search as string | undefined
        const countryId = req.query.countryId as string | undefined
        const data = await StateService.searchStates(search, countryId)

        return res.status(HTTPSTATUS.OK).json({ message: 'States retrieved successfully', data })
    }),

    getStates: asyncHandler(async (req: Request, res: Response) => {
        const result = await StateService.getStates(req.query)

        return res.status(HTTPSTATUS.OK).json({ message: 'States retrieved successfully', ...result })
    }),

    getStateById: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params
        const state = await StateService.getStateById(id.toString())

        return res.status(HTTPSTATUS.OK).json({ message: 'State retrieved successfully', state: state.toJSON() })
    }),

    createState: asyncHandler(async (req: Request, res: Response) => {
        const body = createStateSchema.parse(req.body)
        const state = await StateService.createState(body)

        return res.status(HTTPSTATUS.CREATED).json({ message: 'State created successfully', state: state.toJSON() })
    }),

    updateState: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params
        const body = updateStateSchema.parse(req.body)
        const state = await StateService.updateState(id.toString(), body)

        return res.status(HTTPSTATUS.OK).json({ message: 'State updated successfully', state: state.toJSON() })
    }),

    deleteState: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params
        await StateService.deleteState(id.toString())

        return res.status(HTTPSTATUS.OK).json({ message: 'State deleted successfully' })
    }),

    hardDeleteState: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params
        await StateService.hardDeleteState(id.toString())

        return res.status(HTTPSTATUS.OK).json({ message: 'State permanently deleted' })
    }),

    bulkCreateState: asyncHandler(async (req: Request, res: Response) => {
        const states = await StateService.bulkCreateState(req.body)

        return res.status(HTTPSTATUS.CREATED).json({ message: `${states.length} states imported successfully`, states })
    }),

    bulkDeleteState: asyncHandler(async (req: Request, res: Response) => {
        const { ids } = req.body

        if (!Array.isArray(ids)) {
            return res.status(HTTPSTATUS.BAD_REQUEST).json({ message: 'ids must be an array of state IDs' })
        }

        const count = await StateService.bulkDeleteState(ids)

        return res.status(HTTPSTATUS.OK).json({ message: `${count} states deleted successfully` })
    }),

    bulkHardDeleteState: asyncHandler(async (req: Request, res: Response) => {
        const { ids } = req.body

        if (!Array.isArray(ids)) {
            return res.status(HTTPSTATUS.BAD_REQUEST).json({ message: 'ids must be an array of state IDs' })
        }

        const count = await StateService.bulkHardDeleteState(ids)

        return res.status(HTTPSTATUS.OK).json({ message: `${count} states permanently deleted` })
    }),
}
