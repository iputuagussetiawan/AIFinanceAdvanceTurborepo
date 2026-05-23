import {
    Controller, Get, Post, Put, Delete,
    Body, Param, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { RoleService } from './role.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { AssignPermissionsDto } from './dto/assign-permissions.dto'
import { AssignRoleDto } from './dto/assign-role.dto'

@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoleController {
    constructor(private roleService: RoleService) {}

    @Get()
    @Roles('admin')
    findAll() {
        return this.roleService.findAll()
    }

    @Get(':id')
    @Roles('admin')
    findOne(@Param('id') id: string) {
        return this.roleService.findById(id)
    }

    @Get(':id/permissions')
    @Roles('admin')
    getRolePermissions(@Param('id') id: string) {
        return this.roleService.getRolePermissions(id)
    }

    @Post()
    @Roles('admin')
    @HttpCode(HttpStatus.CREATED)
    create(@Body() dto: CreateRoleDto) {
        return this.roleService.create(dto)
    }

    @Put(':id')
    @Roles('admin')
    update(@Param('id') id: string, @Body() dto: CreateRoleDto) {
        return this.roleService.update(id, dto)
    }

    @Delete(':id')
    @Roles('admin')
    remove(@Param('id') id: string) {
        return this.roleService.remove(id)
    }

    @Post(':id/permissions')
    @Roles('admin')
    @HttpCode(HttpStatus.OK)
    assignPermissions(@Param('id') id: string, @Body() dto: AssignPermissionsDto) {
        return this.roleService.assignPermissions(id, dto.permissionIds)
    }

    @Post('users/:userId/assign')
    @Roles('admin')
    @HttpCode(HttpStatus.OK)
    assignRoleToUser(@Param('userId') userId: string, @Body() dto: AssignRoleDto) {
        return this.roleService.assignRoleToUser(userId, dto.roleId)
    }

    @Delete('users/:userId/role')
    @Roles('admin')
    removeRoleFromUser(@Param('userId') userId: string) {
        return this.roleService.removeRoleFromUser(userId)
    }

    @Get('users/:userId')
    @Roles('admin')
    getUserRoles(@Param('userId') userId: string) {
        return this.roleService.getUserRoles(userId)
    }
}
