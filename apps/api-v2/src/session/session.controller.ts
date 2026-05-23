import { Controller, Get, Delete, Param, Req, UseGuards } from '@nestjs/common'
import { Request } from 'express'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { SessionService } from './session.service'

@Controller('sessions')
@UseGuards(JwtAuthGuard)
export class SessionController {
    constructor(private sessionService: SessionService) {}

    @Get()
    getSessions(@Req() req: Request) {
        const user = req.user as any
        return this.sessionService.getUserSessions(user.userId, user.sessionId)
    }

    @Delete('all')
    revokeOtherSessions(@Req() req: Request) {
        const user = req.user as any
        return this.sessionService.revokeAllOtherSessions(user.userId, user.sessionId)
    }

    @Delete(':id')
    revokeSession(@Req() req: Request, @Param('id') id: string) {
        const user = req.user as any
        return this.sessionService.revokeSession(user.userId, id)
    }
}
