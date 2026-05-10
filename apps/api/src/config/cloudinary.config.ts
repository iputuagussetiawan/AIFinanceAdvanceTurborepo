import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

import { getEnv } from '../utils/get-env'

cloudinary.config({
    cloud_name: getEnv('CLOUDINARY_CLOUD_NAME'),
    api_key: getEnv('CLOUDINARY_API_KEY'),
    api_secret: getEnv('CLOUDINARY_API_SECRET'),
})

const STORAGE_PARAMS = {
    folder: 'images',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    rescource_type: 'image' as const,
    quality: 'auto:good' as const,
}

const storage = new CloudinaryStorage({
    cloudinary,
    params: (req: any, file: any) => ({
        ...STORAGE_PARAMS,
    }),
})

export const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024, files: 1 },
    fileFilter: (_, file, cb) => {
        const isValid = /^image\/(jpe?g|png)$/.test(file.mimetype)
        if (!isValid) {
            return
        }

        cb(null, true)
    },
})
