import type { ClientSession } from 'mongoose'

import { CountryModel } from '../country/country.model'
import { StateModel } from '../state/state.model'
import { CityModel } from './city.model'
import citiesData from './data/cities.json'

export const seedCities = async (session: ClientSession) => {
    console.log('🌱 Upserting cities...')

    const [countries, states] = await Promise.all([
        CountryModel.find({}, { _id: 1, code: 1 }, { session }),
        StateModel.find({}, { _id: 1, name: 1, country: 1 }, { session }).lean(),
    ])

    const countryMap = new Map(countries.map(c => [c.code, c._id]))
    const idToCode = new Map([...countryMap.entries()].map(([code, id]) => [id.toString(), code]))
    const stateMap = new Map(
        states.map(s => {
            const countryCode = idToCode.get(s.country.toString())
            return [`${s.name}|${countryCode}`, s._id]
        }),
    )

    const resolved = (citiesData as { name: string; stateName: string; countryCode: string; isActive: boolean }[])
        .map(c => {
            const countryId = countryMap.get(c.countryCode)
            const stateId = stateMap.get(`${c.stateName}|${c.countryCode}`)
            if (!countryId || !stateId) return null
            return { name: c.name, state: stateId, country: countryId, isActive: c.isActive }
        })
        .filter((c): c is NonNullable<typeof c> => c !== null)

    await CityModel.bulkWrite(
        resolved.map(c => ({
            updateOne: {
                filter: { name: c.name, state: c.state, country: c.country },
                update: { $set: { isActive: c.isActive } },
                upsert: true,
            },
        })),
        { session },
    )

    console.log(`✅ [Seeder] ${resolved.length} cities upserted.`)
}
