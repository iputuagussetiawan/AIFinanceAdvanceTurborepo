import { Schema } from 'mongoose'

import type { IUserSkill } from './user-skill.validation'

export const UserSkillSchema = new Schema<IUserSkill>(
    {
        skill: {
            type: 'ObjectId' as any,
            ref: 'Skill',
            required: [true, 'Skill ID is required'],
            index: true, // Speeds up queries when fetching by user
        },
        // Nilai Progress (0-100)
        percentage: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },
        level: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
            default: 'Beginner',
        },
        orderPosition: {
            type: Number,
            default: 0,
        },
    },
    {
        _id: true, // Usually keep this true for Education so you can edit specific entries
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
