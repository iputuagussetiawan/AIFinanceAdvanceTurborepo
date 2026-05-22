import { NotFoundException } from '../../../utils/appError'
import JobseekerModel from '../jobseeker.model'
import type { IJobseekerExperience } from './jobseeker-experience.validation'

const findJobseeker = async (userId: string) => {
    const jobseeker = await JobseekerModel.findOne({ userId })
    if (!jobseeker) throw new NotFoundException('Jobseeker profile not found')
    return jobseeker
}

export const JobseekerExperienceService = {
    updateExperience: async (userId: string, experienceData: IJobseekerExperience) => {
        const jobseeker = await findJobseeker(userId)

        if (!jobseeker.experiences) jobseeker.experiences = []

        const experienceIndex = jobseeker.experiences.findIndex(
            (exp) =>
                exp.companyName === experienceData.companyName && exp.title === experienceData.title,
        )

        if (experienceIndex > -1) {
            jobseeker.experiences[experienceIndex] = experienceData as any
        } else {
            jobseeker.experiences.push(experienceData as any)
        }

        jobseeker.markModified('experiences')
        await jobseeker.save()
        await jobseeker.populate('experiences.company')

        return jobseeker.experiences
    },

    bulkUpdateExperience: async (userId: string, experienceArray: IJobseekerExperience[]) => {
        const jobseeker = await findJobseeker(userId)

        jobseeker.experiences = experienceArray as any
        jobseeker.markModified('experiences')
        await jobseeker.save()

        return jobseeker
    },

    removeExperience: async (userId: string, experienceId: string) => {
        const jobseeker = await JobseekerModel.findOneAndUpdate(
            { userId },
            { $pull: { experiences: { _id: experienceId } } },
            { new: true },
        )

        if (!jobseeker) throw new NotFoundException('Jobseeker profile not found')

        await jobseeker.populate('experiences.company')
        return jobseeker.experiences
    },

    bulkRemoveExperience: async (userId: string, experienceIds: string[]) => {
        const jobseeker = await JobseekerModel.findOneAndUpdate(
            { userId },
            { $pull: { experiences: { _id: { $in: experienceIds } } } },
            { new: true },
        )

        if (!jobseeker) throw new NotFoundException('Jobseeker profile not found')

        await jobseeker.populate('experiences.company')
        return jobseeker.experiences
    },
}
