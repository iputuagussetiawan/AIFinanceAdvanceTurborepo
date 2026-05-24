// components/CompanyAutoSuggest.tsx
'use client'

import { useState } from 'react'
import type { FieldError } from 'react-hook-form'

import { useCompany } from '@/features/master/company/hooks/use-company'
import { UiFormAutoSuggest } from '@/components/ui/UiFormAutoSuggest'

import type { ICompany } from '../types/company-type'

interface CompanyAutoSuggestProps {
    value: string
    error?: FieldError
    onValueChange: (val: string) => void
    onSelect: (val: ICompany) => void
}

export function CompanyAutoSuggest({
    value,
    error,
    onValueChange,
    onSelect,
}: CompanyAutoSuggestProps) {
    const [search, setSearch] = useState('')
    const { companies } = useCompany(search)

    return (
        <UiFormAutoSuggest
            label="Company"
            placeholder="Search company..."
            items={companies}
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
                    <span className="text-muted-foreground text-[10px]">{item.industry}</span>
                </div>
            )}
        />
    )
}
