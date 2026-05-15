'use client'

import React, { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { UiFormSelect, type UiSelectItem } from '@/components/ui/UiFormSelect'
import { useDebounce } from '@/hooks/use-debounce'
import { useSkill } from '../hooks/use-skill'


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
    isMultiple?: boolean
}

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

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
// Component
// ─────────────────────────────────────────────

const SkillAutoSuggest = ({
    name,
    label = 'Keahlian / Skills',
    placeholder = 'Pilih keahlian...',
    maxItems,
    isSubmitting,
    isMultiple = true,
}: SkillAutoSuggestProps) => {
    const { control } = useFormContext()
    const [searchTerm, setSearchTerm] = useState('')

    // Debounce search before hitting the API
    const debouncedSearch = useDebounce(searchTerm, 300)

    // Real API data — keepPreviousData inside the hook prevents flicker between searches
    const { skills, isLoading, isFetching } = useSkill(debouncedSearch)

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={[]}
            render={({ field, fieldState }) => {
                const selectedValues: string[] = Array.isArray(field.value) ? field.value : []
                const isAtLimit = maxItems !== undefined && selectedValues.length >= maxItems

                // Map ISkill → SkillSelectItem, disable unselected items when limit is reached
                const items: SkillSelectItem[] = skills
                    .filter((skill) => skill.isActive) // only show active skills
                    .map((skill) => ({
                        id: skill.id,
                        label: skill.name,
                        icon: skill.icon,
                        category: skill.category,
                        disabled: isAtLimit && !selectedValues.includes(skill.id),
                    }))

                return (
                    <UiFormSelect<SkillSelectItem>
                        // ── RHF wiring ──
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
                        multiple={isMultiple}
                        items={items}
                        // isFetching covers search transitions, isLoading covers initial load
                        isLoading={isLoading || isFetching}
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