import EducationListing from './educations/EducationListing'
import ExperienceListing from './experiences/ExperienceListing'

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
                <div className="mb-10">
                    <h2
                        className="mb-1 text-sm font-bold tracking-[0.2em] uppercase"
                        style={{ color: '#1a1a1a' }}
                    >
                        Skills
                    </h2>
                    <div className="mb-4 h-px w-full" style={{ backgroundColor: '#d1d5db' }}></div>

                    {[
                        { name: 'Photoshop', level: '85%' },
                        { name: 'Illustrator', level: '70%' },
                        { name: 'Indesign', level: '90%' },
                        { name: 'Powerpoint', level: '60%' },
                        { name: 'Ms Word', level: '95%' },
                        { name: 'After Effects', level: '50%' },
                    ].map((skill, i) => (
                        <div key={i} className="mb-2">
                            <div className="mb-1 flex items-center justify-between">
                                <span className="text-[9px]" style={{ color: '#4b5563' }}>
                                    {skill.name}
                                </span>
                            </div>
                            {/* Progress Bar Container */}
                            <div className="h-1.5 w-full" style={{ backgroundColor: '#e5e7eb' }}>
                                <div
                                    className="h-full"
                                    style={{
                                        width: skill.level,
                                        backgroundColor: '#374151',
                                    }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>

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
