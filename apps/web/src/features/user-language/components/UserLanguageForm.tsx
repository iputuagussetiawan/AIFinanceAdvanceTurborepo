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
import { Loader2, Plus, Save } from 'lucide-react'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import useAuth from '@/hooks/use-auth'
import {
    userLanguagesArrayValidation,
    type IBulkUserLanguages,
} from '../types/user-language-type'
import { SortableUserLanguageCard } from './SortableUserLanguageCard'
import { userLanguageService } from '../services/user-language-service'
import LanguageAutoSuggest from '@/features/language/components/LanguageAutoSuggest'

const PROFICIENCY_LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const

export default function UserLanguageForm() {
    const queryClient = useQueryClient()
    const { data: authData, isLoading: authLoading } = useAuth()

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    )

    const methods = useForm<IBulkUserLanguages>({
        resolver: zodResolver(userLanguagesArrayValidation as any),
        defaultValues: {
            languages: [],
        },
    })

    const { control, handleSubmit, setValue, reset, formState: { isSubmitting } } = methods

    const { fields, prepend, remove, move } = useFieldArray({
        control,
        name: 'languages',
    })

    // Sync data dari Auth ke Form
    React.useEffect(() => {
        if (authData?.user?.languages) {
            const formatted = [...authData.user.languages].map((l) => ({
                language: l.language?.id || '',
                name: l.language?.name || '',
                proficiency: {
                    speaking: l.proficiency?.speaking,
                    listening: l.proficiency?.listening,
                    writing: l.proficiency?.writing,
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
        mutate(data)
    }

    if (authLoading) return (
        <div className="p-10 text-center">
            <Loader2 className="animate-spin inline" />
        </div>
    )

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
                                proficiency: {
                                    speaking: undefined,
                                    listening: undefined,
                                    writing: undefined,
                                },
                            })
                        }
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add Language
                    </Button>
                </div>

                {/* Sortable List */}
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <SortableUserLanguageCard
                                    key={field.id}
                                    id={field.id}
                                    index={index}
                                    onRemove={() => remove(index)}
                                >
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-12 items-end">

                                        {/* Language Selection */}
                                        <div className="md:col-span-4">
                                            <LanguageAutoSuggest
                                                name={`languages.${index}.language`}
                                                label="Select Language"
                                            />
                                        </div>

                                        {/* Speaking */}
                                        <div className="md:col-span-3">
                                            <label className="text-xs font-medium mb-1.5 block">Speaking</label>
                                            <Select
                                                defaultValue={field.proficiency?.speaking}
                                                onValueChange={(val) =>
                                                    setValue(`languages.${index}.proficiency.speaking`, val as any)
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Speaking" />
                                                </SelectTrigger>
                                                <SelectContent className="z-99999">
                                                    {PROFICIENCY_LEVELS.map((l) => (
                                                        <SelectItem key={l} value={l}>{l}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Listening */}
                                        <div className="md:col-span-3">
                                            <label className="text-xs font-medium mb-1.5 block">Listening</label>
                                            <Select
                                                defaultValue={field.proficiency?.listening}
                                                onValueChange={(val) =>
                                                    setValue(`languages.${index}.proficiency.listening`, val as any)
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Listening" />
                                                </SelectTrigger>
                                                <SelectContent className="z-99999">
                                                    {PROFICIENCY_LEVELS.map((l) => (
                                                        <SelectItem key={l} value={l}>{l}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Writing */}
                                        <div className="md:col-span-2">
                                            <label className="text-xs font-medium mb-1.5 block">Writing</label>
                                            <Select
                                                defaultValue={field.proficiency?.writing}
                                                onValueChange={(val) =>
                                                    setValue(`languages.${index}.proficiency.writing`, val as any)
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Writing" />
                                                </SelectTrigger>
                                                <SelectContent className="z-99999">
                                                    {PROFICIENCY_LEVELS.map((l) => (
                                                        <SelectItem key={l} value={l}>{l}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                    </div>
                                </SortableUserLanguageCard>
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