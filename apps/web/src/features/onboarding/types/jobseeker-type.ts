import { z } from 'zod'

import { educationValidation } from '@/features/education/types/education-type'
import { experienceValidation } from '@/features/experience/types/experience-type'
import { jobseekerPersonalInfoValidation } from '@/features/jobseeker/types/jobseeker-type'

// Create a unified schema for the multi-step form
export const jobseekerValidation = jobseekerPersonalInfoValidation.extend({
    // We use arrays for the many-to-one relationships
    educations: z.array(educationValidation),
    experiences: z.array(experienceValidation),
})

// Extract the Form Type
export type JobseekerDTO = z.infer<typeof jobseekerValidation>
