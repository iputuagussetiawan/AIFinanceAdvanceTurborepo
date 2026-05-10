import EducationListing from './educations/EducationListing'

const ResumeExpOne = () => {
    return (
        <section
            className="mt-8 flex w-full flex-1 px-12 pb-12"
            style={{ backgroundColor: '#ffffff' }}
        >
            {/* LEFT COLUMN: Education, Skills, Language */}
            <div className="w-1/3 pr-8">
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
                            <div className="h-[6px] w-full" style={{ backgroundColor: '#e5e7eb' }}>
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
                    <div
                        className="mb-4 h-[1px] w-full"
                        style={{ backgroundColor: '#d1d5db' }}
                    ></div>
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
            </div>

            {/* RIGHT COLUMN: Experience */}
            <div className="flex-1 border-l pl-8" style={{ borderColor: '#d1d5db' }}>
                <h2
                    className="mb-1 text-sm font-bold tracking-[0.2em] uppercase"
                    style={{ color: '#1a1a1a' }}
                >
                    Experience
                </h2>
                <div className="mb-6 h-px w-full" style={{ backgroundColor: '#d1d5db' }}></div>

                {[
                    { title: 'Senior Graphic Designer', date: 'From 2017 Present' },
                    { title: 'Web Designer & Developer', date: 'From 2018 - 2019' },
                    { title: 'Senior UI/UX Designer', date: 'From 2020 - 2021' },
                ].map((job, i) => (
                    <div key={i} className="relative mb-8 pl-4">
                        {/* Timeline Dot */}
                        <div
                            className="absolute top-1 -left-[38.5px] h-3 w-3 rounded-full border-2 border-white"
                            style={{ backgroundColor: '#1a1a1a' }}
                        ></div>

                        <h3
                            className="text-[11px] font-bold uppercase"
                            style={{ color: '#1a1a1a' }}
                        >
                            {job.title}
                        </h3>
                        <p className="mb-2 text-[9px] font-medium" style={{ color: '#4b5563' }}>
                            Company Name | Location | {job.date}
                        </p>

                        <p
                            className="mb-3 text-justify text-[9px] leading-relaxed"
                            style={{ color: '#6b7280' }}
                        >
                            Lorem ipsum dolor sit amet. Consecte adipiscing elits. Vivamus vulputate
                            libero justo amet use elit. Vivamus vulputate dolor vulputate our libero
                            justo. sits user elit consec tetur. sits amet Lorem ipsum lorem ipsum
                            dolor sit amet.
                        </p>

                        <ul className="space-y-1">
                            {[1, 2, 3, 4].map((_, j) => (
                                <li
                                    key={j}
                                    className="flex items-start gap-2 text-[8.5px]"
                                    style={{ color: '#6b7280' }}
                                >
                                    <span
                                        className="mt-1 h-1 w-1 shrink-0 rounded-full"
                                        style={{ backgroundColor: '#9ca3af' }}
                                    ></span>
                                    sit use elits consecteture sit amet. Lorem ipsum dolor sit amet
                                    ipsum dolor sit
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default ResumeExpOne
