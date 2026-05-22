import { Schema } from 'mongoose'

import type { IJobseekerEducation } from './jobseeker-education.validation'

export const jobseekerEducationSchema = new Schema<IJobseekerEducation>(
    {
        institution: {
            type: Schema.Types.ObjectId,
            ref: 'Institution',
            required: false,
            default: undefined,
        },
        institutionName: {
            type: String,
            required: [true, 'Institution name is required'],
            trim: true,
        },
        degree: { type: String, required: [true, 'Degree is required'], trim: true },
        fieldOfStudy: { type: String, required: [true, 'Field of study is required'], trim: true },
        startDate: { type: Date, required: [true, 'Start date is required'] },
        endDate: {
            type: Date,
            default: null,
            validate: {
                validator: function (this: IJobseekerEducation, value: Date) {
                    if (!value) return true
                    return value >= this.startDate
                },
                message: 'End date must be after the start date.',
            },
        },
        grade: { type: String, trim: true },
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters'],
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
