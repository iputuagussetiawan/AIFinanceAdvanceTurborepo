import mongoose from 'mongoose'

import { NotFoundException } from '../../utils/appError'
import UserModel from '../user/user.model'
import EducationModel, { type EducationDocument } from './education.model'
import type { EducationDTO } from './education.validation'

/**
 * Service to handle saving a single education record
 */
export const saveEducationHistoryService = async (
    userId: string,
    body: EducationDTO, // Changed from EducationDTO[] to a single object
) => {
    // 1. Verify user exists
    const user = await UserModel.findById(userId)
    if (!user) {
        throw new NotFoundException('User not found')
    }

    // 2. Since we are only saving one document,
    // we can use a simpler approach without a heavy transaction if preferred,
    // but keeping it here for consistency with your auth logic.
    const session = await mongoose.startSession()

    try {
        session.startTransaction()

        // 3. Create the single education document
        const education = new EducationModel({
            ...body,
            userId: userId,
        })

        // 4. Save within the transaction
        await education.save({ session })

        await session.commitTransaction()

        return {
            education,
        }
    } catch (error: any) {
        await session.abortTransaction()
        console.error('❌ [TRANSACTION] Education save aborted:', error.message)
        throw error
    } finally {
        session.endSession()
    }
}

export const updateEducationHistoryService = async (
    userId: string,
    educations: EducationDTO[], // Expecting the array from your form
) => {
    // 1. Verify user exists
    const user = await UserModel.findById(userId)
    if (!user) {
        throw new NotFoundException('User not found')
    }

    const session = await mongoose.startSession()

    try {
        session.startTransaction()

        // 2. Delete existing education records for this user to perform a clean sync
        // This is easier than trying to track which ones were edited vs deleted vs added
        await EducationModel.deleteMany({ userId }, { session })

        // 3. Prepare the new documents with the userId
        const educationDocs = educations.map((edu) => ({
            ...edu,
            userId: userId,
        }))

        // 4. Bulk Insert
        const savedEducations = await EducationModel.insertMany(educationDocs, { session })

        await session.commitTransaction()

        return {
            data: savedEducations,
            count: savedEducations.length,
        }
    } catch (error: any) {
        await session.abortTransaction()
        console.error('❌ [TRANSACTION] Bulk Education update aborted:', error.message)
        throw error
    } finally {
        session.endSession()
    }
}

export const getEducationHistory = async (userId: string): Promise<EducationDocument[]> => {
    try {
        // 1. Validate the userId format
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid User ID format')
        }

        // 2. Fetch the data
        // We sort by orderPosition (ascending) then by startDate (descending)
        const history = await EducationModel.find({ userId })
            .sort({ orderPosition: 1, startDate: -1 })
            .lean() // .lean() makes the query faster by returning plain JS objects

        return history as unknown as EducationDocument[]
    } catch (error: any) {
        throw new Error(`Error fetching education history: ${error.message}`)
    }
}
