'use client'

import React from 'react'
import { DateFormat } from '@/types/date'
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2, Plus, Save } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { educationService } from '@/features/education/services/education-service'
import {
    updateEducationListValidation,
    type EducationInputType,
    type IEducation,
} from '@/features/education/types/education-type'
import { InstitutionAutoSuggest } from '@/features/institution/components/InstitutionAutoSuggest'
import { Button } from '@/components/ui/button'
import { UiFormDatePicker } from '@/components/ui/UiFormDatePicker'
import { UiFormInput } from '@/components/ui/UiFormInput'
import useAuth from '@/hooks/use-auth'

import { SortableEducationCard } from '../SortableEducationCard'

export default function EducationForm() {
    const queryClient = useQueryClient()

    // 1. Sensors for Touch/Mouse/Keyboard support
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 }, // Prevents accidental drags when clicking inputs
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    )

    const { data, isLoading: isLoading } = useAuth()
    const response: IEducation[] = data?.user.educations || []
    const {
        watch,
        register,
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<{ educations: EducationInputType[] }>({
        resolver: zodResolver(updateEducationListValidation),
        defaultValues: { educations: [] },
    })

    const { fields, prepend, remove, move } = useFieldArray({
        control,
        name: 'educations',
    })

    React.useEffect(() => {
        if (response) {
            const formatted = [...response]
                .sort((a, b) => (a.orderPosition ?? 0) - (b.orderPosition ?? 0))
                .map((edu: IEducation) => ({
                    ...edu,
                    endDate: edu.endDate ?? undefined,
                    institution:
                        typeof edu.institution === 'object'
                            ? (edu.institution?._id ?? edu.institution?.id ?? '')
                            : (edu.institution ?? ''),
                }))
            reset({ educations: formatted })
        }
    }, [response, reset])

    const { mutate, isPending } = useMutation({
        mutationFn: (educations: EducationInputType[]) => educationService.updateAll(educations),
        onSuccess: () => {
            toast.success('Education history updated')
            queryClient.invalidateQueries({ queryKey: ['authUser'] })
        },
    })

    // 2. Handle Reordering
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = fields.findIndex((f) => f.id === active.id)
            const newIndex = fields.findIndex((f) => f.id === over.id)

            // Move the field visually
            move(oldIndex, newIndex)

            // Update orderPosition values
            const updatedFields = [...fields]
            const [movedItem] = updatedFields.splice(oldIndex, 1)
            updatedFields.splice(newIndex, 0, movedItem)

            updatedFields.forEach((_, index) => {
                setValue(`educations.${index}.orderPosition`, index)
            })
        }
    }

    const onSubmit = (data: { educations: EducationInputType[] }) => {
        const orderedData = data.educations.map((edu, index) => ({
            ...edu,
            orderPosition: index,
            institution: edu.institution || undefined,
        }))
        console.log('Submitting ordered educations:', orderedData)
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
            <div className="bg-background sticky top-0 z-20 flex items-center justify-between border-b pt-2 pb-4">
                <div>
                    <h2 className="text-2xl font-bold">Education</h2>
                    <p className="text-muted-foreground text-sm">Manage your academic history</p>
                </div>

                {/* <pre>{JSON.stringify(response, null, 2)}</pre> */}

                <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                        prepend({
                            institution: '',
                            institutionName: '',
                            degree: '',
                            fieldOfStudy: '', // Added missing field
                            startDate: '',
                            endDate: '', // Or '' depending on your schema
                            grade: '',
                            activities: '',
                            description: '',
                            orderPosition: 0, // Default position for new entries
                        })
                    }
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Education
                </Button>
            </div>

            {/* 3. DndContext Wrapper */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                {/* 4. SortableContext Wrapper */}
                <SortableContext
                    items={fields.map((f) => f.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-6">
                        {fields.map((field, index) => (
                            <SortableEducationCard
                                key={field.id}
                                id={field.id} // use field.id from useFieldArray
                                index={index}
                                onRemove={() => remove(index)}
                            >
                                <input
                                    type="hidden"
                                    {...register(`educations.${index}.orderPosition`)}
                                />
                                <input
                                    type="hidden"
                                    {...register(`educations.${index}.institution`)}
                                />
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <InstitutionAutoSuggest
                                        value={watch(`educations.${index}.institutionName`)}
                                        error={errors.educations?.[index]?.institutionName}
                                        onValueChange={(val) => {
                                            setValue(`educations.${index}.institutionName`, val, {
                                                shouldValidate: true,
                                            })

                                            setValue(`educations.${index}.institution`, '', {
                                                shouldValidate: true,
                                            })
                                        }}
                                        onSelect={(val) => {
                                            setValue(
                                                `educations.${index}.institutionName`,
                                                val.name,
                                                {
                                                    shouldValidate: true,
                                                },
                                            )
                                            setValue(`educations.${index}.institution`, val.id, {
                                                shouldValidate: true,
                                            })
                                        }}
                                    />
                                    <UiFormInput
                                        label="Degree"
                                        {...register(`educations.${index}.degree`)}
                                        error={errors.educations?.[index]?.degree}
                                    />
                                    <UiFormInput
                                        label="Field of Study"
                                        {...register(`educations.${index}.fieldOfStudy`)}
                                        error={errors.educations?.[index]?.fieldOfStudy}
                                    />
                                    <UiFormInput
                                        label="Grade / GPA"
                                        {...register(`educations.${index}.grade`)}
                                        error={errors.educations?.[index]?.grade}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <UiFormDatePicker
                                            label="Start Date"
                                            name={`educations.${index}.startDate`}
                                            control={control}
                                            displayFormat={DateFormat.FULL_DISPLAY} // User sees: 19 April 2026
                                            error={errors.educations?.[index]?.startDate}
                                        />

                                        <UiFormDatePicker
                                            label="End Date (Optional)"
                                            name={`educations.${index}.endDate`}
                                            control={control}
                                            displayFormat={DateFormat.FULL_DISPLAY} // User sees: 19 April 2026
                                            error={errors.educations?.[index]?.endDate}
                                        />
                                    </div>
                                    <UiFormInput
                                        label="Description"
                                        {...register(`educations.${index}.description`)}
                                        error={errors.educations?.[index]?.description}
                                    />
                                </div>
                            </SortableEducationCard>
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

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
