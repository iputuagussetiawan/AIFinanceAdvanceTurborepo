import EducationListing from './educations/EducationListing'
import ExperienceListing from './experiences/ExperienceListing'
import LanguageListing from './languages/LanguageListing'
import SkillListing from './skill/SkillListing'

const ResumeExpOne = () => {
    return (
        <section
            className="mt-8 flex w-full flex-1 px-12 pb-12"
            style={{ backgroundColor: '#ffffff' }}
        >
            {/* LEFT COLUMN: Education, Skills, Language */}
            <aside className="w-1/3 pr-8">
                {/* EDUCATION */}
                <EducationListing />

                {/* SKILLS */}
                <SkillListing/>

                {/* LANGUAGE */}
                <LanguageListing />
            </aside>

            {/* RIGHT COLUMN: Experience */}
            <div className="flex-1 border-l pl-8" style={{ borderColor: '#d1d5db' }}>
                <ExperienceListing />
            </div>
        </section>
    )
}

export default ResumeExpOne
