import { NotFoundException } from '../../../utils/appError'
import JobseekerModel from '../jobseeker.model'
import type { IJobseekerEducation } from './jobseeker-education.validation'

const findJobseeker = async (userId: string) => {
    const jobseeker = await JobseekerModel.findOne({ userId })
    if (!jobseeker) throw new NotFoundException('Jobseeker profile not found')
    return jobseeker
}

export const updateJobseekerEducationService = async (
    userId: string,
    educationData: IJobseekerEducation,
) => {
    const jobseeker = await findJobseeker(userId)

    if (!jobseeker.educations) jobseeker.educations = []

    const educationIndex = jobseeker.educations.findIndex(
        (edu) =>
            edu.institutionName === educationData.institutionName &&
            edu.degree === educationData.degree,
    )

    if (educationIndex > -1) {
        jobseeker.educations[educationIndex] = educationData as any
    } else {
        jobseeker.educations.push(educationData as any)
    }

    jobseeker.markModified('educations')
    await jobseeker.save()
    await jobseeker.populate('educations.institution')

    return jobseeker.educations
}

export const bulkUpdateJobseekerEducationService = async (
    userId: string,
    educationArray: IJobseekerEducation[],
) => {
    const jobseeker = await findJobseeker(userId)

    jobseeker.educations = educationArray as any
    jobseeker.markModified('educations')
    await jobseeker.save()

    return jobseeker
}

export const removeJobseekerEducationService = async (userId: string, educationId: string) => {
    const jobseeker = await JobseekerModel.findOneAndUpdate(
        { userId },
        { $pull: { educations: { _id: educationId } } },
        { new: true },
    )

    if (!jobseeker) throw new NotFoundException('Jobseeker profile not found')

    await jobseeker.populate('educations.institution')
    return jobseeker.educations
}

export const bulkRemoveJobseekerEducationService = async (
    userId: string,
    educationIds: string[],
) => {
    const jobseeker = await JobseekerModel.findOneAndUpdate(
        { userId },
        { $pull: { educations: { _id: { $in: educationIds } } } },
        { new: true },
    )

    if (!jobseeker) throw new NotFoundException('Jobseeker profile not found')

    await jobseeker.populate('educations.institution')
    return jobseeker.educations
}
