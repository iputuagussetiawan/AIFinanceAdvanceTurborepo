import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { Request } from 'express'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { UserService } from './user.service'

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private userService: UserService) {}

    @Get('me')
    getMe(@Req() req: Request) {
        const user = req.user as any
        return this.userService.getMe(user.userId, user.sessionId)
    }
}
