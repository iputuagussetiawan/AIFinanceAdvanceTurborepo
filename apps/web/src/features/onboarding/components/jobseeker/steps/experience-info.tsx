'use client'

import React from 'react'
import { DateFormat } from '@/types/date'
import { Briefcase, Plus, Trash2 } from 'lucide-react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'

import { CompanyAutoSuggest } from '@/features/master/company/components/CompanyAutoSuggest'
import SkillAutoSuggest from '@/features/master/skill/components/SkillAutoSuggest'
import type { JobseekerDTO } from '@/features/onboarding/types/jobseeker-type'
import { RichTextEditor } from '@/components/editor'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { UiFormDatePicker } from '@/components/ui/UiFormDatePicker'
import { UiFormInput } from '@/components/ui/UiFormInput'

const EMPLOYMENT_TYPES = [
    'Full-time',
    'Part-time',
    'Contract',
    'Freelance',
    'Internship',
    'Volunteer',
] as const

const ExperienceInfo = () => {
    const {
        register,
        control,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useFormContext<JobseekerDTO>()

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'experiences',
    })

    const addExperience = () => {
        append({
            company: '',
            companyName: '',
            title: '',
            employmentType: 'Full-time',
            location: '',
            startDate: '',
            endDate: '',
            isCurrent: false,
            description: '',
            skills: [],
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
                    const isCurrent = watch(`experiences.${index}.isCurrent`)

                    return (
                        <div
                            key={field.id}
                            className="bg-card relative space-y-4 rounded-xl border p-6 shadow-sm"
                        >
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

                            {/* Hidden company ObjectId reference */}
                            <input type="hidden" {...register(`experiences.${index}.company`)} />
                            <input type="hidden" {...register(`experiences.${index}.orderPosition`)} />

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* Company name with auto-suggest */}
                                <CompanyAutoSuggest
                                    value={watch(`experiences.${index}.companyName`) ?? ''}
                                    error={errors.experiences?.[index]?.companyName}
                                    onValueChange={(val) => {
                                        setValue(`experiences.${index}.companyName`, val, {
                                            shouldValidate: true,
                                        })
                                        setValue(`experiences.${index}.company`, '', {
                                            shouldValidate: true,
                                        })
                                    }}
                                    onSelect={(val) => {
                                        setValue(`experiences.${index}.companyName`, val.name, {
                                            shouldValidate: true,
                                        })
                                        setValue(`experiences.${index}.company`, val.id, {
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
                                    isSubmitting={isSubmitting}
                                />

                                {/* Employment Type */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium">Employment Type</label>
                                    <Select
                                        value={watch(`experiences.${index}.employmentType`) ?? ''}
                                        onValueChange={(val) =>
                                            setValue(`experiences.${index}.employmentType`, val, {
                                                shouldValidate: true,
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent className="z-[9999]">
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
                                    placeholder="e.g. Jakarta, Indonesia"
                                    {...register(`experiences.${index}.location`)}
                                    error={errors.experiences?.[index]?.location}
                                    isSubmitting={isSubmitting}
                                />
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-2 gap-4">
                                <UiFormDatePicker
                                    label="Start Date"
                                    name={`experiences.${index}.startDate`}
                                    control={control as any}
                                    displayFormat={DateFormat.FULL_DISPLAY}
                                    error={errors.experiences?.[index]?.startDate}
                                />
                                <UiFormDatePicker
                                    label="End Date"
                                    name={`experiences.${index}.endDate`}
                                    control={control as any}
                                    displayFormat={DateFormat.FULL_DISPLAY}
                                    error={errors.experiences?.[index]?.endDate}
                                />
                            </div>

                            {/* Is Current */}
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id={`isCurrent-${index}`}
                                    checked={isCurrent ?? false}
                                    onCheckedChange={(checked) => {
                                        setValue(`experiences.${index}.isCurrent`, !!checked, {
                                            shouldValidate: true,
                                        })
                                        if (checked) {
                                            setValue(`experiences.${index}.endDate`, '', {
                                                shouldValidate: true,
                                            })
                                        }
                                    }}
                                />
                                <label
                                    htmlFor={`isCurrent-${index}`}
                                    className="cursor-pointer text-sm font-medium"
                                >
                                    I currently work here
                                </label>
                            </div>

                            {/* Description — rich text */}
                            <div className="space-y-2">
                                <label className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase">
                                    Job Description
                                </label>
                                <Controller
                                    name={`experiences.${index}.description`}
                                    control={control}
                                    render={({ field }) => (
                                        <RichTextEditor
                                            initialContent={field.value}
                                            onChange={field.onChange}
                                            error={!!errors.experiences?.[index]?.description}
                                        />
                                    )}
                                />
                                {errors.experiences?.[index]?.description && (
                                    <p className="text-destructive text-xs">
                                        {errors.experiences[index].description?.message}
                                    </p>
                                )}
                            </div>

                            {/* Skills */}
                            <SkillAutoSuggest
                                name={`experiences.${index}.skills`}
                                label="Skills"
                                isSubmitting={isSubmitting}
                            />
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
