// components/InstitutionAutoSuggest.tsx
'use client'

import type { FieldError } from 'react-hook-form'

import { useInstitution } from '@/features/institution/hooks/use-institution'
import { UiFormAutoSuggest } from '@/components/ui/UiFormAutoSuggest'

import type { IInstitution } from '../types/institution-type'

interface InstitutionAutoSuggestProps {
    value: string
    error?: FieldError
    onValueChange: (val: string) => void
    onSelect: (val: IInstitution) => void
}

export function InstitutionAutoSuggest({
    value,
    error,
    onValueChange,
    onSelect,
}: InstitutionAutoSuggestProps) {
    const { institutions } = useInstitution()

    return (
        <div>
            <UiFormAutoSuggest
                label="Nama Institusi"
                placeholder="Ketik nama institusi..."
                items={institutions}
                error={error}
                value={value}
                onValueChange={onValueChange}
                onSelect={(item) => onSelect(item)}
                getSearchValue={(item) => item.name}
                renderItem={(item) => (
                    <div className="flex flex-col py-1">
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-muted-foreground text-[10px]">{item.location}</span>
                    </div>
                )}
            />
        </div>
    )
}
