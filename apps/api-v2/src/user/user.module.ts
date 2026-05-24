import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { RoleModule } from '../role/role.module'
import { SessionModule } from '../session/session.module'
import { UploadModule } from '../upload/upload.module'

@Module({
    imports: [RoleModule, SessionModule, UploadModule],
    providers: [UserService],
    controllers: [UserController],
})
export class UserModule {}
