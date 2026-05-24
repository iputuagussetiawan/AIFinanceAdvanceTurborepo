'use client'

import { useState } from 'react'
import type { FieldError } from 'react-hook-form'

import { UiFormAutoSuggest } from '@/components/ui/UiFormAutoSuggest'

import { useCountry } from '../hooks/use-country'
import type { ICountry } from '../types/country-type'

interface CountryAutoSuggestProps {
    value: string
    error?: FieldError
    onValueChange: (val: string) => void
    onSelect: (val: ICountry) => void
}

export function CountryAutoSuggest({ value, error, onValueChange, onSelect }: CountryAutoSuggestProps) {
    const [search, setSearch] = useState('')
    const { countries } = useCountry(search)

    return (
        <UiFormAutoSuggest
            label="Country"
            placeholder="Search country..."
            items={countries}
            error={error}
            value={value}
            onValueChange={(val) => {
                setSearch(val)
                onValueChange(val)
            }}
            onSelect={(item) => onSelect(item)}
            getSearchValue={(item) => item.name}
            renderItem={(item) => (
                <div className="flex flex-col py-1">
                    <span className="text-sm font-medium">
                        {item.flag} {item.name}
                    </span>
                    <span className="text-muted-foreground text-[10px]">{item.code}</span>
                </div>
            )}
        />
    )
}
