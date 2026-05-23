import type { IEducation } from '@/features/jobseeker/jobseeker-education/types/education-type'
import useAuth from '@/hooks/use-auth'

import CVSectionTitle from '../CVSectionTitle'
import EducationItem from './EducationItem'
import EducationSkeleton from './EducationSkeleton'

const EducationListing = () => {
    const { data, isLoading } = useAuth()
    const educationList: IEducation[] = data?.user.educations || []
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
