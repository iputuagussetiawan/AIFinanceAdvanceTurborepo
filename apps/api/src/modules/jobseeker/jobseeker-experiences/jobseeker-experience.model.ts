import { Schema } from 'mongoose'

import type { IJobseekerExperience } from './jobseeker-experience.validation'

export const jobseekerExperienceSchema = new Schema<IJobseekerExperience>(
    {
        company: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            required: false,
            default: undefined,
        },
        companyName: { type: String, required: [true, 'Company name is required'], trim: true },
        location: { type: String, trim: true },
        title: { type: String, required: [true, 'Job title is required'], trim: true },
        employmentType: {
            type: String,
            enum: [
                'Full-time',
                'Part-time',
                'Self-employed',
                'Freelance',
                'Contract',
                'Internship',
                'Apprenticeship',
            ],
            default: 'Full-time',
        },
        startDate: { type: Date, required: [true, 'Start date is required'] },
        endDate: {
            type: Date,
            default: null,
            validate: {
                validator: function (this: IJobseekerExperience, value: Date) {
                    if (this.isCurrent || !value) return true
                    return value >= this.startDate
                },
                message: 'End date must be after the start date.',
            },
        },
        isCurrent: { type: Boolean, default: false },
        description: {
            type: String,
            trim: true,
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
        },
        skills: [{ type: String, trim: true }],
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
