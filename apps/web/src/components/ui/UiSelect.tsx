'use client'

import * as React from 'react'
import { AlertCircle, Check, ChevronsUpDown, Loader2, X } from 'lucide-react'

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
}

interface UiSelectBaseProps<T extends UiSelectItem> {
    items: T[]
    placeholder?: string
    searchPlaceholder?: string
    emptyMessage?: string
    isLoading?: boolean
    isError?: boolean
    disabled?: boolean
    className?: string
    unselectedLabel?: string
    onSearchChange?: (value: string) => void
    renderItem?: (item: T, isSelected: boolean) => React.ReactNode
    renderBadge?: (item: T) => React.ReactNode
    renderButtonLabel?: (selectedItems: T[]) => React.ReactNode
}

interface UiSelectSingleProps<T extends UiSelectItem> extends UiSelectBaseProps<T> {
    multiple?: false
    value?: string
    onChange?: (value: string) => void
}

interface UiSelectMultiProps<T extends UiSelectItem> extends UiSelectBaseProps<T> {
    multiple: true
    value?: string[]
    onChange?: (value: string[]) => void
}

export type UiSelectProps<T extends UiSelectItem> = UiSelectSingleProps<T> | UiSelectMultiProps<T>

// ─────────────────────────────────────────────
// Internal component (generic-safe)
// ─────────────────────────────────────────────

function UiSelectInner<T extends UiSelectItem>(
    props: UiSelectProps<T> & { forwardedRef?: React.Ref<HTMLButtonElement> },
) {
    const {
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
        disabled = false,
        className,
        unselectedLabel,
        renderItem,
        renderBadge,
        renderButtonLabel,
        forwardedRef,
    } = props

    const [open, setOpen] = React.useState(false)

    // ── Internal state (uncontrolled fallback) ──
    const [internalValue, setInternalValue] = React.useState<string | string[]>(multiple ? [] : '')

    // Reset internal state when `multiple` changes
    React.useEffect(() => {
        setInternalValue(multiple ? [] : '')
    }, [multiple])

    // ── Derived values ──
    const isControlled = value !== undefined
    const activeValue = isControlled ? value : internalValue

    const selectedIds: string[] = React.useMemo(() => {
        if (multiple) {
            return Array.isArray(activeValue) ? activeValue : []
        }
        return activeValue && typeof activeValue === 'string' ? [activeValue] : []
    }, [multiple, activeValue])

    const selectedItems = React.useMemo(
        () => items.filter((item) => selectedIds.includes(item.id)),
        [items, selectedIds],
    )

    const isSelected = React.useCallback((id: string) => selectedIds.includes(id), [selectedIds])

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
        [multiple, isControlled, onChange],
    )

    // ── Handlers ──
    const handleSelect = React.useCallback(
        (id: string) => {
            if (multiple) {
                const next = isSelected(id)
                    ? selectedIds.filter((i) => i !== id)
                    : [...selectedIds, id]
                commit(next)
            } else {
                commit(id === activeValue ? '' : id)
                setOpen(false)
            }
        },
        [multiple, isSelected, selectedIds, commit, activeValue],
    )

    const handleRemove = React.useCallback(
        (id: string, e: React.MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()
            // Guard: only valid in multiple mode
            if (!multiple) return
            commit(selectedIds.filter((i) => i !== id))
        },
        [multiple, selectedIds, commit],
    )

    const handleClearAll = React.useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()
            if (!multiple) return
            commit([])
        },
        [multiple, commit],
    )

    return (
        <div className={cn('flex flex-col gap-2', className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        ref={forwardedRef}
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        aria-haspopup="listbox"
                        disabled={disabled}
                        className="w-full justify-between font-normal"
                    >
                        <span className="truncate">{buttonLabel}</span>
                        <div className="ml-2 flex shrink-0 items-center gap-1">
                            {/* Clear all button for multi-select */}
                            {multiple && selectedIds.length > 0 && !disabled && (
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
                                    className="hover:bg-muted rounded-full p-0.5 opacity-50 transition-opacity hover:opacity-100"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </span>
                            )}
                            <ChevronsUpDown className="h-4 w-4 opacity-50" />
                        </div>
                    </Button>
                </PopoverTrigger>

                <PopoverContent
                    className="w-[var(--radix-popover-trigger-width)] p-0"
                    align="start"
                >
                    {/*
                     * Fix: use item.label as cmdk `value` for correct text-based filtering,
                     * and handle selection separately via onSelect → handleSelect(item.id).
                     * When `onSearchChange` is provided, disable internal filtering (shouldFilter=false).
                     */}
                    <Command shouldFilter={!onSearchChange}>
                        <CommandInput
                            placeholder={searchPlaceholder}
                            onValueChange={onSearchChange}
                        />
                        <CommandList>
                            {isLoading ? (
                                <div className="text-muted-foreground flex items-center justify-center gap-2 p-4 text-sm">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Loading...
                                </div>
                            ) : isError ? (
                                <div className="text-destructive flex items-center justify-center gap-2 p-4 text-sm">
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
                                                    // ✅ Use label as value so cmdk filters by readable text
                                                    value={item.label}
                                                    disabled={item.disabled}
                                                    onSelect={() =>
                                                        !item.disabled && handleSelect(item.id)
                                                    }
                                                    className={cn(
                                                        'cursor-pointer',
                                                        item.disabled &&
                                                            'cursor-not-allowed opacity-50',
                                                    )}
                                                    aria-selected={selected}
                                                >
                                                    <div className="flex w-full items-center justify-between gap-2">
                                                        <div className="flex flex-1 items-center gap-2 overflow-hidden">
                                                            {renderItem ? (
                                                                renderItem(item, selected)
                                                            ) : (
                                                                <span className="truncate">
                                                                    {item.label}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <Check
                                                            className={cn(
                                                                'h-4 w-4 shrink-0 transition-opacity',
                                                                selected
                                                                    ? 'opacity-100'
                                                                    : 'opacity-0',
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

            {/* Selected badges (multi-select only) */}
            {multiple && selectedItems.length > 0 && (
                <div className="flex flex-wrap gap-1.5" role="list" aria-label="Selected items">
                    {selectedItems.map((item) => (
                        <Badge
                            key={item.id}
                            variant="secondary"
                            className="flex items-center gap-1 px-2 py-1"
                            role="listitem"
                        >
                            {renderBadge ? (
                                renderBadge(item)
                            ) : (
                                <span className="text-xs">{item.label}</span>
                            )}
                            <button
                                type="button"
                                onClick={(e) => handleRemove(item.id, e)}
                                disabled={disabled}
                                className="hover:bg-muted ml-1 rounded-full p-0.5 transition-colors outline-none hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                                aria-label={`Remove ${item.label}`}
                            >
                                <X className="text-muted-foreground hover:text-foreground h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    )
}

// ─────────────────────────────────────────────
// forwardRef wrapper — preserves generic T
// ─────────────────────────────────────────────

type UiSelectComponent = <T extends UiSelectItem>(
    props: UiSelectProps<T> & { ref?: React.Ref<HTMLButtonElement> },
) => React.ReactElement | null

export const UiSelect = React.forwardRef(function UiSelect<T extends UiSelectItem>(
    props: UiSelectProps<T>,
    ref: React.Ref<HTMLButtonElement>,
) {
    return <UiSelectInner {...props} forwardedRef={ref} />
}) as UiSelectComponent
