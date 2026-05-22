import mongoose, { Document, Model, Schema } from 'mongoose'

// 1. Define the Interface
export interface LanguageDocument extends Document {
    name: string
    description?: string
    imageUrl?: string
    priority: number
    orderPosition: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

// 2. Define the Schema
const languageSchema = new Schema<LanguageDocument>(
    {
        name: {
            type: String,
            required: [true, 'Language name is required'],
            unique: true, // Master data names must be unique
            trim: true,
        },
        description: {
            type: String,
            default: '',
            trim: true,
        },
        imageUrl: {
            type: String,
            default: '',
            trim: true,
        },
        priority: {
            type: Number,
            default: 0,
            min: [0, 'Priority cannot be negative'],
            index: true, // Index for faster sorting queries
        },
        orderPosition: {
            type: Number,
            default: 100, // Used to sort how they appear in dropdowns
        },
        isActive: {
            type: Boolean,
            default: true, // Allows you to hide a language from the UI
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                delete (ret as any)._id // Hapus _id asli agar lebih rapi
                delete (ret as any).__v
                return ret
            },
        },
        toObject: { virtuals: true },
    },
)

// 3. Create the Model
const LanguageModel: Model<LanguageDocument> =
    mongoose.models.Language || mongoose.model<LanguageDocument>('Language', languageSchema)

export default LanguageModel
