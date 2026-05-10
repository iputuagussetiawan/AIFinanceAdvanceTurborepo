import mongoose from 'mongoose'

import { BadRequestException, NotFoundException } from '../../utils/appError'
import MemberModel from '../member/member.model'
import { Roles } from '../role/role.enum'
import RoleModel from '../role/roles-permission.model'
import UserModel from '../user/user.model'
import CompanyModel from './company.model'
import type { CreateCompanyInputType, UpdateCompanyInputType } from './company.validation'

// export const getAllCompanyUserIsMemberService = async (userId: string) => {
//     const memberships = await MemberModel.find({ userId })
//         .populate('companyId')
//         .select('-password')
//         .exec()
//     // Extract workspace details from memberships
//     const companies = memberships.map((membership) => membership.companyId)
//     return { companies }
// }

export const createCompanyService = async (userId: string, body: CreateCompanyInputType) => {
    const user = await UserModel.findById(userId)
    if (!user) {
        throw new NotFoundException('User not found')
    }
    const ownerRole = await RoleModel.findOne({ name: Roles.OWNER })

    if (!ownerRole) {
        throw new NotFoundException('Owner role not found')
    }

    // //buat company
    const company = new CompanyModel({
        ...body,
        // Ensure owner is set correctly if it differs from body.owner
        owner: userId,
    })

    //simpan company
    await company.save()

    //  // 1. Check if name already exists (The "Unique" check)
    // const existingCompany = await CompanyModel.findOne({
    //     name: { $regex: new RegExp(`^${body.name}$`, 'i') }
    // })

    // if (existingCompany) {
    //     // Assuming you have a custom exception handler
    //     throw new Error('Company name already exists')
    // }

    const member = new MemberModel({
        userId: user._id,
        companyId: company._id,
        role: ownerRole._id,
        joinedAt: new Date(),
    })
    await member.save()
    user.currentCompany = company._id as mongoose.Types.ObjectId
    await user.save()
    return {
        company,
    }
}

export const getCompanyMembersService = async (companyId: string) => {
    // Fetch all members of the company
    const members = await MemberModel.find({
        companyId,
    })
        .populate('userId', 'name email profilePicture -password')
        .populate('role', 'name')
    const roles = await RoleModel.find({}, { name: 1, _id: 1 }).select('-permission').lean()
    return { members, roles }
}

export const updateCompanyByIdService = async (companyId: string, body: UpdateCompanyInputType) => {
    const company = await CompanyModel.findById(companyId)
    if (!company) {
        throw new NotFoundException('Workspace not found')
    }
    // Update the company details
    company.name = body.name || company.name
    company.slug = body.slug || company.slug
    company.logoUrl = body.logoUrl || company.logoUrl
    company.bgUrl = body.bgUrl || company.bgUrl
    company.baseCurrency = body.baseCurrency || company.baseCurrency
    company.fiscalYearStartMonth = body.fiscalYearStartMonth || company.fiscalYearStartMonth
    company.isActive = body.isActive || company.isActive
    await company.save()
    return {
        company,
    }
}

export const getCompanyByIdService = async (companyId: string) => {
    const company = await CompanyModel.findById(companyId)
    if (!company) {
        throw new NotFoundException('Company not found')
    }

    const members = await MemberModel.find({
        companyId,
    }).populate('role')
    const companyWithMembers = {
        ...company.toObject(),
        members,
    }
    return {
        company: companyWithMembers,
    }
}

// export const deleteCompanyService = async (companyId: string, userId: string) => {
//     const session = await mongoose.startSession()
//     session.startTransaction()
//     try {
//         const company = await CompanyModel.findById(companyId).session(session)
//         // console.log('Company to delete:', company)
//         if (!company) {
//             throw new NotFoundException('Company not found')
//         }

//         // console.log(company.owner.toString(), userId.toString())
//         //Check if the user owns the company
//         if (company.owner.toString() !== userId.toString()) {
//             throw new BadRequestException('You are not authorized to delete this company')
//         }
//         const user = await UserModel.findById(userId).session(session)
//         if (!user) {
//             throw new NotFoundException('User not found')
//         }

//         await MemberModel.deleteMany({
//             companyId: company._id
//         }).session(session)

//         // Update the user's currentCompany if it matches the deleted company
//         if (user?.currentCompany?.equals(companyId)) {
//             const memberCompany = await MemberModel.findOne({ userId }).session(session)
//             // Update the user's currentCompany
//             user.currentCompany = memberCompany ? memberCompany.companyId : null
//             await user.save({ session })
//         }
//         await company.deleteOne({ session })
//         await session.commitTransaction()
//         session.endSession()
//         return {
//             currentCompany: user.currentCompany
//         }
//     } catch (error) {
//         await session.abortTransaction()
//         session.endSession()
//         throw error
//     }
// }

export const changeMemberRoleService = async (
    companyId: string,
    memberId: string,
    roleId: string,
) => {
    const company = await CompanyModel.findById(companyId)
    if (!company) {
        throw new NotFoundException('Company not found')
    }
    const role = await RoleModel.findById(roleId)
    if (!role) {
        throw new NotFoundException('Role not found')
    }
    const member = await MemberModel.findOne({
        userId: memberId,
        companyId: companyId,
    })
    if (!member) {
        throw new Error('Member not found in the company')
    }
    member.role = role
    await member.save()
    return {
        member,
    }
}
