import EducationListing from './educations/EducationListing'
import ExperienceListing from './experiences/ExperienceListing'
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
                <div>
                    <h2
                        className="mb-1 text-sm font-bold tracking-[0.2em] uppercase"
                        style={{ color: '#1a1a1a' }}
                    >
                        Language
                    </h2>
                    <div className="mb-4 h-px w-full" style={{ backgroundColor: '#d1d5db' }}></div>
                    <ul className="space-y-1">
                        <li
                            className="flex items-center gap-2 text-[9px]"
                            style={{ color: '#4b5563' }}
                        >
                            <span
                                className="h-1 w-1 rounded-full"
                                style={{ backgroundColor: '#1a1a1a' }}
                            ></span>{' '}
                            English (International)
                        </li>
                        <li
                            className="flex items-center gap-2 text-[9px]"
                            style={{ color: '#4b5563' }}
                        >
                            <span
                                className="h-1 w-1 rounded-full"
                                style={{ backgroundColor: '#1a1a1a' }}
                            ></span>{' '}
                            Spanish (Mother Language)
                        </li>
                        <li
                            className="flex items-center gap-2 text-[9px]"
                            style={{ color: '#4b5563' }}
                        >
                            <span
                                className="h-1 w-1 rounded-full"
                                style={{ backgroundColor: '#1a1a1a' }}
                            ></span>{' '}
                            France (Regulation)
                        </li>
                    </ul>
                </div>
            </aside>

            {/* RIGHT COLUMN: Experience */}
            <div className="flex-1 border-l pl-8" style={{ borderColor: '#d1d5db' }}>
                <ExperienceListing />
            </div>
        </section>
    )
}

export default ResumeExpOne
