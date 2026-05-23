import { useQuery } from '@tanstack/react-query'

import type { IEducation } from '@/features/jobseeker/jobseeker-education/types/education-type'
import { jobseekerService } from '@/features/jobseeker/services/jobseeker-service'

import CVSectionTitle from '../CVSectionTitle'
import EducationItem from './EducationItem'
import EducationSkeleton from './EducationSkeleton'

const EducationListing = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['jobseekerProfile'],
        queryFn: jobseekerService.getProfile,
    })
    const educationList: IEducation[] = (data?.profile as any)?.educations || []
    return (
        <div className="mb-10">
            <CVSectionTitle title="Education" />
            {isLoading ? (
                <EducationSkeleton />
            ) : educationList.length > 0 ? (
                educationList.map((edu: IEducation) => <EducationItem key={edu.id} edu={edu} />)
            ) : (
                <p className="text-[9px] text-gray-400 italic">No education history added.</p>
            )}
        </div>
    )
}

export default EducationListing
