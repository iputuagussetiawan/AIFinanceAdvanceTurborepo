import { Router } from 'express'

import { upload } from '../../config/cloudinary.config'
import { UserController } from './user.controller'

const userRoutes = Router()

userRoutes.get('/me', UserController.getCurrentUser)
userRoutes.patch('/profile', UserController.updateProfile)
userRoutes.patch('/photo', upload.single('profilePicture'), UserController.updatePhoto)

export default userRoutes
