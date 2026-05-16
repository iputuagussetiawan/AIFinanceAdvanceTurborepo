'use client'

import React, { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { UiFormSelect, type UiSelectItem } from '@/components/ui/UiFormSelect'
import { useDebounce } from '@/hooks/use-debounce'
import { useLanguageSearch } from '../hooks/use-language'

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface LanguageSelectItem extends UiSelectItem {
    imageUrl: string
}

interface LanguageAutoSuggestProps {
    name: string
    label?: string
    placeholder?: string
    isSubmitting?: boolean
    isMultiple?: boolean
}

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const FALLBACK_FLAG = '/images/flags/unknown.svg'

// ─────────────────────────────────────────────
// LanguageFlag — isolated so onError doesn't bubble
// ─────────────────────────────────────────────

const LanguageFlag = ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
    <img
        src={src || FALLBACK_FLAG}
        alt={alt}
        className={className}
        onError={(e) => {
            e.currentTarget.src = FALLBACK_FLAG
        }}
    />
)

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

const LanguageAutoSuggest = ({
    name,
    label = 'Language',
    placeholder = 'Select a language...',
    isSubmitting,
    isMultiple = false,
}: LanguageAutoSuggestProps) => {
    const { control } = useFormContext()
    const [searchTerm, setSearchTerm] = useState('')

    const debouncedSearch = useDebounce(searchTerm, 300)
    const { languages, isLoading, isFetching } = useLanguageSearch(debouncedSearch)

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={isMultiple ? [] : ''}
            render={({ field, fieldState }) => {
                const selectedValues: string[] = Array.isArray(field.value)
                    ? field.value
                    : field.value
                    ? [field.value]
                    : []

                const items: LanguageSelectItem[] = languages
                    .filter((lang) => lang.isActive)
                    .map((lang) => ({
                        id: lang.id,
                        label: lang.name,
                        imageUrl: lang.imageUrl ?? '',
                    }))

                return (
                    <UiFormSelect<LanguageSelectItem>
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
                        isLoading={isLoading || isFetching}
                        onSearchChange={setSearchTerm}
                        placeholder={placeholder}
                        searchPlaceholder="Search language (e.g. English, Japanese...)"
                        emptyMessage={
                            debouncedSearch
                                ? `Language "${debouncedSearch}" not found.`
                                : 'No languages found.'
                        }
                        // ── Dropdown row ──
                        renderItem={(lang, isSelected) => (
                            <div className="flex items-center gap-2">
                                <LanguageFlag
                                    src={lang.imageUrl}
                                    alt={lang.label}
                                    className={[
                                        'h-5 w-5 rounded-sm object-cover transition-all',
                                        isSelected
                                            ? 'grayscale-0'
                                            : 'grayscale group-hover:grayscale-0',
                                    ].join(' ')}
                                />
                                <span className="text-sm font-medium">{lang.label}</span>
                                {isSelected && (
                                    <span className="text-primary ml-auto text-xs">✓</span>
                                )}
                            </div>
                        )}
                        // ── Selected chip ──
                        renderBadge={(lang) => (
                            <div className="flex items-center gap-1">
                                <LanguageFlag
                                    src={lang.imageUrl}
                                    alt={lang.label}
                                    className="h-3 w-3 rounded-sm object-cover"
                                />
                                <span className="text-[10px]">{lang.label}</span>
                            </div>
                        )}
                        // ── Trigger label ──
                        renderButtonLabel={(selectedLangs) => {
                            if (selectedLangs.length === 0) return placeholder
                            if (selectedLangs.length === 1) return (
                                <div className="flex items-center gap-1.5">
                                    <LanguageFlag
                                        src={selectedLangs[0].imageUrl}
                                        alt={selectedLangs[0].label}
                                        className="h-4 w-4 rounded-sm object-cover"
                                    />
                                    <span>{selectedLangs[0].label}</span>
                                </div>
                            )
                            return (
                                <div className="flex items-center gap-1.5">
                                    {selectedLangs.slice(0, 3).map((lang) => (
                                        <LanguageFlag
                                            key={lang.id}
                                            src={lang.imageUrl}
                                            alt={lang.label}
                                            className="h-4 w-4 rounded-sm object-cover"
                                        />
                                    ))}
                                    {selectedLangs.length > 3 && (
                                        <span className="text-muted-foreground text-xs">
                                            +{selectedLangs.length - 3} more
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

export default LanguageAutoSuggest