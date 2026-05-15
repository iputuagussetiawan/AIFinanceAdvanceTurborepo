import type { IEducation } from '@/features/education/types/education-type'
import useAuth from '@/hooks/use-auth'
import EducationSkeleton from './EducationSkeleton'
import ResumeSectionTitle from '../ResumeSectionTitle'
import EducationItem from './EducationItem'

const EducationListing = () => {
    const { data, isLoading } = useAuth()
    const educationList: IEducation[] = data?.user.educations || []
    return (
        <div className="mb-10">
            <ResumeSectionTitle title="Education" />
            {isLoading ? (
                <EducationSkeleton />
            ) : educationList.length > 0 ? (
                educationList.map((edu: IEducation) => (
                    <EducationItem key={edu.id} edu={edu} />
                ))
            ) : (
                <p className="text-[9px] text-gray-400 italic">No education history added.</p>
            )}
        </div>
    )
}

export default EducationListing
