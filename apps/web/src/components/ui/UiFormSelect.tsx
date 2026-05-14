'use client'

import * as React from 'react'
import { forwardRef } from 'react'
import { type FieldError } from 'react-hook-form'
import { Check, ChevronsUpDown, X, Loader2, AlertCircle } from 'lucide-react'

import { Field, FieldLabel } from '@/components/ui/field'
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

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface UiSelectItem {
    id: string
    label: string
    disabled?: boolean
    [key: string]: unknown // allow extra fields like icon, category, etc.
}

interface UiFormSelectBaseProps<T extends UiSelectItem> {
    // ── Field meta ──
    label?: string
    error?: FieldError
    isSubmitting?: boolean

    // ── react-hook-form field spread ──
    // These come from {...field} via useController
    name?: string
    onBlur?: () => void

    // ── Select config ──
    id?: string
    items: T[]
    placeholder?: string
    searchPlaceholder?: string
    emptyMessage?: string
    isLoading?: boolean
    isError?: boolean
    className?: string
    unselectedLabel?: string
    onSearchChange?: (value: string) => void

    // ── Render overrides ──
    renderItem?: (item: T, isSelected: boolean) => React.ReactNode
    renderBadge?: (item: T) => React.ReactNode
    renderButtonLabel?: (selectedItems: T[]) => React.ReactNode
}

// Single select
interface UiFormSelectSingleProps<T extends UiSelectItem> extends UiFormSelectBaseProps<T> {
    multiple?: false
    value?: string
    onChange?: (value: string) => void
}

// Multi select
interface UiFormSelectMultiProps<T extends UiSelectItem> extends UiFormSelectBaseProps<T> {
    multiple: true
    value?: string[]
    onChange?: (value: string[]) => void
}

export type UiFormSelectProps<T extends UiSelectItem> =
    | UiFormSelectSingleProps<T>
    | UiFormSelectMultiProps<T>

// ─────────────────────────────────────────────
// Internal component (keeps generic T intact)
// ─────────────────────────────────────────────

function UiFormSelectInner<T extends UiSelectItem>(
    props: UiFormSelectProps<T> & { forwardedRef?: React.Ref<HTMLButtonElement> }
) {
    const {
        // Field meta
        label,
        error,
        isSubmitting,

        // RHF field spread passthrough
        name,
        onBlur,

        // Select config
        id,
        multiple = false,
        items = [],
        value,
        onChange,
        onSearchChange,
        placeholder = 'Select...',
        searchPlaceholder = 'Search...',
        emptyMessage = 'No results found.',
        isLoading = false,
        isError = false,
        className,
        unselectedLabel,

        // Render overrides
        renderItem,
        renderBadge,
        renderButtonLabel,

        forwardedRef,
    } = props

    const isInvalid = !!error
    const isDisabled = !!isSubmitting

    const [open, setOpen] = React.useState(false)

    // ── Internal state (uncontrolled fallback) ──
    const [internalValue, setInternalValue] = React.useState<string | string[]>(
        multiple ? [] : ''
    )

    // Reset when `multiple` changes
    React.useEffect(() => {
        setInternalValue(multiple ? [] : '')
    }, [multiple])

    // ── Derived values ──
    const isControlled = value !== undefined
    const activeValue = isControlled ? value : internalValue

    const selectedIds: string[] = React.useMemo(() => {
        if (multiple) return Array.isArray(activeValue) ? activeValue : []
        return activeValue && typeof activeValue === 'string' ? [activeValue] : []
    }, [multiple, activeValue])

    const selectedItems = React.useMemo(
        () => items.filter((item) => selectedIds.includes(item.id)),
        [items, selectedIds]
    )

    const isSelected = React.useCallback(
        (itemId: string) => selectedIds.includes(itemId),
        [selectedIds]
    )

    // ── Button label ──
    const buttonLabel = React.useMemo(() => {
        if (renderButtonLabel) return renderButtonLabel(selectedItems)
        if (multiple) {
            return selectedIds.length > 0
                ? `${selectedIds.length} selected`
                : (unselectedLabel ?? placeholder)
        }
        const found = items.find((item) => item.id === activeValue)
        return found ? found.label : (unselectedLabel ?? placeholder)
    }, [
        renderButtonLabel,
        multiple,
        selectedIds.length,
        activeValue,
        items,
        placeholder,
        unselectedLabel,
        selectedItems,
    ])

    // ── Commit changes ──
    const commit = React.useCallback(
        (next: string | string[]) => {
            if (multiple) {
                if (!isControlled) setInternalValue(next as string[])
                ;(onChange as ((v: string[]) => void) | undefined)?.(next as string[])
            } else {
                if (!isControlled) setInternalValue(next as string)
                ;(onChange as ((v: string) => void) | undefined)?.(next as string)
            }
        },
        [multiple, isControlled, onChange]
    )

    // ── Handlers ──
    const handleSelect = React.useCallback(
        (itemId: string) => {
            if (multiple) {
                const next = isSelected(itemId)
                    ? selectedIds.filter((i) => i !== itemId)
                    : [...selectedIds, itemId]
                commit(next)
            } else {
                commit(itemId === activeValue ? '' : itemId)
                setOpen(false)
            }
        },
        [multiple, isSelected, selectedIds, commit, activeValue]
    )

    const handleRemove = React.useCallback(
        (itemId: string, e: React.MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()
            if (!multiple) return
            commit(selectedIds.filter((i) => i !== itemId))
        },
        [multiple, selectedIds, commit]
    )

    const handleClearAll = React.useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()
            if (!multiple) return
            commit([])
        },
        [multiple, commit]
    )

    // Close popover → trigger RHF onBlur so field is marked as touched
    const handleOpenChange = React.useCallback(
        (next: boolean) => {
            setOpen(next)
            if (!next) onBlur?.()
        },
        [onBlur]
    )

    return (
        <Field>
            {/* ── Label ── */}
            {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}

            {/* ── Select trigger + badges ── */}
            <div className={cn('flex flex-col gap-2', className)}>
                <Popover open={open} onOpenChange={handleOpenChange}>
                    <PopoverTrigger asChild>
                        <Button
                            id={id}
                            ref={forwardedRef}
                            name={name}
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            aria-haspopup="listbox"
                            aria-invalid={isInvalid}
                            disabled={isDisabled}
                            className={cn(
                                'w-full justify-between font-normal',
                                isInvalid && 'border-destructive focus-visible:ring-destructive'
                            )}
                        >
                            <span className="truncate">{buttonLabel}</span>
                            <div className="ml-2 flex shrink-0 items-center gap-1">
                                {multiple && selectedIds.length > 0 && !isDisabled && (
                                    <span
                                        role="button"
                                        tabIndex={0}
                                        aria-label="Clear all selections"
                                        onClick={handleClearAll}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault()
                                                commit([])
                                            }
                                        }}
                                        className="rounded-full p-0.5 opacity-50 transition-opacity hover:opacity-100 hover:bg-muted"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </span>
                                )}
                                <ChevronsUpDown className="h-4 w-4 opacity-50" />
                            </div>
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent
                        className="w-[var(--radix-popover-trigger-width)] p-0  z-[9999]"
                        align="start"
                    >
                        <Command shouldFilter={!onSearchChange}>
                            <CommandInput
                                placeholder={searchPlaceholder}
                                onValueChange={onSearchChange}
                            />
                            <CommandList>
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-2 p-4 text-sm text-muted-foreground">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Loading...
                                    </div>
                                ) : isError ? (
                                    <div className="flex items-center justify-center gap-2 p-4 text-sm text-destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        Failed to load data.
                                    </div>
                                ) : (
                                    <>
                                        <CommandEmpty>{emptyMessage}</CommandEmpty>
                                        <CommandGroup>
                                            {items.map((item) => {
                                                const selected = isSelected(item.id)
                                                return (
                                                    <CommandItem
                                                        key={item.id}
                                                        value={item.label}
                                                        disabled={item.disabled}
                                                        onSelect={() =>
                                                            !item.disabled && handleSelect(item.id)
                                                        }
                                                        className={cn(
                                                            'cursor-pointer',
                                                            item.disabled && 'cursor-not-allowed opacity-50'
                                                        )}
                                                        aria-selected={selected}
                                                    >
                                                        <div className="flex w-full items-center justify-between gap-2">
                                                            <div className="flex flex-1 items-center gap-2 overflow-hidden">
                                                                {renderItem
                                                                    ? renderItem(item, selected)
                                                                    : <span className="truncate">{item.label}</span>
                                                                }
                                                            </div>
                                                            <Check
                                                                className={cn(
                                                                    'h-4 w-4 shrink-0 transition-opacity',
                                                                    selected ? 'opacity-100' : 'opacity-0'
                                                                )}
                                                            />
                                                        </div>
                                                    </CommandItem>
                                                )
                                            })}
                                        </CommandGroup>
                                    </>
                                )}
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>

                {/* ── Multi-select badges ── */}
                {multiple && selectedItems.length > 0 && (
                    <div
                        className="flex flex-wrap gap-1.5"
                        role="list"
                        aria-label="Selected items"
                    >
                        {selectedItems.map((item) => (
                            <Badge
                                key={item.id}
                                variant="secondary"
                                className="flex items-center gap-1 px-2 py-1"
                                role="listitem"
                            >
                                {renderBadge
                                    ? renderBadge(item)
                                    : <span className="text-xs">{item.label}</span>
                                }
                                <button
                                    type="button"
                                    onClick={(e) => handleRemove(item.id, e)}
                                    disabled={isDisabled}
                                    className="ml-1 rounded-full p-0.5 outline-none transition-colors hover:cursor-pointer hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                                    aria-label={`Remove ${item.label}`}
                                >
                                    <X className="text-muted-foreground hover:text-foreground h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Error message ── */}
            {error && (
                <span className="text-destructive mt-1 text-xs">{error.message}</span>
            )}
        </Field>
    )
}

// ─────────────────────────────────────────────
// forwardRef wrapper — preserves generic T
// ─────────────────────────────────────────────

type UiFormSelectComponent = <T extends UiSelectItem>(
    props: UiFormSelectProps<T> & { ref?: React.Ref<HTMLButtonElement> }
) => React.ReactElement | null

export const UiFormSelect = forwardRef(function UiFormSelect<T extends UiSelectItem>(
    props: UiFormSelectProps<T>,
    ref: React.Ref<HTMLButtonElement>
) {
    return <UiFormSelectInner {...props} forwardedRef={ref} />
}) as UiFormSelectComponent

UiFormSelect.displayName = 'UiFormSelect'
