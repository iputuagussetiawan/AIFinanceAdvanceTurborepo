'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

import { useLanguage } from '../hooks/use-language'
import type { ILanguage } from '../types/language-type'

interface LanguageSelectorProps {
    multiple?: boolean
    value?: string | string[]
    onChange?: (value: any) => void
}

export default function LanguageSelector({
    multiple = false,
    value,
    onChange,
}: LanguageSelectorProps) {
    const { languages, isLoading, isError } = useLanguage()
    const [open, setOpen] = React.useState(false)

    // Internal state jika tidak menggunakan value dari props
    const [internalValue, setInternalValue] = React.useState<string | string[]>(multiple ? [] : '')

    const activeValue = value !== undefined ? value : internalValue

    const handleSelect = (id: string) => {
        let newValue: string | string[]

        if (multiple) {
            const currentArray = Array.isArray(activeValue) ? activeValue : []
            newValue = currentArray.includes(id)
                ? currentArray.filter((item) => item !== id)
                : [...currentArray, id]
        } else {
            newValue = id === activeValue ? '' : id
            setOpen(false) // Tutup popover jika single select
        }

        if (onChange) {
            onChange(newValue)
        } else {
            setInternalValue(newValue)
        }
    }

    if (isLoading) return <div className="animate-pulse p-4 text-sm">Loading...</div>
    if (isError) return <div className="p-4 text-sm text-red-500">Error loading data</div>

    // Helper untuk mendapatkan label tombol
    const getButtonLabel = () => {
        if (multiple && Array.isArray(activeValue)) {
            return activeValue.length > 0 ? `${activeValue.length} dipilih` : 'Pilih Bahasa...'
        }
        const selected = languages.find((lang) => lang.id === activeValue)
        return selected ? selected.name : 'Pilih Bahasa...'
    }

    return (
        <div className="flex flex-col gap-3 p-4">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        className="w-full max-w-md justify-between"
                    >
                        {getButtonLabel()}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                    <Command>
                        <CommandInput placeholder="Cari bahasa..." />
                        <CommandList>
                            <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                            <CommandGroup>
                                {languages.map((lang: ILanguage) => {
                                    const isSelected = multiple
                                        ? Array.isArray(activeValue) &&
                                          activeValue.includes(lang.id)
                                        : activeValue === lang.id

                                    return (
                                        <CommandItem
                                            key={lang.id}
                                            value={lang.name}
                                            onSelect={() => handleSelect(lang.id)}
                                        >
                                            <Check
                                                className={cn(
                                                    'mr-2 h-4 w-4',
                                                    isSelected ? 'opacity-100' : 'opacity-0',
                                                )}
                                            />
                                            {lang.name}
                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {/* Tampilkan Badge hanya jika Mode Multiple */}
            {multiple && Array.isArray(activeValue) && activeValue.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                    {activeValue.map((id) => {
                        const language = languages.find((l) => l.id === id)
                        if (!language) return null

                        return (
                            <Badge
                                key={id}
                                variant="secondary"
                                className="flex items-center gap-1 px-2 py-1"
                            >
                                <span className="text-xs">{language.name}</span>
                                <button
                                    type="button" // Pastikan bukan submit jika di dalam form
                                    className="hover:bg-muted ml-1 rounded-full p-0.5 transition-colors outline-none hover:cursor-pointer"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation() // Mencegah event bubbling
                                        handleSelect(id) // Fungsi ini sudah otomatis memfilter/menghapus jika ID sudah ada
                                    }}
                                >
                                    <X className="text-muted-foreground hover:text-foreground h-3 w-3" />
                                    <span className="sr-only">Remove {language.name}</span>
                                </button>
                            </Badge>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
