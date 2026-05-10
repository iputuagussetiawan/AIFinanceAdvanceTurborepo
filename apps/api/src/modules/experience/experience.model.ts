import mongoose, { Document, Model, Schema } from 'mongoose'

// 1. Define the Interface
export interface ExperienceDocument extends Document {
    userId: mongoose.Types.ObjectId
    companyId?: mongoose.Types.ObjectId | null
    title: string
    profileHeadline?: string
    employmentType: string
    company: string
    isCurrent: boolean
    startDate: Date
    endDate?: Date | null
    location: string
    locationType: string
    description?: string
    whereFineThisJobs?: string
    orderPosition: number
    createdAt: Date
    updatedAt: Date
}

// 2. Define the Schema
const experienceSchema = new Schema<ExperienceDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
            index: true,
        },
        companyId: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            default: null,
        },
        // --- Role Details ---
        title: {
            type: String,
            required: [true, 'Job title is required'],
            trim: true,
        },
        profileHeadline: {
            type: String,
            trim: true,
        },
        employmentType: {
            type: String,
            required: [true, 'Employment type is required'],
        },
        company: {
            type: String,
            required: [true, 'Company name is required'],
            trim: true,
        },
        // --- Status & Dates ---
        isCurrent: {
            type: Boolean,
            default: false,
        },
        startDate: {
            type: Date,
            required: [true, 'Start date is required'],
        },
        endDate: {
            type: Date,
            default: null,
            validate: {
                validator: function (this: any, value: Date | null) {
                    // If it's the current job, end date doesn't matter
                    if (this.isCurrent) return true
                    // Otherwise, end date must be after start date
                    return !value || value > this.startDate
                },
                message: 'End date must be after the start date',
            },
        },
        // --- Location ---
        location: {
            type: String,
            required: [true, 'Location is required'],
            trim: true,
        },
        locationType: {
            type: String,
            required: [true, 'Location type is required'],
        },
        // --- Content ---
        description: {
            type: String,
            default: '',
        },
        whereFineThisJobs: {
            type: String,
            default: '',
        },
        // --- Metadata ---
        orderPosition: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
)

// Compound index to sort experiences for a specific user quickly
experienceSchema.index({ userId: 1, orderPosition: 1 })

// 3. Create the Model
const ExperienceModel: Model<ExperienceDocument> =
    mongoose.models.Experience || mongoose.model<ExperienceDocument>('Experience', experienceSchema)

export default ExperienceModel
