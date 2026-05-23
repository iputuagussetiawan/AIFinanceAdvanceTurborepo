import { useQuery } from '@tanstack/react-query'

import { jobseekerService } from '@/features/jobseeker/services/jobseeker-service'
import CVSectionTitle from '../CVSectionTitle'
import LanguageItem from './LanguageItem'
import LanguageSkeleton from './LanguageSkeleton'

const LanguageListing = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['jobseekerProfile'],
        queryFn: jobseekerService.getProfile,
    })
    const languageList = (data?.profile as any)?.languages || []

    if (isLoading) return <LanguageSkeleton />

    if (!languageList.length) return null

    return (
        <div>
            <CVSectionTitle title="Languages" />
            <div className="space-y-1.5">
                {languageList.map((language) => (
                    <LanguageItem
                        key={language.id}
                        language={language}
                    />
                ))}
            </div>
        </div>
    )
}

export default LanguageListing