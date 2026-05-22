import mongoose from 'mongoose'

import { BadRequestException, NotFoundException } from '../../utils/appError'
import MemberModel from '../member/member.model'
import { Roles } from '../role/role.enum'
import RoleModel from '../role/roles-permission.model'
import UserModel from '../user/user.model'
import JobseekerModel from './jobseeker.model'
import type { JobseekerPersonalInfoDTO } from './jobseeker.validation'

export const JobseekerService = {
    saveProfile: async (userId: string, body: JobseekerPersonalInfoDTO) => {
        const user = await UserModel.findById(userId)
        if (!user) throw new NotFoundException('User not found')

        const session = await mongoose.startSession()

        try {
            session.startTransaction()

            await UserModel.findByIdAndUpdate(
                userId,
                { $set: { onboardingComplete: true } },
                { session },
            )

            const profile = await JobseekerModel.findOneAndUpdate(
                { userId },
                { ...body, userId },
                { new: true, upsert: true, runValidators: true, session },
            )

            const jobseekerRole = await RoleModel.findOne({ name: Roles.JOBSEEKER }).session(session)
            if (!jobseekerRole) throw new NotFoundException('Jobseeker role not found')

            await MemberModel.findOneAndUpdate(
                { userId },
                { role: jobseekerRole._id },
                { session, new: true, upsert: true },
            )

            await session.commitTransaction()

            return { profile }
        } catch (error: any) {
            await session.abortTransaction()

            if (error.code === 11000) {
                throw new BadRequestException('A profile with this unique information already exists')
            }

            throw error
        } finally {
            session.endSession()
        }
    },

    getFullProfile: async (userId: string) => {
        const profile = await JobseekerModel.findOne({ userId })
            .populate('userId', 'firstName lastName email profilePicture phoneNumber address website')
            .lean()

        if (!profile) throw new NotFoundException('Profile not found')

        return { profile }
    },
}
