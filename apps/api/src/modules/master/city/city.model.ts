import { model, Schema, Types, type Document } from 'mongoose'

export interface CityDocument extends Document {
    _id: Types.ObjectId
    name: string
    state: Types.ObjectId
    country: Types.ObjectId
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

const citySchema = new Schema<CityDocument>(
    {
        name: {
            type: String,
            required: [true, 'City name is required'],
            minlength: 1,
            maxlength: 100,
            trim: true,
        },
        state: {
            type: Schema.Types.ObjectId,
            ref: 'State',
            required: [true, 'State is required'],
        },
        country: {
            type: Schema.Types.ObjectId,
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

citySchema.index({ name: 1, state: 1 }, { unique: true })
citySchema.index({ country: 1, state: 1 })

export const CityModel = model<CityDocument>('City', citySchema)
