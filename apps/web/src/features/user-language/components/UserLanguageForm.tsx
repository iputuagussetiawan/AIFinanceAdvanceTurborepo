'use client'

import React from 'react'
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AlertCircle, Loader2, Plus, Save } from 'lucide-react'
import { Controller, FormProvider, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import useAuth from '@/hooks/use-auth'
import {
    JLPT_LEVELS,
    PROFICIENCY_LEVELS,
    userLanguagesArrayValidation,
    type IBulkUserLanguages,
} from '../types/user-language-type'
import { SortableUserLanguageCard } from './SortableUserLanguageCard'
import { userLanguageService } from '../services/user-language-service'
import LanguageAutoSuggest from '@/features/language/components/LanguageAutoSuggest'

// ─────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────

const checkIsJapanese = (name?: string): boolean => {
    if (!name) return false
    const lower = name.toLowerCase()
    return lower.includes('japanese') || lower.includes('japan') || lower === 'jp'
}

// ─────────────────────────────────────────────
// LanguageFormRow
// ─────────────────────────────────────────────

function LanguageFormRow({
    control,
    index,
    field,
    onRemove,
}: {
    control: any
    index: number
    field: any
    onRemove: () => void
}) {
    const languageName = useWatch({
        control,
        name: `languages.${index}.name`,
    })

    const isJapanese = checkIsJapanese(languageName)

    return (
        <SortableUserLanguageCard
            id={field.id}
            index={index}
            onRemove={onRemove}
        >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12 items-end">

                {/* Language Selection */}
                <div className={isJapanese ? 'md:col-span-10' : 'md:col-span-10'}>
                    <LanguageAutoSuggest
                        name={`languages.${index}.language`}
                        namePath={`languages.${index}.name`}
                        label="Select Language"
                    />
                    {/* Hidden name field */}
                    <Controller
                        control={control}
                        name={`languages.${index}.name`}
                        render={({ field }) => (
                            <input type="hidden" {...field} value={field.value ?? ''} />
                        )}
                    />
                </div>

                 {/* Is Current Language */}
                <div className={isJapanese ? 'md:col-span-1' : 'md:col-span-2'}>
                    <Controller
                        control={control}
                        name={`languages.${index}.isCurrentLanguage`}
                        render={({ field }) => (
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium">Current</label>
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={field.value ?? false}
                                        onCheckedChange={field.onChange}
                                    />
                                    <span className="text-muted-foreground text-xs">
                                        {field.value ? 'Yes' : 'No'}
                                    </span>
                                </div>
                            </div>
                        )}
                    />
                </div>

                {/* Speaking */}
                <div className="md:col-span-2">
                    <label className="text-xs font-medium mb-1.5 block">Speaking</label>
                    <Controller
                        control={control}
                        name={`languages.${index}.proficiency.speaking`}
                        render={({ field }) => (
                            <Select value={field.value ?? ''} onValueChange={field.onChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Speaking" />
                                </SelectTrigger>
                                <SelectContent className="z-99999">
                                    {PROFICIENCY_LEVELS.map((l) => (
                                        <SelectItem key={l} value={l}>{l}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                {/* Listening */}
                <div className="md:col-span-2">
                    <label className="text-xs font-medium mb-1.5 block">Listening</label>
                    <Controller
                        control={control}
                        name={`languages.${index}.proficiency.listening`}
                        render={({ field }) => (
                            <Select value={field.value ?? ''} onValueChange={field.onChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Listening" />
                                </SelectTrigger>
                                <SelectContent className="z-99999">
                                    {PROFICIENCY_LEVELS.map((l) => (
                                        <SelectItem key={l} value={l}>{l}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                {/* Writing */}
                <div className="md:col-span-2">
                    <label className="text-xs font-medium mb-1.5 block">Writing</label>
                    <Controller
                        control={control}
                        name={`languages.${index}.proficiency.writing`}
                        render={({ field }) => (
                            <Select value={field.value ?? ''} onValueChange={field.onChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Writing" />
                                </SelectTrigger>
                                <SelectContent className="z-99999">
                                    {PROFICIENCY_LEVELS.map((l) => (
                                        <SelectItem key={l} value={l}>{l}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                {/* JLPT Level — only shown for Japanese */}
                {isJapanese && (
                    <div className="md:col-span-2">
                        <label className="text-xs font-medium mb-1.5 block">JLPT Level</label>
                        <Controller
                            control={control}
                            name={`languages.${index}.proficiency.jlptLevel`}
                            render={({ field }) => (
                                <Select value={field.value ?? ''} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="JLPT" />
                                    </SelectTrigger>
                                    <SelectContent className="z-99999">
                                        {JLPT_LEVELS.map((l) => (
                                            <SelectItem key={l} value={l}>{l}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                )}

               

            </div>
        </SortableUserLanguageCard>
    )
}

// ─────────────────────────────────────────────
// UserLanguageForm
// ─────────────────────────────────────────────

export default function UserLanguageForm() {
    const queryClient = useQueryClient()
    const { data: authData, isLoading: authLoading } = useAuth()

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    )

    const methods = useForm<IBulkUserLanguages>({
        resolver: zodResolver(userLanguagesArrayValidation as any),
        defaultValues: { languages: [] },
    })

    const { control, handleSubmit, reset, formState: { isSubmitting, errors } } = methods

    const { fields, prepend, remove, move } = useFieldArray({
        control,
        name: 'languages',
    })

    React.useEffect(() => {
        if (authData?.user?.languages) {
            const formatted = [...authData.user.languages].map((l) => ({
                language: l.language?.id || '',
                name: l.language?.name || '',
                isCurrentLanguage: l.isCurrentLanguage ?? false,
                proficiency: {
                    speaking: l.proficiency?.speaking,
                    listening: l.proficiency?.listening,
                    writing: l.proficiency?.writing,
                    jlptLevel: l.proficiency?.jlptLevel,
                },
            }))
            reset({ languages: formatted })
        }
    }, [authData, reset])

    const { mutate, isPending } = useMutation({
        mutationFn: (data: IBulkUserLanguages) => userLanguageService.updateAll(data),
        onSuccess: () => {
            toast.success('Languages updated successfully')
            queryClient.invalidateQueries({ queryKey: ['authUser'] })
        },
        onError: () => {
            toast.error('Failed to update languages')
        },
    })

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (over && active.id !== over.id) {
            const oldIndex = fields.findIndex((f) => f.id === active.id)
            const newIndex = fields.findIndex((f) => f.id === over.id)
            move(oldIndex, newIndex)
        }
    }

    const onSubmit = (data: IBulkUserLanguages) => {
        const cleaned: IBulkUserLanguages = {
            languages: data.languages.map(({ name, ...lang }) => {
                return {
                    ...lang,
                    proficiency: {
                        ...lang.proficiency,
                        jlptLevel: checkIsJapanese(name) ? lang.proficiency.jlptLevel : undefined,
                    },
                }
            }),
        }
        mutate(cleaned)
    }

    if (authLoading) return (
        <div className="p-10 text-center">
            <Loader2 className="animate-spin inline" />
        </div>
    )

    const errorMessage = errors.languages?.root?.message ??
        (typeof errors.languages?.message === 'string' ? errors.languages.message : undefined)

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Header */}
                <div className="bg-background sticky top-0 z-20 flex items-center justify-between border-b pb-4">
                    <div>
                        <h2 className="text-2xl font-bold">Languages</h2>
                        <p className="text-muted-foreground text-sm">Drag to reorder your languages</p>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            prepend({
                                language: '',
                                name: '',
                                isCurrentLanguage: false,
                                proficiency: {
                                    speaking: undefined,
                                    listening: undefined,
                                    writing: undefined,
                                    jlptLevel: undefined,
                                },
                            })
                        }
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add Language
                    </Button>
                </div>

                {/* Array-level errors */}
                {errorMessage && (
                    <Alert className="border-destructive/50 bg-destructive/10">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        <AlertDescription className="text-destructive">
                            {errorMessage}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Sortable List */}
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <LanguageFormRow
                                    key={field.id}
                                    control={control}
                                    index={index}
                                    field={field}
                                    onRemove={() => remove(index)}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>

                {/* Footer */}
                <div className="bg-background sticky bottom-0 z-20 mt-auto flex justify-end border-t py-4">
                    <Button type="submit" disabled={isPending || isSubmitting} className="w-full md:w-auto">
                        {isPending
                            ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            : <Save className="mr-2 h-4 w-4" />
                        }
                        Save Languages
                    </Button>
                </div>
            </form>
        </FormProvider>
    )
}