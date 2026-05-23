'use client'

import React from 'react'

import { useQuery } from '@tanstack/react-query'

import type { IExperience } from '@/features/jobseeker/jobseeker-experience/types/experience-type'
import { jobseekerService } from '@/features/jobseeker/services/jobseeker-service'

import CVSectionTitle from '../CVSectionTitle'
import ExperienceItem from './ExperienceItem'
import ExperienceSkeleton from './ExperienceSkeleton'

const ExperienceListing = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['jobseekerProfile'],
        queryFn: jobseekerService.getProfile,
    })
    const experienceList: IExperience[] = (data?.profile as any)?.experiences || []
    return (
        <div>
            <CVSectionTitle title="Experience" />
            {isLoading ? (
                <ExperienceSkeleton />
            ) : experienceList.length > 0 ? (
                experienceList.map((exp: any, i: number) => (
                    <ExperienceItem key={exp.id || exp._id?.toString() || i} experience={exp} />
                ))
            ) : (
                <p className="text-[9px] text-gray-400 italic">No experience history added.</p>
            )}
        </div>
    )
}

export default ExperienceListing
