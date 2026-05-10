'use client'

import React from 'react'
import { GraduationCap, Plus, Trash2 } from 'lucide-react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import type { JobseekerDTO } from '@/features/onboarding/types/jobseeker-type'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { UiFormInput } from '@/components/ui/UiFormInput'

const EducationInfo = () => {
    const {
        register,
        control,
        formState: { errors, isSubmitting },
    } = useFormContext<JobseekerDTO>()

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'educations', // Matches the key in your jobseekerValidation schema
    })

    const addEducation = () => {
        append({
            schoolName: '',
            degree: '',
            fieldOfStudy: '',
            // Assertion to bypass Date/String mismatch in default state
            startDate: '' as unknown as Date,
            endDate: '' as unknown as Date,
            grade: '',
            description: '',
            orderPosition: fields.length,
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">Education</h2>
                    <p className="text-muted-foreground text-sm">
                        Tell us about your academic background.
                    </p>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addEducation}
                    className="flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" /> Add Education
                </Button>
            </div>

            <div className="space-y-8">
                {fields.map((field, index) => (
                    <div
                        key={field.id}
                        className="bg-card relative space-y-4 rounded-xl border p-6 shadow-sm transition-all"
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
                            <GraduationCap className="h-5 w-5" />
                            <span className="font-medium">Education #{index + 1}</span>
                        </div>

                        {/* School Name */}
                        <UiFormInput
                            {...register(`educations.${index}.schoolName`)}
                            label="School / University"
                            placeholder="e.g. Harvard University"
                            error={errors.educations?.[index]?.schoolName}
                            isSubmitting={isSubmitting}
                        />

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {/* Degree */}
                            <UiFormInput
                                {...register(`educations.${index}.degree`)}
                                label="Degree"
                                placeholder="e.g. Bachelor of Science"
                                error={errors.educations?.[index]?.degree}
                                isSubmitting={isSubmitting}
                            />
                            {/* Field of Study */}
                            <UiFormInput
                                {...register(`educations.${index}.fieldOfStudy`)}
                                label="Field of Study"
                                placeholder="e.g. Computer Science"
                                error={errors.educations?.[index]?.fieldOfStudy}
                                isSubmitting={isSubmitting}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {/* Dates */}
                            <UiFormInput
                                {...register(`educations.${index}.startDate`)}
                                label="Start Date"
                                type="date"
                                error={errors.educations?.[index]?.startDate}
                                isSubmitting={isSubmitting}
                            />
                            <UiFormInput
                                {...register(`educations.${index}.endDate`)}
                                label="End Date (Expected)"
                                type="date"
                                error={errors.educations?.[index]?.endDate}
                                isSubmitting={isSubmitting}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <UiFormInput
                                {...register(`educations.${index}.grade`)}
                                label="Grade / GPA (Optional)"
                                placeholder="e.g. 3.8/4.0"
                                error={errors.educations?.[index]?.grade}
                                isSubmitting={isSubmitting}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                {...register(`educations.${index}.description`)}
                                placeholder="Briefly describe your thesis, honors, or key courses..."
                                className="min-h-25"
                            />
                        </div>
                    </div>
                ))}

                {fields.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-12 text-center">
                        <p className="text-muted-foreground mb-4">No education entries added.</p>
                        <Button type="button" variant="secondary" onClick={addEducation}>
                            Add your first education
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default EducationInfo
