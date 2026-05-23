import type { ClientSession } from 'mongoose'

import { CountryModel } from '../country/country.model'
import { StateModel } from './state.model'
import statesData from './data/states.json'

export const seedStates = async (session: ClientSession) => {
    console.log('🌱 Upserting states...')

    const countries = await CountryModel.find({}, { _id: 1, code: 1 }, { session })
    const countryMap = new Map(countries.map(c => [c.code, c._id]))

    const resolved = statesData
        .map(s => {
            const countryId = countryMap.get(s.countryCode)
            if (!countryId) return null
            return { name: s.name, code: s.code, country: countryId, isActive: s.isActive }
        })
        .filter((s): s is NonNullable<typeof s> => s !== null)

    await StateModel.bulkWrite(
        resolved.map(s => ({
            updateOne: {
                filter: { name: s.name, country: s.country },
                update: { $set: { code: s.code, isActive: s.isActive } },
                upsert: true,
            },
        })),
        { session },
    )

    console.log(`✅ [Seeder] ${resolved.length} states upserted.`)
}
