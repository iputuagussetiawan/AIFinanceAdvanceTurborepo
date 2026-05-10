import { Router } from 'express'

import {
    getJobseekerProfileController,
    saveJobseekerProfileController,
} from './jobseeker.controller'

const jobseekerRoutes = Router()

/**
 * @route   GET /api/jobseeker/me
 * @desc    Get current user's jobseeker profile
 */
jobseekerRoutes.get('/me', getJobseekerProfileController)

/**
 * @route   POST /api/jobseeker/update
 * @desc    Create or update jobseeker profile (Upsert)
 */
jobseekerRoutes.post('/save', saveJobseekerProfileController)

export default jobseekerRoutes
