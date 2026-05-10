import { model, Schema, type Document, type Types } from 'mongoose'

import type { ISkill } from './skill.validation'

export interface SkillDocument extends Omit<ISkill, '_id'>, Document {
    _id: Types.ObjectId
}

const skillSchema = new Schema<SkillDocument>(
    {
        name: {
            type: String,
            required: [true, 'Skill name is required'],
            minlength: 1,
            maxlength: 100,
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true,
            enum: ['Frontend', 'Backend', 'Mobile', 'Database', 'DevOps', 'Data & AI', 'UI/UX', 'Security', 'Tools'],
        },
        icon: {
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

skillSchema.index({ name: 'text', category: 'text' })

export const SkillModel = model<SkillDocument>('Skill', skillSchema)