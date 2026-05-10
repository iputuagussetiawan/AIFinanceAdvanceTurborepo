// import { Request, Response } from 'express'
// import { z } from 'zod'
// import { asyncHandler } from '../../middlewares/asyncHandler.middleware'
// import { HTTPSTATUS } from '../../config/http.config'
// import { joinCompanyByInviteService } from './member.service'

// export const joinCompanyController = asyncHandler(async (req: Request, res: Response) => {
//     const inviteCode = z.string().parse(req.params.inviteCode)
//     const userId = req.user?._id
//     const { companyId, role } = await joinCompanyByInviteService(userId, inviteCode)
//     return res.status(HTTPSTATUS.OK).json({
//         message: 'Successfully joined the company',
//         companyId,
//         role
//     })
// })
