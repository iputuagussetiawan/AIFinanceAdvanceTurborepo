import React from 'react'

export const SkillSkeleton = () => {
    return (
        <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="mb-2">
                    <div className="mb-1 h-2 w-24 animate-pulse rounded bg-gray-200" />
                    <div className="h-1.5 w-full animate-pulse rounded bg-gray-200" />
                </div>
            ))}
        </div>
    )
}

// Ensure you don't have multiple default exports in one project folder
export default SkillSkeleton
