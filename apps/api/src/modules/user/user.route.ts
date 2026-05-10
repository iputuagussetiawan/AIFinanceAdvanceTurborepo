import { Router } from 'express'

import { upload } from '../../config/cloudinary.config'
import { UserEducationController } from '../userEducation/user-education.controller'
import { UserExperienceController } from '../userExperiences/user-experience.controller'
import {
    bulkRemoveUserLanguages,
    bulkUpsertUserLanguages,
    removeUserLanguage,
    upsertUserLanguage,
} from '../userlanguage/user-language.controller'
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

userRoutes.put('/languages', upsertUserLanguage)
userRoutes.put('/languages/bulk', bulkUpsertUserLanguages)
userRoutes.delete('/languages/bulk', bulkRemoveUserLanguages)
userRoutes.delete('/languages/:languageId', removeUserLanguage)

userRoutes.put('/educations', UserEducationController.updateEducation)
userRoutes.put('/educations/bulk', UserEducationController.bulkUpdateEducation)
userRoutes.delete('/educations/bulk', UserEducationController.bulkRemoveEducation)
userRoutes.delete('/educations/:educationId', UserEducationController.removeEducation)

userRoutes.put('/experiences', UserExperienceController.updateExperience)
userRoutes.put('/experiences/bulk', UserExperienceController.bulkUpdateExperience)
userRoutes.delete('/experiences/bulk', UserExperienceController.bulkRemoveExperience)
userRoutes.delete('/experiences/:experienceId', UserExperienceController.removeExperience)

export default userRoutes
