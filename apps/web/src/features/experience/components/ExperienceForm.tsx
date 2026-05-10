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
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, Plus, Save } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { UiFormDatePicker } from '@/components/ui/UiFormDatePicker'
import { UiFormInput } from '@/components/ui/UiFormInput'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import useAuth from '@/hooks/use-auth'
import { SortableExperienceCard } from './SortableExperienceCard'
import {
    updateExperienceListValidation,
    type ExperienceDTO,
    type IExperience,
} from '../types/experience-type'
import { experienceService } from '../services/experience-service'
import { CompanyAutoSuggest } from '@/features/company/components/CompanyAutoSuggest'

const EMPLOYMENT_TYPES = [
    'Full-time',
    'Part-time',
    'Contract',
    'Freelance',
    'Internship',
    'Volunteer',
] as const

export default function ExperienceForm() {
    const queryClient = useQueryClient()

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    )

    const { data, isLoading } = useAuth()
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

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = fields.findIndex((f) => f.id === active.id)
            const newIndex = fields.findIndex((f) => f.id === over.id)

            move(oldIndex, newIndex)

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

            {/* Sortable list */}
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

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* Company Name */}
                                    <CompanyAutoSuggest
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
                                    

                                    

                                    {/* Job Title */}
                                    <UiFormInput
                                        label="Job Title"
                                        placeholder="e.g. Software Engineer"
                                        {...register(`experiences.${index}.title`)}
                                        error={errors.experiences?.[index]?.title}
                                    />

                                    {/* Employment Type */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-medium">
                                            Employment Type
                                        </label>
                                        <Select
                                            value={watch(`experiences.${index}.employmentType`)}
                                            onValueChange={(val) =>
                                                setValue(
                                                    `experiences.${index}.employmentType`,
                                                    val,
                                                    { shouldValidate: true },
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent  className="z-[9999]">
                                                {EMPLOYMENT_TYPES.map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {type}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.experiences?.[index]?.employmentType && (
                                            <p className="text-destructive text-xs">
                                                {errors.experiences[index].employmentType?.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Location */}
                                    <UiFormInput
                                        label="Location"
                                        placeholder="e.g. New York, NY"
                                        {...register(`experiences.${index}.location`)}
                                        error={errors.experiences?.[index]?.location}
                                    />

                                    {/* Start Date + End Date */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <UiFormDatePicker
                                            label="Start Date"
                                            name={`experiences.${index}.startDate`}
                                            control={control as any}
                                            displayFormat={DateFormat.FULL_DISPLAY}
                                            error={errors.experiences?.[index]?.startDate}
                                        />
                                        <UiFormDatePicker
                                            label="End Date (Optional)"
                                            name={`experiences.${index}.endDate`}
                                            control={control as any}
                                            displayFormat={DateFormat.FULL_DISPLAY}
                                            error={errors.experiences?.[index]?.endDate}
                                        />
                                    </div>

                                    {/* Is Current — spans full width */}
                                    <div className="flex items-center gap-2 md:col-span-2">
                                        <Checkbox
                                            id={`isCurrent-${index}`}
                                            checked={watch(`experiences.${index}.isCurrent`) ?? false}
                                            onCheckedChange={(checked) => {
                                                setValue(
                                                    `experiences.${index}.isCurrent`,
                                                    !!checked,
                                                    { shouldValidate: true },
                                                )
                                                if (checked) {
                                                    setValue(
                                                        `experiences.${index}.endDate`,
                                                        '',
                                                        { shouldValidate: true },
                                                    )
                                                }
                                            }}
                                        />
                                        <label
                                            htmlFor={`isCurrent-${index}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            I currently work here
                                        </label>
                                    </div>

                                    {/* Description — spans full width */}
                                    <div className="md:col-span-2">
                                        <UiFormInput
                                            label="Description"
                                            placeholder="Describe your responsibilities and achievements..."
                                            {...register(`experiences.${index}.description`)}
                                            error={errors.experiences?.[index]?.description}
                                        />
                                    </div>

                                    {/* Skills — spans full width */}
                                    <div className="md:col-span-2">
                                        <UiFormInput
                                            label="Skills"
                                            placeholder="e.g. React, TypeScript, Node.js (comma separated)"
                                            value={
                                                watch(`experiences.${index}.skills`)?.join(', ') ??
                                                ''
                                            }
                                            onChange={(e) => {
                                                const arr = e.target.value
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