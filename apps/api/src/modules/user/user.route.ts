import { Router } from 'express'

import { upload } from '../../config/cloudinary.config'
import { UserController } from './user.controller'

const userRoutes = Router()

userRoutes.get('/current', UserController.getCurrentUser)
userRoutes.put('/update', upload.single('profilePicture'), UserController.updateUser)
userRoutes.put('/update-profile', UserController.updateUserProfile)
userRoutes.put('/update-photo', upload.single('profilePicture'), UserController.updateUserPhotoProfile)

export default userRoutes
