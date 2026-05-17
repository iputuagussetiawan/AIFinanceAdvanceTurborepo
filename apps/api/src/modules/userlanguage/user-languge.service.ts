import { NotFoundException } from '../../utils/appError'
import UserModel from '../user/user.model'
import type { IUserLanguage } from './user-language.validation'

// ─────────────────────────────────────────────
// Single update or add
// ─────────────────────────────────────────────

export const updateUserLanguageService = async (
    userId: string,
    languageData: IUserLanguage,
) => {
    const user = await UserModel.findById(userId)
    if (!user) throw new NotFoundException('User not found')

    if (!user.languages) user.languages = []

    const existingIndex = user.languages.findIndex(
        (lang) => lang?.language?.toString() === languageData.language.toString(),
    )

    if (existingIndex > -1) {
        user.languages[existingIndex] = languageData
    } else {
        user.languages.push(languageData)
    }

    user.markModified('languages')
    await user.save()
    await user.populate('languages.language')

    return user.languages
}

// ─────────────────────────────────────────────
// Bulk replace
// ─────────────────────────────────────────────

export const bulkUpdateUserLanguagesService = async (
    userId: string,
    languagesArray: IUserLanguage[],
) => {
    const user = await UserModel.findById(userId)
    if (!user) throw new NotFoundException('User not found')

    user.languages = languagesArray

    user.markModified('languages')
    await user.save()
    await user.populate('languages.language')

    return user.languages
}

// ─────────────────────────────────────────────
// Single remove
// ─────────────────────────────────────────────

export const removeUserLanguageService = async (
    userId: string,
    languageId: string,
) => {
    const user = await UserModel.findByIdAndUpdate(
        userId,
        { $pull: { languages: { language: languageId } } },
        { new: true, runValidators: true },
    )

    if (!user) throw new NotFoundException('User not found')

    await user.populate('languages.language')

    return user.languages
}

// ─────────────────────────────────────────────
// Bulk remove
// ─────────────────────────────────────────────

export const bulkRemoveUserLanguagesService = async (
    userId: string,
    languageIds: string[],
) => {
    const user = await UserModel.findByIdAndUpdate(
        userId,
        { $pull: { languages: { language: { $in: languageIds } } } },
        { new: true, runValidators: true },
    )

    if (!user) throw new NotFoundException('User not found')

    await user.populate('languages.language')

    return user.languages
}