import mongoose, { Document, Model, Schema } from 'mongoose'

import type { IUserLanguage } from './user-language.validation'

export const userLanguageSchema = new Schema<IUserLanguage>(
    {
        language: {
            type: Schema.Types.ObjectId,
            ref: 'Language',
            required: true,
        },
        proficiency: {
            speaking: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Native'] },
            listening: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Native'] },
            writing: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Native'] },
            jlptLevel: { type: String, enum: ['N1', 'N2', 'N3', 'N4', 'N5'] },
        },
    },
    {
        _id: true,
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
