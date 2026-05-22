import type { ClientSession } from 'mongoose'

import countriesData from './data/countries.json'
import { CountryModel } from './country.model'

export const seedCountries = async (session: ClientSession) => {
    console.log('🧹 Clearing existing countries...')
    await CountryModel.deleteMany({}, { session })

    console.log(`🌱 Seeding ${countriesData.length} countries...`)
    await CountryModel.insertMany(countriesData, { session })

    console.log(`✅ [Seeder] ${countriesData.length} countries seeded.`)
}
