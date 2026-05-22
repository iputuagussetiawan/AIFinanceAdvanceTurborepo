import { Router } from 'express'

import { upload } from '../../config/cloudinary.config'
import {
    getCurrentUserController,
    updateUserController,
    updateUserPhotoProfileController,
    updateUserProfileController,
} from './user.controller'

const userRoutes = Router()

userRoutes.get('/current', getCurrentUserController)
userRoutes.put('/update', upload.single('profilePicture'), updateUserController)
userRoutes.put('/update-profile', updateUserProfileController)
userRoutes.put('/update-photo', upload.single('profilePicture'), updateUserPhotoProfileController)

export default userRoutes
