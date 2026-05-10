// import { ErrorCodeEnum } from '../../enums/error-code.enum'
// import { BadRequestException, NotFoundException, UnauthorizedException } from '../../utils/appError'
// import CompanyModel from '../company/company.model'
// import { Roles } from '../role/role.enum'
// import RoleModel from '../role/roles-permission.model'
// import MemberModel from './member.model'

// export const getMemberRoleInCompany = async (userId: string, companyId: string) => {
//     const company = await CompanyModel.findById(companyId)
//     if (!company) {
//         throw new NotFoundException('Company not found')
//     }
//     const member = await MemberModel.findOne({
//         userId,
//         companyId
//     }).populate('role')
//     if (!member) {
//         throw new UnauthorizedException(
//             'You are not a member of this company',
//             ErrorCodeEnum.ACCESS_UNAUTHORIZED
//         )
//     }
//     const roleName = member.role?.name
//     return { role: roleName }
// }

// export const joinCompanyByInviteService = async (userId: string, inviteCode: string) => {
//     // Find company by invite code
//     const company = await CompanyModel.findOne({ inviteCode }).exec()
//     if (!company) {
//         throw new NotFoundException('Invalid invite code or company not found')
//     }

//     // Check if user is already a member
//     const existingMember = await MemberModel.findOne({
//         userId,
//         companyId: company._id
//     }).exec()

//     if (existingMember) {
//         throw new BadRequestException('You are already a member of this company')
//     }

//     const role = await RoleModel.findOne({ name: Roles.MEMBER })

//     if (!role) {
//         throw new NotFoundException('Role not found')
//     }

//     // Add user to workspace as a member
//     const newMember = new MemberModel({
//         userId,
//         companyId: company._id,
//         role: role._id
//     })
//     await newMember.save()

//     return { companyId: company._id, role: role.name }
// }
