"use client";

import type { IExperience } from "@/features/experience/types/experience-type";
import { cn } from "@/lib/utils";

interface ExperienceItemProps {
  experience: IExperience;
  className?: string;
}

const ExperienceItem = ({ experience, className }: ExperienceItemProps) => {
  return (
    <div className={cn("relative mb-8", className)}>
      <div
        className="absolute top-1 -left-[38.5px] h-3 w-3 rounded-full border-2 border-white z-10"
        style={{ backgroundColor: "#1a1a1a" }}
      ></div>
      <h3
        className="text-[11px] font-bold uppercase tracking-wider"
        style={{ color: "#1a1a1a" }}
      >
        {experience.title}
      </h3>
      <p className="mb-2 text-[9px] font-semibold" style={{ color: "#4b5563" }}>
        {experience.companyName} | {experience.location} | {experience.startDate} -{" "}
        {experience.isCurrent ? "Present" : experience.endDate}
      </p>
      <div
            className="tiptap-resume prose prose-sm prose-p:my-0 prose-li:pl-0 max-w-none text-justify text-[10px] leading-relaxed"
            style={{ color: '#4b5563' }}
            dangerouslySetInnerHTML={{ __html: experience.description || 'No description provided.' }}
        />
    </div>
  );
};

export default ExperienceItem;