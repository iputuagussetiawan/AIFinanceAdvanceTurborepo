import { NotFoundException } from '../../utils/appError'
import UserModel from '../user/user.model'
import type { IUserSkill } from './user-skill.validation'

/**
 * Update atau Tambah skill tunggal
 */
export const updateUserSkillService = async (userId: string, skillData: IUserSkill) => {
    const user = await UserModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    // Pastikan array skills terinisialisasi
    if (!user.skills) user.skills = [];

    // ID dari entri UserSkill (bukan ID dari master skill)
    const entryId = (skillData as any).id || (skillData as any)._id;

    // 1. Cari berdasarkan ID entri jika sedang melakukan update
    const existingEntry = entryId ? (user.skills as any).id(entryId) : null;

    if (existingEntry) {
        // UPDATE: Gunakan set() untuk mengupdate sub-document
        existingEntry.set(skillData);
    } else {
        // ADD: Cek dulu apakah master skill yang sama sudah pernah ditambahkan
        const isDuplicate = user.skills.some(
            (s: any) => s.skill.toString() === skillData.skill.toString()
        );

        if (isDuplicate) {
            // Jika duplikat, cari dan update yang sudah ada
            const duplicateEntry = user.skills.find(
                (s: any) => s.skill.toString() === skillData.skill.toString()
            );
            (duplicateEntry as any).set(skillData);
        } else {
            // Tambah baru
            user.skills.push(skillData as any);
        }
    }

    await user.save();

    // Populate data dari model Skill (name, icon, category)
    await user.populate('skills.skill');
    
    // Kembalikan skills yang sudah diurutkan berdasarkan posisi
    return user.skills.sort((a: any, b: any) => a.orderPosition - b.orderPosition);
}

/**
 * Bulk Update: Berguna untuk Reordering (Drag & Drop)
 */
export const bulkUpdateUserSkillsService = async (userId: string, skillsArray: IUserSkill[]) => {
    const user = await UserModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    // Timpa seluruh array
    user.skills = skillsArray as any;

    await user.save();
    await user.populate('skills.skill');
    
    return user.skills
}

/**
 * Hapus skill berdasarkan ID entri
 */
export const removeUserSkillService = async (userId: string, entryId: string) => {
    const user = await UserModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    // Mongoose array .pull() sangat efektif untuk menghapus berdasarkan ID
    (user.skills as any).pull({ _id: entryId });

    await user.save();
    await user.populate('skills.skill');
    
    return user.skills;
}

/**
 * Bulk Remove: Menghapus banyak entri skill sekaligus
 * Menggunakan operator $pull Mongoose untuk efisiensi maksimal
 */
export const bulkRemoveUserSkillsService = async (userId: string, entryIds: string[]) => {
    // 1. Cari user dan hapus entri yang ID-nya ada di dalam array entryIds
    // $pull menghapus elemen dari array yang cocok dengan kriteria
    const user = await UserModel.findByIdAndUpdate(
        userId,
        {
            $pull: {
                skills: {
                    _id: { $in: entryIds }
                }
            }
        },
        { new: true } // Mengembalikan dokumen yang sudah diupdate
    ).populate('skills.skill');

    if (!user) {
        throw new NotFoundException('User not found');
    }

    // 2. Kembalikan daftar skill yang tersisa
    return user.skills;
};