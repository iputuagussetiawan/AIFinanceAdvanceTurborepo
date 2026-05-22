'use client'

import React, { useState } from 'react'
import { useFormContext, useController } from 'react-hook-form'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

import type { JobseekerDTO } from '@/features/onboarding/types/jobseeker-type'
import { UiFormInput } from '@/components/ui/UiFormInput'
import { UiFormSearchSelect } from '@/components/ui/UiFormSearchSelect'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const countryOptions = [
    { label: 'Indonesia', value: 'id' },
    { label: 'United States', value: 'us' },
    { label: 'Japan', value: 'jp' },
]

const phoneTypeOptions = [
    { label: 'Mobile', value: 'Mobile' },
    { label: 'Home', value: 'Home' },
    { label: 'Work', value: 'Work' },
]

// 👇 Accept isAuthLoading from parent
interface PersonalInfoProps {
    isAuthLoading?: boolean
}

const PersonalInfo = ({ isAuthLoading = false }: PersonalInfoProps) => {
    const [calendarOpen, setCalendarOpen] = useState(false)
    const {
        register,
        control,
        formState: { errors, isSubmitting },
    } = useFormContext<JobseekerDTO>()

    const {
        field: birthdayField,
    } = useController({ name: 'birthday', control })

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-semibold">Personal Information</h2>
                <p className="text-muted-foreground text-sm">
                    Set up your credentials and contact details.
                </p>
            </div>

            {/* Name Section */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <UiFormInput
                    {...register('firstName')}
                    label="First Name"
                    placeholder="Jane"
                    error={errors.firstName}
                    isSubmitting={isSubmitting || isAuthLoading}
                />
                <UiFormInput
                    {...register('lastName')}
                    label="Last Name"
                    placeholder="Doe"
                    error={errors.lastName}
                    isSubmitting={isSubmitting || isAuthLoading}
                />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <UiFormInput
                    {...register('additionalName')}
                    label="Additional Name (Optional)"
                    placeholder="Middle name or nickname"
                    error={errors.additionalName}
                    isSubmitting={isSubmitting}
                />
                <UiFormInput
                    {...register('pronouns')}
                    label="Pronouns (Optional)"
                    placeholder="e.g. she/her"
                    error={errors.pronouns}
                    isSubmitting={isSubmitting}
                />
            </div>

            <UiFormInput
                {...register('headline')}
                label="Headline"
                placeholder="e.g. Senior Software Engineer specializing in React"
                error={errors.headline}
                isSubmitting={isSubmitting}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <UiFormInput
                    {...register('currentPosition')}
                    label="Current Position"
                    placeholder="e.g. Software Engineer"
                    error={errors.currentPosition}
                    isSubmitting={isSubmitting}
                />
                <UiFormInput
                    {...register('industry')}
                    label="Industry"
                    placeholder="e.g. Technology"
                    error={errors.industry}
                    isSubmitting={isSubmitting}
                />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <UiFormSearchSelect
                    name="country"
                    label="Country"
                    options={countryOptions}
                    error={errors.country}
                    isSubmitting={isSubmitting}
                />
                <UiFormInput
                    {...register('city')}
                    label="City"
                    placeholder="e.g. Jakarta"
                    error={errors.city}
                    isSubmitting={isSubmitting}
                />
            </div>

            <UiFormInput
                {...register('address')}
                label="Address"
                placeholder="Full residential address"
                error={errors.address}
                isSubmitting={isSubmitting}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                    <UiFormInput
                        {...register('phoneNumber')}
                        label="Phone Number"
                        placeholder="+62..."
                        error={errors.phoneNumber}
                        isSubmitting={isSubmitting}
                    />
                </div>
                <UiFormSearchSelect
                    name="phoneType"
                    label="Type"
                    options={phoneTypeOptions}
                    error={errors.phoneType}
                    isSubmitting={isSubmitting}
                />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Birthday</label>
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                disabled={isSubmitting}
                                className={cn(
                                    'w-full justify-start text-left font-normal',
                                    !birthdayField.value && 'text-muted-foreground',
                                    errors.birthday && 'border-destructive',
                                )}
                            >
                                <CalendarIcon className="mr-2 size-4" />
                                {birthdayField.value
                                    ? format(new Date(birthdayField.value), 'PPP')
                                    : 'Pick a date'}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                captionLayout="dropdown"
                                selected={birthdayField.value ? new Date(birthdayField.value) : undefined}
                                onSelect={(date) => {
                                    birthdayField.onChange(date ? date.toISOString().split('T')[0] : '')
                                    setCalendarOpen(false)
                                }}
                                disabled={{ after: new Date() }}
                                defaultMonth={birthdayField.value ? new Date(birthdayField.value) : new Date(2000, 0)}
                                fromYear={1940}
                                toYear={new Date().getFullYear()}
                            />
                        </PopoverContent>
                    </Popover>
                    {errors.birthday && (
                        <p className="text-destructive text-xs">{errors.birthday.message}</p>
                    )}
                </div>
                <UiFormInput
                    {...register('website')}
                    label="Website (Optional)"
                    placeholder="https://yourportfolio.com"
                    error={errors.website}
                    isSubmitting={isSubmitting}
                />
            </div>
        </div>
    )
}

export default PersonalInfo