"use client";

import type { IEducation } from '@/features/education/types/education-type';
import { cn } from '@/lib/utils';

interface EducationItemProps {
  edu: IEducation;
  className?: string;
}

const EducationItem = ({ edu, className }: EducationItemProps) => {
   const formatDate = (dateString: string) => {
        return new Date(dateString).getFullYear()
    }
    return (
        <div className={cn("mb-5 last:mb-0", className)}>
            <h3
                className="text-[10px] font-bold uppercase tracking-wide leading-tight"
                style={{ color: '#1a1a1a' }}
            >
                {edu.degree}
            </h3>
            <p className="text-[9px] mt-0.5 font-medium" style={{ color: '#4b5563' }}>
                {edu.institution?.name || edu.institutionName} 
                <span className="mx-1 text-gray-300">|</span> 
                {edu.fieldOfStudy}
            </p>
            <p className="text-[8px] font-medium mt-1" style={{ color: '#9ca3af' }}>
                {formatDate(edu.startDate)} — {edu.endDate ? formatDate(edu.endDate) : 'Present'}
            </p>
        </div>
    );
};

export default EducationItem;