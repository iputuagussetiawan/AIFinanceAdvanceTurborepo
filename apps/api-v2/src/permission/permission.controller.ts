import {
    Controller, Get, Post, Put, Delete,
    Body, Param, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { PermissionService } from './permission.service'
import { CreatePermissionDto } from './dto/create-permission.dto'

@Controller('permissions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class PermissionController {
    constructor(private permissionService: PermissionService) {}

    @Get()
    findAll() {
        return this.permissionService.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.permissionService.findById(id)
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() dto: CreatePermissionDto) {
        return this.permissionService.create(dto)
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: CreatePermissionDto) {
        return this.permissionService.update(id, dto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.permissionService.remove(id)
    }
}
