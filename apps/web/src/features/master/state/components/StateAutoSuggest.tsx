'use client'

import { useState } from 'react'
import type { FieldError } from 'react-hook-form'

import { UiFormAutoSuggest } from '@/components/ui/UiFormAutoSuggest'

import { useStateSearch } from '../hooks/use-state'
import type { IState } from '../types/state-type'

interface StateAutoSuggestProps {
    value: string
    countryId?: string
    error?: FieldError
    onValueChange: (val: string) => void
    onSelect: (val: IState) => void
}

export function StateAutoSuggest({ value, countryId, error, onValueChange, onSelect }: StateAutoSuggestProps) {
    const [search, setSearch] = useState('')
    const { states } = useStateSearch(search, countryId)

    return (
        <UiFormAutoSuggest
            label="State / Province"
            placeholder="Search state..."
            items={states}
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
                    <span className="text-muted-foreground text-[10px]">{item.code}</span>
                </div>
            )}
        />
    )
}
