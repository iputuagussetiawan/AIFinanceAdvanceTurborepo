import { Router } from 'express'

import { JobseekerEducationController } from './jobseeker-educations/jobseeker-education.controller'
import { JobseekerExperienceController } from './jobseeker-experiences/jobseeker-experience.controller'
import {
    bulkRemoveJobseekerLanguages,
    bulkUpsertJobseekerLanguages,
    removeJobseekerLanguage,
    upsertJobseekerLanguage,
} from './jobseeker-languages/jobseeker-language.controller'
import { JobseekerSkillController } from './jobseeker-skills/jobseeker-skill.controller'
import { getJobseekerProfileController, saveJobseekerProfileController } from './jobseeker.controller'

const jobseekerRoutes = Router()

jobseekerRoutes.get('/me', getJobseekerProfileController)
jobseekerRoutes.post('/save', saveJobseekerProfileController)

jobseekerRoutes.put('/languages', upsertJobseekerLanguage)
jobseekerRoutes.put('/languages/bulk', bulkUpsertJobseekerLanguages)
jobseekerRoutes.delete('/languages/bulk', bulkRemoveJobseekerLanguages)
jobseekerRoutes.delete('/languages/:languageId', removeJobseekerLanguage)

jobseekerRoutes.put('/educations', JobseekerEducationController.updateEducation)
jobseekerRoutes.put('/educations/bulk', JobseekerEducationController.bulkUpdateEducation)
jobseekerRoutes.delete('/educations/bulk', JobseekerEducationController.bulkRemoveEducation)
jobseekerRoutes.delete('/educations/:educationId', JobseekerEducationController.removeEducation)

jobseekerRoutes.put('/experiences', JobseekerExperienceController.updateExperience)
jobseekerRoutes.put('/experiences/bulk', JobseekerExperienceController.bulkUpdateExperience)
jobseekerRoutes.delete('/experiences/bulk', JobseekerExperienceController.bulkRemoveExperience)
jobseekerRoutes.delete('/experiences/:experienceId', JobseekerExperienceController.removeExperience)

jobseekerRoutes.put('/skills', JobseekerSkillController.upsertSkill)
jobseekerRoutes.put('/skills/bulk', JobseekerSkillController.bulkUpsertSkills)
jobseekerRoutes.delete('/skills/bulk', JobseekerSkillController.bulkRemoveSkills)
jobseekerRoutes.delete('/skills/:entryId', JobseekerSkillController.removeSkill)

export default jobseekerRoutes
