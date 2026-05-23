import { useQuery } from '@tanstack/react-query'

import { jobseekerService } from '@/features/jobseeker/services/jobseeker-service'
import type { IUserSkillResponse } from '@/features/jobseeker/jobseeker-skill/types/userskill-type'
import CVSectionTitle from '../CVSectionTitle'
import SkillItem from './SkillItem'
import SkillSkeleton from './SkillSkeleton'

const SkillListing = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['jobseekerProfile'],
        queryFn: jobseekerService.getProfile,
    })
    const skillList = (data?.profile as any)?.skills || []
    return (
        <div className="mb-10">
            {/* <pre className="text-[8px]">{JSON.stringify(skillList, null, 2)}</pre> */}
            <CVSectionTitle title="Skills" />
            {isLoading ? (
                <SkillSkeleton />
            ) : skillList.length > 0 ? (
                skillList.map((skill: IUserSkillResponse) => (
                    <SkillItem key={skill.id} skill={skill} />
                ))
            ) : (
                <p className="text-[9px] text-gray-400 italic">No skills added.</p>
            )}
        </div>
    )
}

export default SkillListing