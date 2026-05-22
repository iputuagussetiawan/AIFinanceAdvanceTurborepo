import mongoose from 'mongoose'

import { config } from './app.config'

const connectDatabase = async () => {
    try {
        await mongoose.connect(config.MONGO_URI, {
            maxPoolSize: 10,
            minPoolSize: 2,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000,
        })
    } catch (error) {
        process.exit(1)
    }
}

export default connectDatabase
