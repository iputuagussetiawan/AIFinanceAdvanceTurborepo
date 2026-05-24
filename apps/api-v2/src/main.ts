import 'reflect-metadata'

import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
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

    const config = new DocumentBuilder()
        .setTitle('AI Finance API v2')
        .setDescription('REST API for AI Finance application')
        .setVersion('2.0')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
        .addCookieAuth('accessToken')
        .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: { persistAuthorization: true },
    })

    const port = process.env.PORT || 4001
    await app.listen(port)
    console.log(`api-v2 running on http://localhost:${port}/api`)
    console.log(`Swagger docs: http://localhost:${port}/api/docs`)
}

bootstrap()
