import { model, Schema, type Document, type Types } from 'mongoose'

import type { ICountry } from './country.validation'

export interface CountryDocument extends Omit<ICountry, '_id'>, Document {
    _id: Types.ObjectId
}

const countrySchema = new Schema<CountryDocument>(
    {
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
