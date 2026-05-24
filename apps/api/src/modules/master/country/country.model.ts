import { model, Schema, type Document } from 'mongoose'

export interface CountryDocument extends Document<string> {
    _id: string
    name: string
    code: string
    dialCode?: string
    flag?: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

const countrySchema = new Schema<CountryDocument>(
    {
        _id: { type: String },
        name: {
            type: String,
            required: [true, 'Country name is required'],
            minlength: 1,
            maxlength: 100,
            trim: true,
            unique: true,
        },
        code: {
            type: String,
            required: [true, 'Country code is required'],
            minlength: 2,
            maxlength: 3,
            trim: true,
            unique: true,
            uppercase: true,
        },
        dialCode: {
            type: String,
            trim: true,
            default: '',
        },
        flag: {
            type: String,
            default: '',
            trim: true,
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
            transform: (doc, ret) => {
                delete (ret as any)._id
                delete (ret as any).__v
                return ret
            },
        },
        toObject: { virtuals: true },
    },
)

countrySchema.index({ name: 'text', code: 1 })

export const CountryModel = model<CountryDocument>('Country', countrySchema)
