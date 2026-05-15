'use client'

import React, { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { UiFormSelect, type UiSelectItem } from '@/components/ui/UiFormSelect'
import { useDebounce } from '@/hooks/use-debounce'

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface SkillSelectItem extends UiSelectItem {
    icon: string
    category: string
}

interface SkillAutoSuggestProps {
    name: string
    label?: string
    placeholder?: string
    maxItems?: number
    isSubmitting?: boolean
}

// ─────────────────────────────────────────────
// Dummy data
// ─────────────────────────────────────────────

const DUMMY_SKILLS: SkillSelectItem[] = [
    {
        id: 'react',
        label: 'React',
        icon: 'https://cdn.simpleicons.org/react',
        category: 'Frontend',
    },
    {
        id: 'nextjs',
        label: 'Next.js',
        icon: 'https://cdn.simpleicons.org/nextdotjs',
        category: 'Frontend',
    },
    {
        id: 'typescript',
        label: 'TypeScript',
        icon: 'https://cdn.simpleicons.org/typescript',
        category: 'Language',
    },
    {
        id: 'javascript',
        label: 'JavaScript',
        icon: 'https://cdn.simpleicons.org/javascript',
        category: 'Language',
    },
    {
        id: 'tailwind',
        label: 'Tailwind CSS',
        icon: 'https://cdn.simpleicons.org/tailwindcss',
        category: 'Frontend',
    },
    {
        id: 'nodejs',
        label: 'Node.js',
        icon: 'https://cdn.simpleicons.org/nodedotjs',
        category: 'Backend',
    },
    {
        id: 'express',
        label: 'Express',
        icon: 'https://cdn.simpleicons.org/express',
        category: 'Backend',
    },
    {
        id: 'nestjs',
        label: 'NestJS',
        icon: 'https://cdn.simpleicons.org/nestjs',
        category: 'Backend',
    },
    {
        id: 'postgresql',
        label: 'PostgreSQL',
        icon: 'https://cdn.simpleicons.org/postgresql',
        category: 'Database',
    },
    {
        id: 'mongodb',
        label: 'MongoDB',
        icon: 'https://cdn.simpleicons.org/mongodb',
        category: 'Database',
    },
    {
        id: 'redis',
        label: 'Redis',
        icon: 'https://cdn.simpleicons.org/redis',
        category: 'Database',
    },
    {
        id: 'docker',
        label: 'Docker',
        icon: 'https://cdn.simpleicons.org/docker',
        category: 'DevOps',
    },
    {
        id: 'aws',
        label: 'AWS',
        icon: 'https://cdn.simpleicons.org/amazonwebservices',
        category: 'DevOps',
    },
    {
        id: 'github',
        label: 'GitHub Actions',
        icon: 'https://cdn.simpleicons.org/githubactions',
        category: 'DevOps',
    },
    { id: 'figma', label: 'Figma', icon: 'https://cdn.simpleicons.org/figma', category: 'Design' },
    {
        id: 'graphql',
        label: 'GraphQL',
        icon: 'https://cdn.simpleicons.org/graphql',
        category: 'Backend',
    },
    {
        id: 'prisma',
        label: 'Prisma',
        icon: 'https://cdn.simpleicons.org/prisma',
        category: 'Backend',
    },
    {
        id: 'vue',
        label: 'Vue.js',
        icon: 'https://cdn.simpleicons.org/vuedotjs',
        category: 'Frontend',
    },
    {
        id: 'python',
        label: 'Python',
        icon: 'https://cdn.simpleicons.org/python',
        category: 'Language',
    },
    { id: 'go', label: 'Go', icon: 'https://cdn.simpleicons.org/go', category: 'Language' },
]

const FALLBACK_ICON = '/placeholder-skill.png'

// ─────────────────────────────────────────────
// SkillIcon — isolated so onError doesn't bubble
// ─────────────────────────────────────────────

const SkillIcon = ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
    <img
        src={src}
        alt={alt}
        className={className}
        onError={(e) => {
            e.currentTarget.src = FALLBACK_ICON
        }}
    />
)

// ─────────────────────────────────────────────
// Filter dummy data by search term
// ─────────────────────────────────────────────

function filterSkills(skills: SkillSelectItem[], query: string): SkillSelectItem[] {
    if (!query.trim()) return skills
    const q = query.toLowerCase()
    return skills.filter(
        (s) => s.label.toLowerCase().includes(q) || s.category.toLowerCase().includes(q),
    )
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

const SkillAutoSuggest = ({
    name,
    label = 'Keahlian / Skills',
    placeholder = 'Pilih keahlian...',
    maxItems,
    isSubmitting,
}: SkillAutoSuggestProps) => {
    const { control } = useFormContext()
    const [searchTerm, setSearchTerm] = useState('')

    // Debounce search — replace filterSkills with your API hook when ready
    const debouncedSearch = useDebounce(searchTerm, 300)
    const isLoading = false // swap with real isLoading from your hook
    const filteredSkills = filterSkills(DUMMY_SKILLS, debouncedSearch)

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={[]}
            render={({ field, fieldState }) => {
                const selectedValues: string[] = Array.isArray(field.value) ? field.value : []
                const isAtLimit = maxItems !== undefined && selectedValues.length >= maxItems

                // Disable unselected items when limit is reached
                const items: SkillSelectItem[] = filteredSkills.map((skill) => ({
                    ...skill,
                    disabled: isAtLimit && !selectedValues.includes(skill.id),
                }))

                return (
                    <UiFormSelect<SkillSelectItem>
                        // ── RHF wiring (explicit — no spread so types are tight) ──
                        id={name}
                        ref={field.ref}
                        name={field.name}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        // ── Field meta ──
                        label={label}
                        error={fieldState.error}
                        isSubmitting={isSubmitting}
                        // ── Select config ──
                        multiple
                        items={items}
                        isLoading={isLoading}
                        onSearchChange={setSearchTerm}
                        placeholder={placeholder}
                        searchPlaceholder="Cari skill (misal: React, AWS...)"
                        emptyMessage={
                            debouncedSearch
                                ? `Skill "${debouncedSearch}" tidak ditemukan.`
                                : 'Skill tidak ditemukan.'
                        }
                        // ── Dropdown row ──
                        renderItem={(skill, isSelected) => (
                            <div className="flex items-center gap-2">
                                <SkillIcon
                                    src={skill.icon}
                                    alt={skill.label}
                                    className={[
                                        'h-5 w-5 object-contain transition-all',
                                        isSelected
                                            ? 'grayscale-0'
                                            : 'grayscale group-hover:grayscale-0',
                                    ].join(' ')}
                                />
                                <div className="flex flex-col text-left">
                                    <span className="text-sm font-medium">{skill.label}</span>
                                    <span className="text-muted-foreground text-[10px]">
                                        {skill.category}
                                    </span>
                                </div>
                                {isAtLimit && !isSelected && (
                                    <span className="text-muted-foreground ml-auto text-[10px]">
                                        Max {maxItems}
                                    </span>
                                )}
                            </div>
                        )}
                        // ── Selected chip ──
                        renderBadge={(skill) => (
                            <div className="flex items-center gap-1">
                                <SkillIcon
                                    src={skill.icon}
                                    alt={skill.label}
                                    className="h-3 w-3 object-contain"
                                />
                                <span className="text-[10px]">{skill.label}</span>
                            </div>
                        )}
                        // ── Trigger label ──
                        renderButtonLabel={(selectedSkills) => {
                            if (selectedSkills.length === 0) return placeholder
                            if (selectedSkills.length === 1) return selectedSkills[0].label
                            return (
                                <div className="flex items-center gap-1.5">
                                    {selectedSkills.slice(0, 3).map((skill) => (
                                        <SkillIcon
                                            key={skill.id}
                                            src={skill.icon}
                                            alt={skill.label}
                                            className="h-4 w-4 object-contain"
                                        />
                                    ))}
                                    {selectedSkills.length > 3 && (
                                        <span className="text-muted-foreground text-xs">
                                            +{selectedSkills.length - 3} lainnya
                                        </span>
                                    )}
                                </div>
                            )
                        }}
                    />
                )
            }}
        />
    )
}

export default SkillAutoSuggest
