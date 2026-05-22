import mongoose, { Document, Model, Schema } from 'mongoose'

// 1. Define the Interface representing a document in MongoDB
export interface JobseekerDocument extends Document {
    userId: mongoose.Types.ObjectId
    headline: string
    currentPosition: string
    industry: string
    country: string
    city: string
    createdAt: Date
    updatedAt: Date
}

// 2. Define the Schema
const JobseekerSchema = new Schema<JobseekerDocument>(
    {
        // --- Identity ---
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
            unique: true,
            index: true,
        },
        headline: { type: String, required: true, trim: true },

        // --- Professional ---
        currentPosition: { type: String, required: true, trim: true },
        industry: { type: String, required: true, index: true },

        // --- Location ---
        country: { type: String, required: true, index: true },
        city: { type: String, required: true },

    },
    {
        timestamps: true,
        // Ensures virtuals (like the fullName helper below) are included in JSON responses
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
)

// 3. Create and Export the Model
const JobseekerModel: Model<JobseekerDocument> =
    mongoose.models.Jobseeker || mongoose.model<JobseekerDocument>('Jobseeker', JobseekerSchema)

export default JobseekerModel
