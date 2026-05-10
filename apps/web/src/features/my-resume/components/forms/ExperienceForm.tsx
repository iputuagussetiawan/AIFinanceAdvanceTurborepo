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
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { UiFormInput } from '@/components/ui/UiFormInput'
import useAuth from '@/hooks/use-auth'

import { SortableExperienceCard } from '../SortableExperienceCard'

// ─── Static Types ─────────────────────────────────────────────────────────────

export interface IExperience {
    id: string
    company: string
    companyName: string
    orderPosition: number
}

export const experienceValidation = z.object({
    company: z.string().optional().or(z.literal('')),
    companyName: z.string().min(2, 'Company name must be at least 2 characters'),
    orderPosition: z.number().int(),
})

export const updateExperienceListValidation = z.object({
    experiences: z.array(experienceValidation),
})

export type ExperienceInputType = z.infer<typeof experienceValidation>

// ─── Component ────────────────────────────────────────────────────────────────

export default function ExperienceForm() {
    const queryClient = useQueryClient()

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    )

    const { data, isLoading } = useAuth()
    const response: IExperience[] = data?.user.experiences || []

    const {
        register,
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<{ experiences: ExperienceInputType[] }>({
        resolver: zodResolver(updateExperienceListValidation),
        defaultValues: { experiences: [] },
    })

    const { fields, prepend, remove, move } = useFieldArray({
        control,
        name: 'experiences',
    })

    React.useEffect(() => {
        if (response) {
            const formatted = [...response]
                .sort((a, b) => (a.orderPosition ?? 0) - (b.orderPosition ?? 0))
                .map((exp: IExperience) => ({
                    ...exp,
                    company:
                        typeof exp.company === 'object'
                            ? ((exp.company as any)?._id ?? (exp.company as any)?.id ?? '')
                            : (exp.company ?? ''),
                }))
            reset({ experiences: formatted })
        }
    }, [response, reset])

    const { mutate, isPending } = useMutation({
        mutationFn: (experiences: ExperienceInputType[]) => Promise.resolve(experiences), // TODO: replace with experienceService.updateAll(experiences)
        onSuccess: () => {
            toast.success('Experience updated')
            queryClient.invalidateQueries({ queryKey: ['authUser'] })
        },
    })

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const oldIndex = fields.findIndex((f) => f.id === active.id)
        const newIndex = fields.findIndex((f) => f.id === over.id)

        move(oldIndex, newIndex)

        const reordered = [...fields]
        const [moved] = reordered.splice(oldIndex, 1)
        reordered.splice(newIndex, 0, moved)
        reordered.forEach((_, i) => setValue(`experiences.${i}.orderPosition`, i))
    }

    const onSubmit = (data: { experiences: ExperienceInputType[] }) => {
        const orderedData = data.experiences.map((exp, index) => ({
            ...exp,
            orderPosition: index,
            company: exp.company || undefined,
        }))
        mutate(orderedData)
    }

    if (isLoading)
        return (
            <div className="p-10 text-center">
                <Loader2 className="animate-spin" />
            </div>
        )

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Header */}
            <div className="bg-background sticky top-0 z-20 flex items-center justify-between border-b pt-2 pb-4">
                <div>
                    <h2 className="text-2xl font-bold">Experience</h2>
                    <p className="text-muted-foreground text-sm">Manage your work history</p>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                        prepend({
                            company: '',
                            companyName: '',
                            orderPosition: 0,
                        })
                    }
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Experience
                </Button>
            </div>

            {/* Sortable List */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={fields.map((f) => f.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-6">
                        {fields.map((field, index) => (
                            <SortableExperienceCard
                                key={field.id}
                                id={field.id}
                                index={index}
                                onRemove={() => remove(index)}
                            >
                                <input
                                    type="hidden"
                                    {...register(`experiences.${index}.orderPosition`)}
                                />
                                <input
                                    type="hidden"
                                    {...register(`experiences.${index}.company`)}
                                />

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <UiFormInput
                                        label="Company Name"
                                        {...register(`experiences.${index}.companyName`)}
                                        error={errors.experiences?.[index]?.companyName}
                                    />
                                </div>
                            </SortableExperienceCard>
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {/* Footer */}
            <div className="bg-background sticky bottom-0 z-20 mt-auto flex justify-end border-t pt-4 pb-2">
                <Button type="submit" disabled={isPending} className="w-full px-8 md:w-auto">
                    {isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="mr-2 h-4 w-4" />
                    )}
                    Save Changes
                </Button>
            </div>
        </form>
    )
}
