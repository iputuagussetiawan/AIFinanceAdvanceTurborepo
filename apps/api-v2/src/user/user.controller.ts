import {
    Controller,
    Get,
    Patch,
    Body,
    Req,
    UseGuards,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Request } from 'express'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { UserService } from './user.service'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { ChangePasswordDto } from './dto/change-password.dto'

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private userService: UserService) {}

    @Get('me')
    getMe(@Req() req: Request) {
        const user = req.user as any
        return this.userService.getMe(user.userId, user.sessionId)
    }

    @Patch('profile')
    updateProfile(@Req() req: Request, @Body() dto: UpdateProfileDto) {
        const user = req.user as any
        return this.userService.updateProfile(user.userId, dto)
    }

    @Patch('password')
    changePassword(@Req() req: Request, @Body() dto: ChangePasswordDto) {
        const user = req.user as any
        return this.userService.changePassword(user.userId, dto)
    }

    @Patch('avatar')
    @UseInterceptors(FileInterceptor('avatar', { storage: undefined }))
    updateAvatar(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
        const user = req.user as any
        return this.userService.updateAvatar(user.userId, file)
    }
}
