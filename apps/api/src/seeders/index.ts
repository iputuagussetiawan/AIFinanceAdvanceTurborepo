import 'dotenv/config'

import mongoose from 'mongoose'

import connectDatabase from '../config/database.config'
import { seedCities } from '../modules/master/city/city.seeder'
import { seedCountries } from '../modules/master/country/country.seeder'
import { seedStates } from '../modules/master/state/state.seeder'
import { seedRoles } from '../modules/role/role.seeder'

const runSeeders = async () => {
    console.log('🚀 Master Seeding Process Started...')
    try {
        await connectDatabase()
        await seedRoles()
        await seedCountries()
        await seedStates()
        await seedCities()
        console.log('✅ All seeders executed successfully!')
    } catch (error) {
        console.error('❌ Seeding failed:', error)
    } finally {
        await mongoose.connection.close()
        console.log('👋 Database connection closed.')
        process.exit(0)
    }
}

runSeeders()
