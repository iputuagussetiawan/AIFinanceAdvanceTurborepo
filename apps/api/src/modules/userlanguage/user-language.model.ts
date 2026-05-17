import mongoose, { Document, Model, Schema } from 'mongoose'
import { jlptField, proficiencyField, type IUserLanguage } from './user-language.validation'

export const userLanguageSchema = new Schema<IUserLanguage>(
    {
        language: {
            type: Schema.Types.ObjectId,
            ref: 'Language',
            required: true,
        },
        isCurrentLanguage: {
            type: Boolean,
            default: false,
        },
        proficiency: {
            speaking: proficiencyField,
            listening: proficiencyField,
            writing: proficiencyField,
            jlptLevel: jlptField,
        },
    },
    {
        _id: true,
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