import type { ClientSession } from 'mongoose'

import countriesData from './data/countries.json'
import { CountryModel } from './country.model'

export const seedCountries = async (session: ClientSession) => {
    console.log('🌱 Upserting countries...')

    await CountryModel.bulkWrite(
        countriesData.map(c => ({
            updateOne: {
                filter: { code: c.code },
                update: { $set: { name: c.name, dialCode: c.dialCode, flag: c.flag, isActive: c.isActive } },
                upsert: true,
            },
        })),
        { session },
    )

    console.log(`✅ [Seeder] ${countriesData.length} countries upserted.`)
}
