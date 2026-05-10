import { NotFoundException } from '../../utils/appError'
import UserModel from '../user/user.model'
import type { IUserExperience } from './user-experience.validation'

/**
 * Service untuk menambah atau memperbarui satu entri pengalaman kerja
 */
export const updateUserExperienceService = async (
    userId: string,
    experienceData: IUserExperience,
) => {
    const user = await UserModel.findById(userId)
    if (!user) throw new NotFoundException('User not found')

    if (!user.experiences) user.experiences = []

    // Mencari entri yang sama berdasarkan Nama Perusahaan dan Posisi
    const experienceIndex = user.experiences.findIndex(
        (exp) =>
            exp.companyName === experienceData.companyName && exp.title === experienceData.title,
    )

    if (experienceIndex > -1) {
        // Update entri yang ada
        user.experiences[experienceIndex] = experienceData
    } else {
        // Tambah entri baru
        user.experiences.push(experienceData)
    }

    user.markModified('experiences')
    await user.save()

    // Opsional: Populate reference jika ada field company ID
    await user.populate('experiences.company')

    return user.experiences
}

/**
 * Bulk Add atau Update riwayat pengalaman kerja (Penting untuk Reordering/Dnd)
 */
export const bulkUpdateUserExperienceService = async (
    userId: string,
    experienceArray: IUserExperience[],
) => {
    const user = await UserModel.findById(userId)
    if (!user) throw new NotFoundException('User not found')

    // Menimpa array lama dengan array baru (termasuk urutan orderPosition yang baru)
    user.experiences = experienceArray

    user.markModified('experiences')
    await user.save()

    return user
}

/**
 * Service untuk menghapus satu entri pengalaman kerja spesifik
 */
export const removeUserExperienceService = async (userId: string, experienceId: string) => {
    const result = await UserModel.findByIdAndUpdate(
        userId,
        { $pull: { experiences: { _id: experienceId } } },
        { new: true },
    )

    if (!result) throw new NotFoundException('User not found')

    await result.populate('experiences.company')
    return result.experiences
}

/**
 * Bulk remove entri pengalaman berdasarkan list ID
 */
export const bulkRemoveUserExperienceService = async (userId: string, experienceIds: string[]) => {
    const result = await UserModel.findByIdAndUpdate(
        userId,
        {
            $pull: {
                experiences: { _id: { $in: experienceIds } },
            },
        },
        { new: true },
    )

    if (!result) throw new NotFoundException('User not found')

    await result.populate('experiences.company')
    return result.experiences
}
