import { Router } from 'express'

import { upload } from '../../config/cloudinary.config'
import { UserController } from './user.controller'

const userRoutes = Router()

userRoutes.get('/me', UserController.getCurrentUser)
userRoutes.put('/profile', UserController.updateProfile)
userRoutes.put('/photo', upload.single('profilePicture'), UserController.updatePhoto)

export default userRoutes
