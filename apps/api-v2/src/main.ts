import 'reflect-metadata'

import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import cookieParser from 'cookie-parser'

import { AppModule } from './app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { logger: ['log', 'error', 'warn'] })

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

    const swaggerConfig = new DocumentBuilder()
        .setTitle('AI Finance API v2')
        .setDescription('API documentation for AI Finance')
        .setVersion('2.0')
        .addCookieAuth('accessToken')
        .build()
    const document = SwaggerModule.createDocument(app, swaggerConfig)
    SwaggerModule.setup('docs', app, document)

    const port = process.env.PORT || 4001
    await app.listen(port)
    console.log(`api-v2 running on http://localhost:${port}/api`)
    console.log(`swagger docs  on http://localhost:${port}/docs`)
}

bootstrap()
