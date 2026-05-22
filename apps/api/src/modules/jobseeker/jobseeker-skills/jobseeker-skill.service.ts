import { NotFoundException } from '../../../utils/appError'
import JobseekerModel from '../jobseeker.model'
import type { IJobseekerSkill } from './jobseeker-skill.validation'

const findJobseeker = async (userId: string) => {
    const jobseeker = await JobseekerModel.findOne({ userId })
    if (!jobseeker) throw new NotFoundException('Jobseeker profile not found')
    return jobseeker
}

export const updateJobseekerSkillService = async (userId: string, skillData: IJobseekerSkill) => {
    const jobseeker = await findJobseeker(userId)

    if (!jobseeker.skills) jobseeker.skills = []

    const entryId = (skillData as any).id || (skillData as any)._id
    const existingEntry = entryId ? (jobseeker.skills as any).id(entryId) : null

    if (existingEntry) {
        existingEntry.set(skillData)
    } else {
        const isDuplicate = jobseeker.skills.some(
            (s: any) => s.skill.toString() === skillData.skill.toString(),
        )
        if (isDuplicate) {
            const duplicateEntry = jobseeker.skills.find(
                (s: any) => s.skill.toString() === skillData.skill.toString(),
            )
            ;(duplicateEntry as any).set(skillData)
        } else {
            jobseeker.skills.push(skillData as any)
        }
    }

    await jobseeker.save()
    await jobseeker.populate('skills.skill')

    return jobseeker.skills.sort((a: any, b: any) => a.orderPosition - b.orderPosition)
}

export const bulkUpdateJobseekerSkillsService = async (
    userId: string,
    skillsArray: IJobseekerSkill[],
) => {
    const jobseeker = await findJobseeker(userId)

    jobseeker.skills = skillsArray as any
    await jobseeker.save()
    await jobseeker.populate('skills.skill')

    return jobseeker.skills
}

export const removeJobseekerSkillService = async (userId: string, entryId: string) => {
    const jobseeker = await findJobseeker(userId)

    ;(jobseeker.skills as any).pull({ _id: entryId })
    await jobseeker.save()
    await jobseeker.populate('skills.skill')

    return jobseeker.skills
}

export const bulkRemoveJobseekerSkillsService = async (userId: string, entryIds: string[]) => {
    const jobseeker = await JobseekerModel.findOneAndUpdate(
        { userId },
        { $pull: { skills: { _id: { $in: entryIds } } } },
        { new: true },
    ).populate('skills.skill')

    if (!jobseeker) throw new NotFoundException('Jobseeker profile not found')

    return jobseeker.skills
}
