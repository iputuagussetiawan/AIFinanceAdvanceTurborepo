import mongoose, { Document, Model, Schema } from 'mongoose'

// 1. Define the Interface for the document
// We extend Document to include Mongoose's internal properties like _id and save()
export interface EducationDocument extends Document {
    userId: mongoose.Types.ObjectId
    schoolName: string
    degree: string
    fieldOfStudy: string
    startDate: Date
    endDate?: Date | null
    grade?: string
    activities?: string
    description?: string
    orderPosition: number
    createdAt: Date
    updatedAt: Date
}

// 2. Define the Schema
const educationSchema = new Schema<EducationDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
            index: true, // Speeds up queries when fetching by user
        },
        schoolName: {
            type: String,
            required: [true, 'School name is required'],
        },
        degree: {
            type: String,
            required: [true, 'Degree is required'],
            trim: true,
        },
        fieldOfStudy: {
            type: String,
            required: [true, 'Field of study is required'],
            trim: true,
        },
        startDate: {
            type: Date,
            required: [true, 'Start date is required'],
        },
        endDate: {
            type: Date,
            default: null,
        },
        grade: { type: String, default: '' },
        activities: { type: String, default: '' },
        description: { type: String, default: '' },
        orderPosition: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        // Helps when sending data to the frontend to ensure _id is a string
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
)

// 3. Create the Model
// The logic check ensures we don't re-compile the model during Hot Module Replacement (Next.js)
const EducationModel: Model<EducationDocument> =
    mongoose.models.Education || mongoose.model<EducationDocument>('Education', educationSchema)

export default EducationModel
