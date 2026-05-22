import mongoose from 'mongoose'

import { BadRequestException, NotFoundException } from '../../utils/appError'
import MemberModel from '../member/member.model'
import { Roles } from '../role/role.enum'
import RoleModel from '../role/roles-permission.model'
import UserModel from '../user/user.model'
import JobseekerModel from './jobseeker.model' // Assuming your profile model name
import type { JobseekerPersonalInfoDTO } from './jobseeker.validation' // Assuming you have this schema

/**
 * Service to handle creating or updating the core Jobseeker profile
 */
export const saveJobseekerProfileService = async (
    userId: string,
    body: JobseekerPersonalInfoDTO,
) => {
    // 1. Verify user exists
    const user = await UserModel.findById(userId)
    if (!user) {
        throw new NotFoundException('User not found')
    }

    // 2. Start session for atomic transaction
    const session = await mongoose.startSession()

    try {
        session.startTransaction()

        // 3. Split DTO: User owns identity/contact, Jobseeker owns profile-specific fields
        const {
            firstName,
            lastName,
            phoneNumber,
            address,
            website,
            birthday,
            ...jobseekerFields
        } = body

        await UserModel.findByIdAndUpdate(
            userId,
            {
                $set: {
                    firstName,
                    lastName,
                    phoneNumber,
                    address,
                    website,
                    birthday: birthday ? new Date(birthday) : null,
                    onboardingComplete: true,
                },
            },
            { session, runValidators: true },
        )

        // 4. Upsert jobseeker-specific fields
        const profile = await JobseekerModel.findOneAndUpdate(
            { userId },
            {
                ...jobseekerFields,
                userId,
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
                session,
            },
        )

        //check owner role
        const jobseekerRole = await RoleModel.findOne({
            name: Roles.JOBSEEKER,
        }).session(session)

        //jika owner role tidak ditemukan, maka tampilkan error
        if (!jobseekerRole) {
            throw new NotFoundException('Jobseeker role not found')
        }

        //buat member baru dengan role jobseeker
        // We find the member by userId and update their role
        await MemberModel.findOneAndUpdate(
            { userId: userId },
            {
                role: jobseekerRole._id,
                // Optional: you might want to update joinedAt or an "onboardedAt" field here
            },
            {
                session,
                new: true,
                upsert: true, // In case the member record was somehow missing
            },
        )

        await session.commitTransaction()

        return {
            profile,
        }
    } catch (error: any) {
        await session.abortTransaction()
        console.error('❌ [TRANSACTION] Jobseeker profile save aborted:', error.message)

        // Handle MongoDB unique constraint errors (e.g., duplicate slug or phone)
        if (error.code === 11000) {
            throw new BadRequestException('A profile with this unique information already exists')
        }

        throw error
    } finally {
        session.endSession()
    }
}

/**
 * Service to get the complete Jobseeker profile including Experience and Education
 */
export const getFullJobseekerProfileService = async (userId: string) => {
    const profile = await JobseekerModel.findOne({ userId })
        .populate('userId', 'firstName lastName email profilePicture phoneNumber address website')
        .lean()
    if (!profile) {
        throw new NotFoundException('Profile not found')
    }
    return { profile }
}
