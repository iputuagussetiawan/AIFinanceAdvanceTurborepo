import useAuth from '@/hooks/use-auth'
import CVSectionTitle from '../CVSectionTitle'
import SkillItem from './SkillItem'
import SkillSkeleton from './SkillSkeleton'
import type { IUserSkillResponse } from '@/features/jobseeker/jobseeker-skill/types/userskill-type'

const SkillListing = () => {
    const { data, isLoading } = useAuth()
    const skillList = data?.user.skills || []
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