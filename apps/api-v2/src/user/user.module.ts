import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { RoleModule } from '../role/role.module'
import { SessionModule } from '../session/session.module'

@Module({
    imports: [RoleModule, SessionModule],
    providers: [UserService],
    controllers: [UserController],
})
export class UserModule {}
