import { Controller, Get, Delete, Param, Req, UseGuards, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { Request } from 'express'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { SessionService } from './session.service'

@ApiTags('sessions')
@ApiBearerAuth('access-token')
@Controller('sessions')
@UseGuards(JwtAuthGuard)
export class SessionController {
    constructor(private sessionService: SessionService) {}

    @Get()
    @ApiOperation({ summary: 'List all active sessions with device info' })
    @ApiResponse({ status: 200, description: 'List of sessions' })
    getSessions(@Req() req: Request) {
        const user = req.user as any
        return this.sessionService.getSessions(user.userId, user.sessionId)
    }

    @Delete('others')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Revoke all sessions except current' })
    @ApiResponse({ status: 200, description: 'All other sessions revoked' })
    revokeOtherSessions(@Req() req: Request) {
        const user = req.user as any
        return this.sessionService.revokeOtherSessions(user.userId, user.sessionId)
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Revoke a specific session by ID' })
    @ApiResponse({ status: 200, description: 'Session revoked' })
    @ApiResponse({ status: 403, description: 'Cannot revoke current session' })
    @ApiResponse({ status: 404, description: 'Session not found' })
    revokeSession(@Req() req: Request, @Param('id') id: string) {
        const user = req.user as any
        return this.sessionService.revokeSession(user.userId, id, user.sessionId)
    }
}
