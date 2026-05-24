import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { RoleModule } from '../role/role.module'
import { CloudinaryModule } from '../cloudinary/cloudinary.module'

@Module({
    imports: [RoleModule, CloudinaryModule],
    providers: [UserService],
    controllers: [UserController],
})
export class UserModule {}
