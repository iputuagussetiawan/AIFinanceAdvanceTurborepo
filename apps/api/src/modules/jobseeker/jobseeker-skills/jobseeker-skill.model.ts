import { Schema } from 'mongoose'

import type { IJobseekerSkill } from './jobseeker-skill.validation'

export const JobseekerSkillSchema = new Schema<IJobseekerSkill>(
    {
        skill: {
            type: 'ObjectId' as any,
            ref: 'Skill',
            required: [true, 'Skill ID is required'],
            index: true,
        },
        percentage: { type: Number, min: 0, max: 100, default: 0 },
        level: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
            default: 'Beginner',
        },
        orderPosition: { type: Number, default: 0 },
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
