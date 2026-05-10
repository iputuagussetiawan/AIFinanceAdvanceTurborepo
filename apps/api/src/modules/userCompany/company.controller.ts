// import { Request, Response } from 'express'
// import { asyncHandler } from '../../middlewares/asyncHandler.middleware'
// import {
//     changeRoleSchema,
//     companyIdSchema,
//     createCompanySchema,
//     updateCompanySchema
// } from './company.validation'
// import {
//     changeMemberRoleService,
//     createCompanyService,
//     // deleteCompanyService,
//     // getAllCompanyUserIsMemberService,
//     getCompanyByIdService,
//     getCompanyMembersService,
//     updateCompanyByIdService
// } from './company.service'
// import { HTTPSTATUS } from '../../config/http.config'
// // import { getMemberRoleInCompany } from '../member/member.service'
// import { roleGuard } from '../role/role-guard.util'
// import { Permissions } from '../role/role.enum'

// // export const getAllCompaniesUserIsMemberController = asyncHandler(
// //     async (req: Request, res: Response) => {
// //         const userId = req.user?._id
// //         const { companies } = await getAllCompanyUserIsMemberService(userId)
// //         return res.status(HTTPSTATUS.OK).json({
// //             message: 'User companies fetched successfully',
// //             companies
// //         })
// //     }
// // )

// export const createCompanyController = asyncHandler(async (req: Request, res: Response) => {
//     const body = createCompanySchema.parse(req.body)
//     const userId = req.user?._id
//     const { company } = await createCompanyService(userId, body)
//     return res.status(HTTPSTATUS.OK).json({
//         message: 'Company created successfully',
//         company
//     })
// })

// export const getCompanyMembersController = asyncHandler(async (req: Request, res: Response) => {
//     const companyId = companyIdSchema.parse(req.params.id)
//     const userId = req.user?._id
//     const { role } = await getMemberRoleInCompany(userId, companyId)
//     roleGuard(role, [Permissions.VIEW_ONLY])
//     const { members, roles } = await getCompanyMembersService(companyId)
//     return res.status(HTTPSTATUS.OK).json({
//         message: 'Company members retrieved successfully',
//         members,
//         roles
//     })
// })

// export const updateCompanyByIdController = asyncHandler(async (req: Request, res: Response) => {
//     const companyId = companyIdSchema.parse(req.params.id)
//     const body = updateCompanySchema.parse(req.body)
//     const { company } = await updateCompanyByIdService(companyId, body)
//     return res.status(HTTPSTATUS.OK).json({
//         message: 'Company updated successfully',
//         company
//     })
// })

// export const getCompanyByIdController = asyncHandler(async (req: Request, res: Response) => {
//     const companyId = companyIdSchema.parse(req.params.id)
//     const userId = req.user?._id
//     await getMemberRoleInCompany(userId, companyId)
//     const { company } = await getCompanyByIdService(companyId)
//     return res.status(HTTPSTATUS.OK).json({
//         message: 'Company fetched successfully',
//         company
//     })
// })

// // export const deleteCompanyByIdController = asyncHandler(async (req: Request, res: Response) => {
// //     const companyId = companyIdSchema.parse(req.params.id)
// //     const userId = req.user?._id
// //     const { role } = await getMemberRoleInCompany(userId, companyId)
// //     roleGuard(role, [Permissions.DELETE_COMPANY])
// //     const { currentCompany } = await deleteCompanyService(companyId, userId)
// //     return res.status(HTTPSTATUS.OK).json({
// //         message: 'Company deleted successfully',
// //         currentCompany
// //     })
// // })

// export const changeCompanyMemberRoleController = asyncHandler(
//     async (req: Request, res: Response) => {
//         const companyId = companyIdSchema.parse(req.params.id)
//         const { memberId, roleId } = changeRoleSchema.parse(req.body)
//         const userId = req.user?._id
//         const { role } = await getMemberRoleInCompany(userId, companyId)
//         roleGuard(role, [Permissions.CHANGE_COMPANY_USER_ROLE])
//         const { member } = await changeMemberRoleService(companyId, memberId, roleId)
//         return res.status(HTTPSTATUS.OK).json({
//             message: 'Member Role changed successfully',
//             member
//         })
//     }
// )
