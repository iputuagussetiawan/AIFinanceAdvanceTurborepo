import React from 'react'
import { useAuthContext } from '@/providers/auth-provider'

import { Skeleton } from '@/components/ui/skeleton' // Assuming shadcn/ui skeleton
import { SKELETON_STYLE } from '@/lib/constants'

const ResumeAbout = () => {
    const { isLoading, user } = useAuthContext()

    if (isLoading) return <ResumeAboutSkeleton />

    return (
        <section
            className="relative mt-10 flex w-full gap-8 px-12"
            style={{ backgroundColor: '#ffffff' }}
        >
            {/* 1. Profile Picture Column */}
            <div className="relative w-1/3" style={{ minHeight: '140px' }}>
                {/* Gray Background Accent */}
                <div
                    className="absolute top-0 left-0 z-0 h-32 w-full"
                    style={{ backgroundColor: '#e5e7eb' }}
                />

                {/* The Circular Image Container */}
                <div className="relative z-10 mt-6 ml-13.75">
                    <div
                        className="overflow-hidden rounded-full border-2 border-white"
                        style={{
                            width: '128px',
                            height: '128px',
                            backgroundColor: '#d1d5db',
                        }}
                    >
                        <img
                            src={user?.profilePicture || '/images/users/default-avatar.png'}
                            alt={user?.name || 'Profile'}
                            crossOrigin="anonymous"
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>
            </div>

            {/* 2. Text Column */}
            <div className="flex-1 pt-4">
                {/* Title with underline */}
                <div className="mb-4 flex items-center gap-4">
                    <h2
                        className="text-sm font-bold tracking-wider whitespace-nowrap uppercase"
                        style={{ color: '#1a1a1a' }}
                    >
                        About Me
                    </h2>
                    <div className="h-px w-full" style={{ backgroundColor: '#d1d5db' }} />
                </div>

                {/* Quote Content */}
                <div className="flex gap-2">
                    {/* Quote Icon */}
                    <span
                        className="font-serif text-3xl leading-none"
                        style={{ color: '#1a1a1a', marginTop: '-4px' }}
                    >
                        “
                    </span>

                    {/* Bio Content */}
                    <div
                        className="tiptap-resume prose prose-sm prose-p:my-0 prose-li:pl-0 max-w-none text-justify text-[10px] leading-relaxed"
                        style={{ color: '#4b5563' }}
                        dangerouslySetInnerHTML={{ __html: user?.bio || 'No bio provided.' }}
                    />
                </div>
            </div>
        </section>
    )
}

/**
 * Skeleton State - Matches the exact layout dimensions
 */
const ResumeAboutSkeleton = () => {
    return (
        <section
            className="relative mt-10 flex w-full gap-8 px-12"
            style={{ backgroundColor: '#ffffff' }}
        >
            {/* 1. Profile Picture Column Skeleton */}
            <div className="relative w-1/3" style={{ minHeight: '140px' }}>
                {/* Match the gray background accent exactly */}
                <div
                    className={`absolute top-0 left-0 h-32 w-full ${SKELETON_STYLE}`}
                    style={{ backgroundColor: '#f3f4f6' }}
                />

                <div className="relative z-10 mt-6 ml-13.75">
                    <Skeleton
                        className={`h-32 w-32 rounded-full border-2 border-white shadow-sm ${SKELETON_STYLE}`}
                    />
                </div>
            </div>

            {/* 2. Text Column Skeleton */}
            <div className="flex-1 pt-4">
                {/* Title Section */}
                <div className="mb-4 flex items-center gap-4">
                    <Skeleton className={`h-4 w-24 ${SKELETON_STYLE}`} />
                    <div className="h-px flex-1 bg-gray-200" />
                </div>

                {/* Content Section */}
                <div className="flex gap-2">
                    {/* The Quote Mark Skeleton */}
                    <Skeleton className={`mt-1 h-4 w-4 rounded-sm ${SKELETON_STYLE}`} />

                    <div className="flex-1 space-y-3">
                        <Skeleton className={`h-3 w-full ${SKELETON_STYLE}`} />
                        <Skeleton className={`h-3 w-full ${SKELETON_STYLE}`} />
                        <Skeleton className={`h-3 w-full ${SKELETON_STYLE}`} />
                        <Skeleton className={`h-3 w-[85%] ${SKELETON_STYLE}`} />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ResumeAbout
