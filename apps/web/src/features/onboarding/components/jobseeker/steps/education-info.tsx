'use client'

import React from 'react'
import { GraduationCap, Plus, Trash2 } from 'lucide-react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import { InstitutionAutoSuggest } from '@/features/master/institution/components/InstitutionAutoSuggest'
import type { JobseekerDTO } from '@/features/onboarding/types/jobseeker-type'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { UiFormDatePicker } from '@/components/ui/UiFormDatePicker'
import { UiFormInput } from '@/components/ui/UiFormInput'
import { DateFormat } from '@/types/date'

const EducationInfo = () => {
    const {
        register,
        control,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useFormContext<JobseekerDTO>()

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'educations',
    })

    const addEducation = () => {
        append({
            institution: '',
            institutionName: '',
            degree: '',
            fieldOfStudy: '',
            startDate: '',
            endDate: '',
            grade: '',
            activities: '',
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

                        {/* Hidden institution ObjectId reference */}
                        <input type="hidden" {...register(`educations.${index}.institution`)} />

                        {/* School name with auto-suggest + institution ref */}
                        <InstitutionAutoSuggest
                            value={watch(`educations.${index}.institutionName`) ?? ''}
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
                                setValue(`educations.${index}.institutionName`, val.name, {
                                    shouldValidate: true,
                                })
                                setValue(`educations.${index}.institution`, val.id, {
                                    shouldValidate: true,
                                })
                            }}
                        />

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <UiFormInput
                                {...register(`educations.${index}.degree`)}
                                label="Degree"
                                placeholder="e.g. Bachelor of Science"
                                error={errors.educations?.[index]?.degree}
                                isSubmitting={isSubmitting}
                            />
                            <UiFormInput
                                {...register(`educations.${index}.fieldOfStudy`)}
                                label="Field of Study"
                                placeholder="e.g. Computer Science"
                                error={errors.educations?.[index]?.fieldOfStudy}
                                isSubmitting={isSubmitting}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <UiFormDatePicker
                                label="Start Date"
                                name={`educations.${index}.startDate`}
                                control={control as any}
                                displayFormat={DateFormat.FULL_DISPLAY}
                                error={errors.educations?.[index]?.startDate}
                            />
                            <UiFormDatePicker
                                label="End Date (Expected)"
                                name={`educations.${index}.endDate`}
                                control={control as any}
                                displayFormat={DateFormat.FULL_DISPLAY}
                                error={errors.educations?.[index]?.endDate}
                            />
                        </div>

                        <UiFormInput
                            {...register(`educations.${index}.grade`)}
                            label="Grade / GPA (Optional)"
                            placeholder="e.g. 3.8 / 4.0"
                            error={errors.educations?.[index]?.grade}
                            isSubmitting={isSubmitting}
                        />

                        <div className="space-y-2">
                            <Label>Activities (Optional)</Label>
                            <Textarea
                                {...register(`educations.${index}.activities`)}
                                placeholder="e.g. Student council, coding club, sports team..."
                                className="min-h-20"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Description (Optional)</Label>
                            <Textarea
                                {...register(`educations.${index}.description`)}
                                placeholder="Briefly describe your thesis, honors, or key courses..."
                                className="min-h-24"
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
