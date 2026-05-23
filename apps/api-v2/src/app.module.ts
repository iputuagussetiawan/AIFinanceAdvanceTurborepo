import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DatabaseModule } from './database/database.module'
import { MailModule } from './mail/mail.module'
import { AuthModule } from './auth/auth.module'
import { RoleModule } from './role/role.module'
import { PermissionModule } from './permission/permission.module'
import { UserModule } from './user/user.module'

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        DatabaseModule,
        MailModule,
        AuthModule,
        RoleModule,
        PermissionModule,
        UserModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
