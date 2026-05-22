import { NotFoundException } from '../../../utils/appError'
import JobseekerModel from '../jobseeker.model'
import type { IJobseekerLanguage } from './jobseeker-language.validation'

const findJobseeker = async (userId: string) => {
    const jobseeker = await JobseekerModel.findOne({ userId })
    if (!jobseeker) throw new NotFoundException('Jobseeker profile not found')
    return jobseeker
}

export const updateJobseekerLanguageService = async (
    userId: string,
    languageData: IJobseekerLanguage,
) => {
    const jobseeker = await findJobseeker(userId)

    if (!jobseeker.languages) jobseeker.languages = []

    const existingIndex = jobseeker.languages.findIndex(
        (lang) => lang?.language?.toString() === languageData.language.toString(),
    )

    if (existingIndex > -1) {
        jobseeker.languages[existingIndex] = languageData as any
    } else {
        jobseeker.languages.push(languageData as any)
    }

    jobseeker.markModified('languages')
    await jobseeker.save()
    await jobseeker.populate('languages.language')

    return jobseeker.languages
}

export const bulkUpdateJobseekerLanguagesService = async (
    userId: string,
    languagesArray: IJobseekerLanguage[],
) => {
    const jobseeker = await findJobseeker(userId)

    jobseeker.languages = languagesArray as any
    jobseeker.markModified('languages')
    await jobseeker.save()
    await jobseeker.populate('languages.language')

    return jobseeker.languages
}

export const removeJobseekerLanguageService = async (userId: string, languageId: string) => {
    const jobseeker = await JobseekerModel.findOneAndUpdate(
        { userId },
        { $pull: { languages: { language: languageId } } },
        { new: true, runValidators: true },
    )

    if (!jobseeker) throw new NotFoundException('Jobseeker profile not found')

    await jobseeker.populate('languages.language')
    return jobseeker.languages
}

export const bulkRemoveJobseekerLanguagesService = async (
    userId: string,
    languageIds: string[],
) => {
    const jobseeker = await JobseekerModel.findOneAndUpdate(
        { userId },
        { $pull: { languages: { language: { $in: languageIds } } } },
        { new: true, runValidators: true },
    )

    if (!jobseeker) throw new NotFoundException('Jobseeker profile not found')

    await jobseeker.populate('languages.language')
    return jobseeker.languages
}
