import { model, Schema, type Document } from 'mongoose'

export interface CityDocument extends Document<string> {
    _id: string
    name: string
    state: string
    country: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

const citySchema = new Schema<CityDocument>(
    {
        _id: { type: String },
        name: {
            type: String,
            required: [true, 'City name is required'],
            minlength: 1,
            maxlength: 100,
            trim: true,
        },
        state: {
            type: String,
            ref: 'State',
            required: [true, 'State is required'],
        },
        country: {
            type: String,
            ref: 'Country',
            required: [true, 'Country is required'],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (_doc, ret) => {
                delete (ret as any)._id
                delete (ret as any).__v
                return ret
            },
        },
        toObject: { virtuals: true },
    },
)

citySchema.index({ state: 1 })
citySchema.index({ country: 1, state: 1 })

export const CityModel = model<CityDocument>('City', citySchema)
