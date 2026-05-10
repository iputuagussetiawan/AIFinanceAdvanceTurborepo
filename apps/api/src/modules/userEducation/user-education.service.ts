import { NotFoundException } from '../../utils/appError'
import UserModel from '../user/user.model'
import type { IUserEducation } from './user-education.validation'

/**
 * Service to Add or Update a single Education entry
 */
export const updateUserEducationService = async (userId: string, educationData: IUserEducation) => {
    const user = await UserModel.findById(userId)
    if (!user) throw new NotFoundException('User not found')

    if (!user.educations) user.educations = []

    const educationIndex = user.educations.findIndex(
        (edu) =>
            edu.institutionName === educationData.institutionName &&
            edu.degree === educationData.degree,
    )

    if (educationIndex > -1) {
        user.educations[educationIndex] = educationData
    } else {
        user.educations.push(educationData)
    }

    user.markModified('educations')
    await user.save()
    await user.populate('educations.institution')

    return user.educations
}

/**
 * Bulk Add or Update education history
 */
export const bulkUpdateUserEducationService = async (
    userId: string,
    educationArray: IUserEducation[],
) => {
    const user = await UserModel.findById(userId)
    if (!user) throw new NotFoundException('User not found')

    user.educations = educationArray
    user.markModified('educations')
    await user.save()
    //await user.populate('educations.institution')

    return user
}

/**
 * Service to remove a specific education entry
 */
export const removeUserEducationService = async (userId: string, educationId: string) => {
    const result = await UserModel.findByIdAndUpdate(
        userId,
        { $pull: { educations: { _id: educationId } } },
        { new: true },
    )

    if (!result) throw new NotFoundException('User not found')

    await result.populate('educations.institution')
    return result.educations
}

/**
 * Bulk remove education entries by IDs
 */
export const bulkRemoveUserEducationService = async (userId: string, educationIds: string[]) => {
    const result = await UserModel.findByIdAndUpdate(
        userId,
        {
            $pull: {
                educations: { _id: { $in: educationIds } },
            },
        },
        { new: true },
    )

    if (!result) throw new NotFoundException('User not found')

    await result.populate('educations.institution')
    return result.educations
}
