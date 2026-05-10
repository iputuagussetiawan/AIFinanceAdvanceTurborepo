import mongoose, { Document, Model, Schema } from 'mongoose'

// 1. Define the Interface representing a document in MongoDB
export interface JobseekerDocument extends Document {
    userId: mongoose.Types.ObjectId
    firstName: string
    lastName: string
    additionalName?: string
    pronouns?: string
    headline: string
    currentPosition: string
    industry: string
    country: string
    city: string
    phoneNumber: string
    phoneType: string
    address: string
    birthday: Date
    website?: string
    websiteType?: string
    onboardingComplete: boolean
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
            unique: true, // A user should only have one jobseeker profile
            index: true,
        },
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        additionalName: { type: String, default: '' },
        pronouns: { type: String, default: '' },
        headline: { type: String, required: true, trim: true },

        // --- Professional ---
        currentPosition: { type: String, required: true, trim: true },
        industry: { type: String, required: true, index: true },

        // --- Location & Contact ---
        country: { type: String, required: true, index: true },
        city: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        phoneType: { type: String, required: true },
        address: { type: String, required: true },

        // --- Dates & URLs ---
        birthday: { type: Date, required: true },
        website: { type: String, default: '' },
        websiteType: { type: String, default: '' },

        // --- System Metadata ---
        onboardingComplete: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        // Ensures virtuals (like the fullName helper below) are included in JSON responses
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
)

/**
 * VIRTUALS
 * These are helper fields that don't store in the DB but are useful in the UI.
 */
JobseekerSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`
})

// 3. Create and Export the Model
const JobseekerModel: Model<JobseekerDocument> =
    mongoose.models.Jobseeker || mongoose.model<JobseekerDocument>('Jobseeker', JobseekerSchema)

export default JobseekerModel
