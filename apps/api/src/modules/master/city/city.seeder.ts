import { CityModel } from './city.model'
import citiesData from './data/cities.json'

export const seedCities = async () => {
    console.log('🧹 Clearing existing cities...')
    await CityModel.deleteMany({})

    const resolved = (citiesData as { name: string; stateName: string; countryCode: string; isActive: boolean }[])
        .map(c => ({
            _id: `${c.name}|${c.stateName}|${c.countryCode.toUpperCase()}`,
            name: c.name,
            state: `${c.stateName}|${c.countryCode.toUpperCase()}`,
            country: c.countryCode.toUpperCase(),
            isActive: c.isActive,
        }))

    console.log(`🌱 Seeding ${resolved.length} cities...`)
    await CityModel.insertMany(resolved)

    console.log(`✅ [Seeder] ${resolved.length} cities seeded.`)
}
