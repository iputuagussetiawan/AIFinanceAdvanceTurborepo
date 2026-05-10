import z from 'zod'

import { BadRequestException, NotFoundException } from '../../utils/appError'
import { SkillModel, type SkillDocument } from './skill.model'
import { createSkillSchema, type ISkillInput } from './skill.validation'

/**
 * Membuat skill baru
 */
export const createSkillService = async (data: ISkillInput): Promise<SkillDocument> => {
    const existing = await SkillModel.findOne({ name: { $regex: `^${data.name}$`, $options: 'i' } })
    if (existing) throw new BadRequestException('Skill with this name already exists')

    const skill = new SkillModel(data)
    await skill.save()
    return skill
}

/**
 * Bulk Insert Skills
 * Cocok untuk seeding data dari SKILL_DATA constant
 */
export const bulkCreateSkillService = async (skills: ISkillInput[]) => {
    const bulkSchema = z.array(createSkillSchema)
    const validation = bulkSchema.safeParse(skills)
    if (!validation.success) throw new BadRequestException('Invalid skill data')

    try {
        const result = await SkillModel.insertMany(validation.data, { ordered: false })
        return result as unknown as SkillDocument[]
    } catch (error: any) {
        if (error.code === 11000) {
            throw new BadRequestException('Bulk insert failed: One or more skill names are duplicated')
        }
        throw error
    }
}

/**
 * Update skill
 */
export const updateSkillService = async (
    skillId: string,
    updateData: Partial<ISkillInput>,
): Promise<SkillDocument> => {
    const skill = await SkillModel.findById(skillId)
    if (!skill) throw new NotFoundException('Skill not found')

    if (updateData.name && updateData.name !== skill.name) {
        const nameExists = await SkillModel.findOne({
            name: { $regex: `^${updateData.name}$`, $options: 'i' },
        })
        if (nameExists) throw new BadRequestException('Skill with this name already exists')
    }

    Object.assign(skill, updateData)
    await skill.save()
    return skill
}

/**
 * Search skills tanpa pagination — untuk AutoSuggest/dropdown
 */
export const searchSkillsService = async (search: string = '', category: string = '') => {
    const filter: any = { isActive: true }

    if (search) {
        filter.name = { $regex: search, $options: 'i' }
    }

    if (category) {
        filter.category = category
    }

    const data = await SkillModel.find(filter).sort({ name: 1 }).limit(20)

    return data.map((doc) => doc.toJSON())
}

/**
 * Get all skills dengan pagination — untuk Admin Panel
 */
export const getSkillsService = async (query: any = {}) => {
    const { page = 1, limit = 10, search = '', category = '' } = query
    const skip = (Number(page) - 1) * Number(limit)

    const filter: any = { isActive: true }

    if (search) {
        filter.name = { $regex: search, $options: 'i' }
    }

    if (category) {
        filter.category = category
    }

    const [data, total] = await Promise.all([
        SkillModel.find(filter).sort({ category: 1, name: 1 }).skip(skip).limit(Number(limit)),
        SkillModel.countDocuments(filter),
    ])

    return {
        data: data.map((doc) => doc.toJSON()),
        meta: {
            total,
            page: Number(page),
            limit: Number(limit),
            lastPage: Math.ceil(total / Number(limit)),
        },
    }
}

/**
 * Delete skill (soft delete via isActive)
 */
export const deleteSkillService = async (skillId: string): Promise<void> => {
    const skill = await SkillModel.findById(skillId)
    if (!skill) throw new NotFoundException('Skill not found')

    skill.isActive = false
    await skill.save()
}