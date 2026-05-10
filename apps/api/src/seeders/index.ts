import 'dotenv/config'

import mongoose from 'mongoose'

import connectDatabase from '../config/database.config'
import { seedRoles } from '../modules/role/role.seeder'

const runSeeders = async () => {
    console.log('🚀 Master Seeding Process Started...')
    try {
        await connectDatabase()
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            // Add all your seeders here
            await seedRoles(session)
            // await seedUsers(session); // Example for future seeders
            await session.commitTransaction()
            console.log('✅ All seeders executed successfully!')
        } catch (error) {
            await session.abortTransaction()
            console.error('❌ Transaction aborted due to error:', error)
            throw error
        } finally {
            session.endSession()
        }
    } catch (error) {
        console.error('❌ Master Seeding Failed:', error)
    } finally {
        // Always close connection so the terminal process exits
        await mongoose.connection.close()
        console.log('👋 Database connection closed.')
        process.exit(0)
    }
}

runSeeders()
