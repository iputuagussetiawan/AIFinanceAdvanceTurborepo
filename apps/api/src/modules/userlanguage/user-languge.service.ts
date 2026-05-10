import { NotFoundException } from '../../utils/appError'
import UserModel from '../user/user.model'
import type { IUserLanguage } from './user-language.validation'

export const updateUserLanguageService = async (userId: string, languageData: IUserLanguage) => {
    // 1. Cari user berdasarkan ID
    const user = await UserModel.findById(userId)
    if (!user) throw new NotFoundException('User not found')

    // Pastikan array languages tersedia
    if (!user.languages) {
        user.languages = []
    }

    // VALIDASI: Pastikan language (ObjectId) dikirim dari request
    if (!languageData.language) {
        throw new Error('Language ID is required')
    }

    // 2. Cari indeks bahasa menggunakan field 'language' (sebelumnya languageId)
    // Gunakan optional chaining (?.) untuk menghindari crash jika ada data null di DB
    const languageIndex = user.languages.findIndex(
        (lang) => lang?.language?.toString() === languageData.language.toString(),
    )

    if (languageIndex > -1) {
        // UPDATE: Perbarui data bahasa yang sudah ada
        // Karena kita menghapus 'name', Mongoose hanya akan menyimpan 'language' dan 'proficiency'
        user.languages[languageIndex] = languageData
    } else {
        // ADD: Tambahkan bahasa baru ke array
        user.languages.push(languageData)
    }

    // 3. PENTING: Beritahu Mongoose bahwa array 'languages' telah berubah
    // Tanpa ini, perubahan pada indeks array terkadang tidak tersimpan di MongoDB
    user.markModified('languages')

    await user.save()

    // 4. Populate: Karena 'name' sudah dihapus, kita butuh populate
    // agar data yang dikembalikan ke Nuxt berisi detail bahasa (untuk UI)
    await user.populate('languages.language')

    return user.languages
}

/**
 * Bulk Add or Update languages for a user
 */
export const bulkUpdateUserLanguagesService = async (
    userId: string,
    languagesArray: IUserLanguage[],
) => {
    const user = await UserModel.findById(userId)
    if (!user) throw new NotFoundException('User not found')

    // 1. Inisialisasi array jika undefined
    if (!user.languages) {
        user.languages = []
    }

    // 2. Filter data masuk: Pastikan hanya memproses yang memiliki ID language
    // Ini mencegah error "Language ID is required" saat save
    const validIncomingData = languagesArray.filter((lang) => lang && lang.language)

    for (const incomingLang of validIncomingData) {
        // Cari index berdasarkan 'language' (sebelumnya languageId)
        // Gunakan optional chaining (?.) untuk keamanan ekstra
        const index = user.languages.findIndex(
            (existing) => existing?.language?.toString() === incomingLang.language.toString(),
        )

        if (index > -1) {
            // UPDATE: Timpa data pada index tersebut
            user.languages[index] = incomingLang
        } else {
            // ADD: Masukkan data baru
            user.languages.push(incomingLang)
        }
    }

    // 3. Beritahu Mongoose bahwa array 'languages' telah dimodifikasi
    user.markModified('languages')

    await user.save()

    // 4. Populate: Ambil detail nama bahasa dari master data sebelum dikembalikan ke Nuxt
    await user.populate('languages.language')

    return user.languages
}

/**
 * Service to remove a language from the user
 */
export const removeUserLanguageService = async (userId: string, languageId: string) => {
    const result = await UserModel.findByIdAndUpdate(
        userId,
        {
            // Ubah dari languageId menjadi language
            $pull: { languages: { language: languageId } },
        },
        {
            new: true,
            // Opsional: jalankan validasi agar data tetap konsisten
            runValidators: true,
        },
    )

    if (!result) throw new NotFoundException('User not found')

    // Karena field 'name' sudah dihapus, jika Anda ingin mengembalikan
    // data sisa bahasa lengkap dengan detailnya ke UI:
    await result.populate('languages.language')

    return result.languages
}

/**
 * Bulk remove languages from a user's profile
 */

export const bulkRemoveUserLanguagesService = async (userId: string, languageIds: string[]) => {
    // Kita menggunakan $pull dengan $in untuk menghapus semua ID yang cocok sekaligus
    const result = await UserModel.findByIdAndUpdate(
        userId,
        {
            $pull: {
                languages: {
                    // Ubah dari languageId menjadi language
                    language: { $in: languageIds },
                },
            },
        },
        {
            new: true,
            runValidators: true,
        },
    )

    if (!result) throw new NotFoundException('User not found')

    // Karena field 'name' sudah tidak ada di profil user,
    // kita lakukan populate agar sisa data bahasa memiliki nama untuk UI
    await result.populate('languages.language')

    return result.languages
}
