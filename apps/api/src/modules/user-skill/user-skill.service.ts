import { NotFoundException } from '../../utils/appError'
import UserModel from '../user/user.model'
import type { IUserSkill } from './user-skill.validation'

/**
 * Update atau Tambah skill tunggal
 * Menggunakan ID (virtual) atau skillName sebagai pencocokan
 */
export const updateUserSkillService = async (userId: string, skillData: IUserSkill) => {
    const user = await UserModel.findById(userId)
    if (!user) throw new NotFoundException('User not found')

    if (!user.skills) {
        user.skills = []
    }

    const skillDataId = (skillData as any)._id?.toString()

    // 1. Cari index berdasarkan ID (jika ada) atau skillName
    const skillIndex = user.skills.findIndex(
        (skill: any) =>
            skill.skillName === skillData.skillName || skill._id?.toString() === skillDataId,
    )

    if (skillIndex > -1) {
        // UPDATE: Mutasi entri yang sudah ada dengan data terbaru
        Object.assign(user.skills[skillIndex], skillData)
    } else {
        // ADD: Tambah skill baru
        user.skills.push(skillData as any)
    }

    // 2. Tandai modifikasi agar Mongoose menyimpan perubahan array
    user.markModified('skills')
    await user.save()

    // 3. Populate & Sort berdasarkan orderPosition untuk konsistensi UI
    await user.populate('skills.skill')
    return user.skills
}

/**
 * Bulk Update: Sinkronisasi seluruh daftar skill
 * Berguna untuk fitur drag-and-drop reorder atau form besar
 */
export const bulkUpdateUserSkillsService = async (userId: string, skillsArray: IUserSkill[]) => {
    const user = await UserModel.findById(userId)
    if (!user) throw new NotFoundException('User not found')

    // Skenario A: Timpa seluruh array (Sync total)
    user.skills = skillsArray as any

    user.markModified('skills')
    await user.save()

    await user.populate('skills.skill')
    return user.skills
}

/**
 * Hapus skill berdasarkan ID entri
 */
export const removeUserSkillService = async (userId: string, entryId: string) => {
    const user = await UserModel.findById(userId)
    if (!user) throw new NotFoundException('User not found')

    if (!user.skills) {
        user.skills = []
    }

    // Menggunakan filter untuk menghapus entri spesifik
    user.skills = user.skills.filter((s: any) => s.id !== entryId && s._id?.toString() !== entryId)

    user.markModified('skills')
    await user.save()

    await user.populate('skills.skill')
    return user.skills
}
