import countriesData from './data/countries.json'
import { CountryModel } from './country.model'

export const seedCountries = async () => {
    console.log('🧹 Clearing existing countries...')
    await CountryModel.deleteMany({})

    console.log(`🌱 Seeding ${countriesData.length} countries...`)
    await CountryModel.insertMany(
        countriesData.map(c => ({ _id: c.code.toUpperCase(), ...c })),
    )

    console.log(`✅ [Seeder] ${countriesData.length} countries seeded.`)
}
