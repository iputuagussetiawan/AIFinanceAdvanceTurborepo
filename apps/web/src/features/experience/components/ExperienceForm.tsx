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
import { InstitutionAutoSuggest } from '@/features/institution/components/InstitutionAutoSuggest'
import { Button } from '@/components/ui/button'
import { UiFormInput } from '@/components/ui/UiFormInput'
import useAuth from '@/hooks/use-auth'
import { SortableExperienceCard } from './SortableExperienceCard'
import { updateExperienceListValidation, type ExperienceDTO, type IExperience } from '../types/experience-type'
import { experienceService } from '../services/experience-service'



export default function ExperienceForm() {
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
    const response: IExperience[] = data?.user.experiences || []


    const {
        watch,
        register,
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<{ experiences: ExperienceDTO[] }>({
        resolver: zodResolver(updateExperienceListValidation as any),
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
                    companyName: exp.companyName,
                    location: exp.location,
                    title: exp.title,
                    employmentType: exp.employmentType,
                    startDate: exp.startDate,
                    endDate: exp.endDate ?? undefined,
                    isCurrent: exp.isCurrent,
                    description: exp.description,
                    skills: exp.skills,
                    orderPosition: exp.orderPosition,
                }))
            reset({ experiences: formatted })
        }
    }, [response, reset])

    const { mutate, isPending } = useMutation({
        mutationFn: (experiences: ExperienceDTO[]) => experienceService.updateAll(experiences),
        onSuccess: () => {
            toast.success('Experience history updated')
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
                setValue(`experiences.${index}.orderPosition`, index)
            })
        }
    }

    const onSubmit = (data: { experiences: ExperienceDTO[] }) => {
        const orderedData = data.experiences.map((exp, index) => ({
            ...exp,
            orderPosition: index,
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
                            companyName: '',
                            location: '',
                            title: '',
                            employmentType: 'Full-time',
                            startDate: '',
                            endDate: '',
                            isCurrent: false,
                            description: '',
                            skills: [],
                            orderPosition: 0,
                        })
                    }
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Experience
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

                                {/* Row 1: Company Name + Job Title */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <InstitutionAutoSuggest
                                        value={watch(`experiences.${index}.companyName`)}
                                        error={errors.experiences?.[index]?.companyName}
                                        onValueChange={(val) => {
                                            setValue(`experiences.${index}.companyName`, val, {
                                                shouldValidate: true,
                                            })
                                        }}
                                        onSelect={(val) => {
                                            setValue(`experiences.${index}.companyName`, val.name, {
                                                shouldValidate: true,
                                            })
                                        }}
                                    />
                                    <UiFormInput
                                        label="Job Title"
                                        placeholder="e.g. Software Engineer"
                                        {...register(`experiences.${index}.title`)}
                                        error={errors.experiences?.[index]?.title}
                                    />
                                </div>

                                {/* Row 2: Employment Type + Location */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-medium">Employment Type</label>
                                        <select
                                            {...register(`experiences.${index}.employmentType`)}
                                            className="border-input bg-background rounded-md border px-3 py-2 text-sm"
                                        >
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Contract">Contract</option>
                                            <option value="Freelance">Freelance</option>
                                            <option value="Internship">Internship</option>
                                            <option value="Volunteer">Volunteer</option>
                                        </select>
                                        {errors.experiences?.[index]?.employmentType && (
                                            <p className="text-destructive text-xs">
                                                {errors.experiences[index].employmentType?.message}
                                            </p>
                                        )}
                                    </div>
                                    <UiFormInput
                                        label="Location"
                                        placeholder="e.g. New York, NY"
                                        {...register(`experiences.${index}.location`)}
                                        error={errors.experiences?.[index]?.location}
                                    />
                                </div>

                                {/* Row 3: Start Date + End Date + Is Current */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    <UiFormInput
                                        label="Start Date"
                                        type="date"
                                        {...register(`experiences.${index}.startDate`)}
                                        error={errors.experiences?.[index]?.startDate}
                                    />
                                    <UiFormInput
                                        label="End Date"
                                        type="date"
                                        disabled={watch(`experiences.${index}.isCurrent`)}
                                        {...register(`experiences.${index}.endDate`)}
                                        error={errors.experiences?.[index]?.endDate}
                                    />
                                    <div className="flex items-center gap-2 pt-6">
                                        <input
                                            id={`isCurrent-${index}`}
                                            type="checkbox"
                                            {...register(`experiences.${index}.isCurrent`)}
                                            className="h-4 w-4 rounded border"
                                        />
                                        <label
                                            htmlFor={`isCurrent-${index}`}
                                            className="text-sm font-medium"
                                        >
                                            I currently work here
                                        </label>
                                    </div>
                                </div>

                                {/* Row 4: Description */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium">Description</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Describe your responsibilities and achievements..."
                                        {...register(`experiences.${index}.description`)}
                                        className="border-input bg-background rounded-md border px-3 py-2 text-sm"
                                    />
                                    {errors.experiences?.[index]?.description && (
                                        <p className="text-destructive text-xs">
                                            {errors.experiences[index].description?.message}
                                        </p>
                                    )}
                                </div>

                                {/* Row 5: Skills */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium">Skills</label>
                                    <UiFormInput
                                        placeholder="e.g. React, TypeScript, Node.js (comma separated)"
                                        value={watch(`experiences.${index}.skills`)?.join(', ') ?? ''}
                                        onChange={(e) => {
                                            const raw = e.target.value
                                            const arr = raw
                                                .split(',')
                                                .map((s) => s.trim())
                                                .filter(Boolean)
                                            setValue(`experiences.${index}.skills`, arr, {
                                                shouldValidate: true,
                                            })
                                        }}
                                        error={errors.experiences?.[index]?.skills as any}
                                    />
                                </div>
                            </SortableExperienceCard>
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