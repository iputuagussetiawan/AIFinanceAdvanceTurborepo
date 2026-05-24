import { Router } from 'express'

import { upload } from '../../config/cloudinary.config'
import { UserController } from './user.controller'

const userRoutes = Router()

userRoutes.get('/current', UserController.getCurrentUser)
userRoutes.put('/update-profile', UserController.updateProfile)
userRoutes.put('/update-photo', upload.single('profilePicture'), UserController.updatePhoto)

export default userRoutes
