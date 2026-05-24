import React from 'react'

import { Skeleton } from '@/components/ui/skeleton'

export const EducationSkeleton = () => {
    return (
        <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                    {/* Degree Title */}
                    <Skeleton className="h-2.5 w-35 bg-gray-200" />
                    {/* School | Field */}
                    <Skeleton className="h-2 w-45 bg-gray-100" />
                    {/* Dates */}
                    <Skeleton className="h-2 w-15 bg-gray-50" />
                </div>
            ))}
        </div>
    )
}

// Ensure you don't have multiple default exports in one project folder
export default EducationSkeleton
