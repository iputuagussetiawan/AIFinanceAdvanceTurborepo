import { Inject, Injectable } from '@nestjs/common'
import { UploadApiResponse, v2 as CloudinaryType } from 'cloudinary'
import { Readable } from 'stream'

import { CLOUDINARY } from './cloudinary.provider'
import { BadRequestException } from '../common/exceptions/app-error'

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

@Injectable()
export class UploadService {
    constructor(
        @Inject(CLOUDINARY) private cloudinary: typeof CloudinaryType,
    ) {}

    validateImage(file: Express.Multer.File) {
        if (!ALLOWED_MIME.includes(file.mimetype)) {
            throw new BadRequestException('Only JPEG, PNG, and WebP images are allowed')
        }
        if (file.size > MAX_SIZE_BYTES) {
            throw new BadRequestException('File size must not exceed 5MB')
        }
    }

    uploadStream(buffer: Buffer, folder: string): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
            const stream = this.cloudinary.uploader.upload_stream(
                { folder, resource_type: 'image', transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }] },
                (error, result) => {
                    if (error || !result) return reject(error ?? new Error('Upload failed'))
                    resolve(result)
                },
            )
            Readable.from(buffer).pipe(stream)
        })
    }

    async deleteByUrl(url: string) {
        const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/)
        if (!match) return
        await this.cloudinary.uploader.destroy(match[1])
    }
}
