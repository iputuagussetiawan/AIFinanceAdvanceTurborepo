import 'reflect-metadata'

import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import cookieParser from 'cookie-parser'

import { AppModule } from './app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    app.setGlobalPrefix('api')
    app.use(cookieParser())

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    )

    app.enableCors({
        origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
        credentials: true,
    })

    const port = process.env.PORT || 4001
    await app.listen(port)
    console.log(`api-v2 running on http://localhost:${port}/api`)
}

bootstrap()
