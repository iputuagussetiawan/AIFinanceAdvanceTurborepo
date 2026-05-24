import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { RoleModule } from '../role/role.module'

@Module({
    imports: [RoleModule],
    providers: [UserService],
    controllers: [UserController],
})
export class UserModule {}
