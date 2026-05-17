import useAuth from '@/hooks/use-auth'
import ResumeSectionTitle from '../ResumeSectionTitle'
import LanguageItem from './LanguageItem'
import LanguageSkeleton from './LanguageSkeleton'

const LanguageListing = () => {
    const { data, isLoading } = useAuth()
    const languageList = data?.user?.languages || []

    if (isLoading) return <LanguageSkeleton />

    if (!languageList.length) return null

    return (
        <div>
            <ResumeSectionTitle title="Languages" />
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