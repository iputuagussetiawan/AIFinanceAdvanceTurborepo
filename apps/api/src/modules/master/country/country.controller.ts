import { Request, Response } from 'express'

import { HTTPSTATUS } from '../../../config/http.config'
import { asyncHandler } from '../../../middlewares/asyncHandler.middleware'
import { CountryService } from './country.service'
import { createCountrySchema, updateCountrySchema } from './country.validation'

export const CountryController = {
    searchCountries: asyncHandler(async (req: Request, res: Response) => {
        const raw = req.query.search
        const search = Array.isArray(raw) ? (raw.find(Boolean) as string | undefined) : (raw as string | undefined)
        const data = await CountryService.searchCountries(search)

        return res.status(HTTPSTATUS.OK).json({ message: 'Countries retrieved successfully', data })
    }),

    getCountries: asyncHandler(async (req: Request, res: Response) => {
        const result = await CountryService.getCountries(req.query)

        return res.status(HTTPSTATUS.OK).json({ message: 'Countries retrieved successfully', ...result })
    }),

    getCountryById: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params
        const country = await CountryService.getCountryById(id.toString())

        return res.status(HTTPSTATUS.OK).json({ message: 'Country retrieved successfully', country: country.toJSON() })
    }),

    createCountry: asyncHandler(async (req: Request, res: Response) => {
        const body = createCountrySchema.parse(req.body)
        const country = await CountryService.createCountry(body)

        return res.status(HTTPSTATUS.CREATED).json({ message: 'Country created successfully', country: country.toJSON() })
    }),

    updateCountry: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params
        const body = updateCountrySchema.parse(req.body)
        const country = await CountryService.updateCountry(id.toString(), body)

        return res.status(HTTPSTATUS.OK).json({ message: 'Country updated successfully', country: country.toJSON() })
    }),

    deleteCountry: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params
        await CountryService.deleteCountry(id.toString())

        return res.status(HTTPSTATUS.OK).json({ message: 'Country deleted successfully' })
    }),

    hardDeleteCountry: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params
        await CountryService.hardDeleteCountry(id.toString())

        return res.status(HTTPSTATUS.OK).json({ message: 'Country permanently deleted' })
    }),

    bulkCreateCountry: asyncHandler(async (req: Request, res: Response) => {
        const countries = await CountryService.bulkCreateCountry(req.body)

        return res.status(HTTPSTATUS.CREATED).json({ message: `${countries.length} countries imported successfully`, countries })
    }),

    bulkDeleteCountry: asyncHandler(async (req: Request, res: Response) => {
        const { ids } = req.body

        if (!Array.isArray(ids)) {
            return res.status(HTTPSTATUS.BAD_REQUEST).json({ message: 'ids must be an array of country IDs' })
        }

        const count = await CountryService.bulkDeleteCountry(ids)

        return res.status(HTTPSTATUS.OK).json({ message: `${count} countries deleted successfully` })
    }),

    bulkHardDeleteCountry: asyncHandler(async (req: Request, res: Response) => {
        const { ids } = req.body

        if (!Array.isArray(ids)) {
            return res.status(HTTPSTATUS.BAD_REQUEST).json({ message: 'ids must be an array of country IDs' })
        }

        const count = await CountryService.bulkHardDeleteCountry(ids)

        return res.status(HTTPSTATUS.OK).json({ message: `${count} countries permanently deleted` })
    }),
}
