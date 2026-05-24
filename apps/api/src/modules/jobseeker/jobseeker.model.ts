import mongoose, { Document, Model, Schema, type Types } from 'mongoose'

import { JobseekerSkillSchema } from './jobseeker-skills/jobseeker-skill.model'
import { jobseekerEducationSchema } from './jobseeker-educations/jobseeker-education.model'
import type { IJobseekerEducation } from './jobseeker-educations/jobseeker-education.validation'
import { jobseekerExperienceSchema } from './jobseeker-experiences/jobseeker-experience.model'
import type { IJobseekerExperience } from './jobseeker-experiences/jobseeker-experience.validation'
import { jobseekerLanguageSchema } from './jobseeker-languages/jobseeker-language.model'
import type { IJobseekerLanguage } from './jobseeker-languages/jobseeker-language.validation'

export interface JobseekerDocument extends Document {
    userId: mongoose.Types.ObjectId
    jobTitle?: string
    headline: string
    currentPosition: string
    industry: string
    country: string
    state: string
    city: string
    openToWork: boolean
    languages?: IJobseekerLanguage[]
    educations?: IJobseekerEducation[]
    experiences?: IJobseekerExperience[]
    skills?: Types.ObjectId[]
    createdAt: Date
    updatedAt: Date
}

const JobseekerSchema = new Schema<JobseekerDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
            unique: true,
            index: true,
        },
        jobTitle: { type: String, trim: true, default: '' },
        headline: { type: String, required: true, trim: true },
        currentPosition: { type: String, required: true, trim: true },
        industry: { type: String, required: true, index: true },
        country: { type: String, ref: 'Country', required: true, index: true },
        state: { type: String, ref: 'State', required: true },
        city: { type: String, ref: 'City', required: true },
        openToWork: { type: Boolean, default: false },
        languages: { type: [jobseekerLanguageSchema], default: [] },
        educations: { type: [jobseekerEducationSchema], default: [] },
        experiences: { type: [jobseekerExperienceSchema], default: [] },
        skills: { type: [JobseekerSkillSchema], default: [] },
    },
    {
        _id: true,
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

const JobseekerModel: Model<JobseekerDocument> =
    mongoose.models.Jobseeker || mongoose.model<JobseekerDocument>('Jobseeker', JobseekerSchema)

export default JobseekerModel
