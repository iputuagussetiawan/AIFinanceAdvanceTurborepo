import { StateModel } from './state.model'
import statesData from './data/states.json'

export const seedStates = async () => {
    console.log('🧹 Clearing existing states...')
    await StateModel.deleteMany({})

    const resolved = statesData.map(s => ({
        _id: `${s.name}|${s.countryCode.toUpperCase()}`,
        name: s.name,
        code: s.code,
        country: s.countryCode.toUpperCase(),
        isActive: s.isActive,
    }))

    console.log(`🌱 Seeding ${resolved.length} states...`)
    await StateModel.insertMany(resolved)

    console.log(`✅ [Seeder] ${resolved.length} states seeded.`)
}
