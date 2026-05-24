import { Request, Response } from 'express'

import { HTTPSTATUS } from '../../../config/http.config'
import { asyncHandler } from '../../../middlewares/asyncHandler.middleware'
import { CityService } from './city.service'
import { createCitySchema, updateCitySchema } from './city.validation'

export const CityController = {
    searchCities: asyncHandler(async (req: Request, res: Response) => {
        const toStr = (v: any) => Array.isArray(v) ? (v.find(Boolean) as string | undefined) : (v as string | undefined)
        const search = toStr(req.query.search)
        const stateId = toStr(req.query.stateId)
        const countryId = toStr(req.query.countryId)
        const data = await CityService.searchCities(search, stateId, countryId)

        return res.status(HTTPSTATUS.OK).json({ message: 'Cities retrieved successfully', data })
    }),

    getCities: asyncHandler(async (req: Request, res: Response) => {
        const result = await CityService.getCities(req.query)

        return res.status(HTTPSTATUS.OK).json({ message: 'Cities retrieved successfully', ...result })
    }),

    getCityById: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params
        const city = await CityService.getCityById(id.toString())

        return res.status(HTTPSTATUS.OK).json({ message: 'City retrieved successfully', city: city.toJSON() })
    }),

    createCity: asyncHandler(async (req: Request, res: Response) => {
        const body = createCitySchema.parse(req.body)
        const city = await CityService.createCity(body)

        return res.status(HTTPSTATUS.CREATED).json({ message: 'City created successfully', city: city.toJSON() })
    }),

    updateCity: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params
        const body = updateCitySchema.parse(req.body)
        const city = await CityService.updateCity(id.toString(), body)

        return res.status(HTTPSTATUS.OK).json({ message: 'City updated successfully', city: city.toJSON() })
    }),

    deleteCity: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params
        await CityService.deleteCity(id.toString())

        return res.status(HTTPSTATUS.OK).json({ message: 'City deleted successfully' })
    }),

    hardDeleteCity: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params
        await CityService.hardDeleteCity(id.toString())

        return res.status(HTTPSTATUS.OK).json({ message: 'City permanently deleted' })
    }),

    bulkCreateCity: asyncHandler(async (req: Request, res: Response) => {
        const cities = await CityService.bulkCreateCity(req.body)

        return res.status(HTTPSTATUS.CREATED).json({ message: `${cities.length} cities imported successfully`, cities })
    }),

    bulkDeleteCity: asyncHandler(async (req: Request, res: Response) => {
        const { ids } = req.body

        if (!Array.isArray(ids)) {
            return res.status(HTTPSTATUS.BAD_REQUEST).json({ message: 'ids must be an array of city IDs' })
        }

        const count = await CityService.bulkDeleteCity(ids)

        return res.status(HTTPSTATUS.OK).json({ message: `${count} cities deleted successfully` })
    }),

    bulkHardDeleteCity: asyncHandler(async (req: Request, res: Response) => {
        const { ids } = req.body

        if (!Array.isArray(ids)) {
            return res.status(HTTPSTATUS.BAD_REQUEST).json({ message: 'ids must be an array of city IDs' })
        }

        const count = await CityService.bulkHardDeleteCity(ids)

        return res.status(HTTPSTATUS.OK).json({ message: `${count} cities permanently deleted` })
    }),
}
