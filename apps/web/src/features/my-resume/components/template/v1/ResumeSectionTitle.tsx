import { cn } from '@/lib/utils';
import React from 'react';

interface ResumeSectionTitleProps {
  title: string;
  icon?: React.ReactNode; // Untuk menambahkan icon di samping judul jika perlu
  className?: string;
}

const ResumeSectionTitle = ({ title, icon, className }: ResumeSectionTitleProps) => {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className="text-gray-700">{icon}</span>}
        <h2 
          className="text-sm font-bold tracking-[0.2em] uppercase text-[#1a1a1a]"
        >
          {title}
        </h2>
      </div>
      
      {/* Divider Line */}
      <div className="mb-6 h-px w-full bg-gray-300"></div>
    </div>
  );
};

export default ResumeSectionTitle;