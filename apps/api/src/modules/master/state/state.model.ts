import { model, Schema, type Document } from 'mongoose'

export interface StateDocument extends Document<string> {
    _id: string
    name: string
    code: string
    country: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

const stateSchema = new Schema<StateDocument>(
    {
        _id: { type: String },
        name: {
            type: String,
            required: [true, 'State name is required'],
            minlength: 1,
            maxlength: 100,
            trim: true,
        },
        code: {
            type: String,
            required: [true, 'State code is required'],
            maxlength: 10,
            trim: true,
            uppercase: true,
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

stateSchema.index({ country: 1 })
stateSchema.index({ code: 1, country: 1 })

export const StateModel = model<StateDocument>('State', stateSchema)
