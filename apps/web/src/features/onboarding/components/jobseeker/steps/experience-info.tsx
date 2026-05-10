'use client'

import React from 'react'
import { Briefcase, Plus, Trash2 } from 'lucide-react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import type { JobseekerDTO } from '@/features/onboarding/types/jobseeker-type'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { UiFormInput } from '@/components/ui/UiFormInput'

const ExperienceInfo = () => {
    const {
        register,
        control,
        watch,
        formState: { errors, isSubmitting },
    } = useFormContext<JobseekerDTO>()

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'experiences', // Matches the array key in your main schema
    })

    const addExperience = () => {
        append({
            title: '',
            company: '',
            employmentType: 'Full-time',
            location: '',
            locationType: 'On-site',
            isCurrent: false,
            // Assert string as Date to fix the TS error for default empty state
            startDate: '' as unknown as Date,
            endDate: '' as unknown as Date,
            description: '',
            orderPosition: fields.length,
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">Experience</h2>
                    <p className="text-muted-foreground text-sm">
                        What is your professional background?
                    </p>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addExperience}
                    className="flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" /> Add Job
                </Button>
            </div>

            <div className="space-y-8">
                {fields.map((field, index) => {
                    // Watch "isCurrent" to disable End Date if true
                    const isCurrent = watch(`experiences.${index}.isCurrent`)

                    return (
                        <div
                            key={field.id}
                            className="bg-card relative space-y-4 rounded-xl border p-6 shadow-sm"
                        >
                            {/* Remove Button */}
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:bg-destructive/10 absolute top-4 right-4"
                                onClick={() => remove(index)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>

                            <div className="text-primary mb-2 flex items-center gap-2">
                                <Briefcase className="h-5 w-5" />
                                <span className="font-medium">Experience #{index + 1}</span>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <UiFormInput
                                    {...register(`experiences.${index}.title`)}
                                    label="Job Title"
                                    placeholder="e.g. Software Engineer"
                                    error={errors.experiences?.[index]?.title}
                                    isSubmitting={isSubmitting}
                                />
                                <UiFormInput
                                    {...register(`experiences.${index}.company`)}
                                    label="Company"
                                    placeholder="e.g. Acme Inc"
                                    error={errors.experiences?.[index]?.company}
                                    isSubmitting={isSubmitting}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <UiFormInput
                                    {...register(`experiences.${index}.employmentType`)}
                                    label="Employment Type"
                                    placeholder="e.g. Full-time"
                                    error={errors.experiences?.[index]?.employmentType}
                                    isSubmitting={isSubmitting}
                                />
                                <UiFormInput
                                    {...register(`experiences.${index}.location`)}
                                    label="Location"
                                    placeholder="e.g. New York, NY"
                                    error={errors.experiences?.[index]?.location}
                                    isSubmitting={isSubmitting}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <UiFormInput
                                    {...register(`experiences.${index}.startDate`)}
                                    label="Start Date"
                                    type="date"
                                    error={errors.experiences?.[index]?.startDate}
                                    isSubmitting={isSubmitting}
                                />
                                <UiFormInput
                                    {...register(`experiences.${index}.endDate`)}
                                    label="End Date"
                                    type="date"
                                    disabled={isCurrent}
                                    error={errors.experiences?.[index]?.endDate}
                                    isSubmitting={isSubmitting}
                                />
                            </div>

                            <div className="flex items-center space-x-2 py-2">
                                <Checkbox
                                    id={`isCurrent-${index}`}
                                    {...register(`experiences.${index}.isCurrent`)}
                                />
                                <Label
                                    htmlFor={`isCurrent-${index}`}
                                    className="cursor-pointer text-sm"
                                >
                                    I am currently working in this role
                                </Label>
                            </div>

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    {...register(`experiences.${index}.description`)}
                                    placeholder="Briefly describe your responsibilities..."
                                    className="min-h-25"
                                />
                            </div>
                        </div>
                    )
                })}

                {fields.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-12 text-center">
                        <p className="text-muted-foreground mb-4">No work history added.</p>
                        <Button type="button" variant="secondary" onClick={addExperience}>
                            Add your first role
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ExperienceInfo
