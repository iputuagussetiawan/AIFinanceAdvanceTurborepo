'use client'

import { useState } from 'react'
import type { FieldError } from 'react-hook-form'

import { UiFormAutoSuggest } from '@/components/ui/UiFormAutoSuggest'

import { useCitySearch } from '../hooks/use-city'
import type { ICity } from '../types/city-type'

interface CityAutoSuggestProps {
    value: string
    stateId?: string
    countryId?: string
    error?: FieldError
    onValueChange: (val: string) => void
    onSelect: (val: ICity) => void
}

export function CityAutoSuggest({ value, stateId, countryId, error, onValueChange, onSelect }: CityAutoSuggestProps) {
    const [search, setSearch] = useState('')
    const { cities } = useCitySearch(search, stateId, countryId)

    return (
        <UiFormAutoSuggest
            label="City"
            placeholder="Search city..."
            items={cities}
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
                    <span className="text-sm font-medium">{item.name}</span>
                </div>
            )}
        />
    )
}
