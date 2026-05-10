'use client'

import React from 'react'
import { useFormContext } from 'react-hook-form'

import type { JobseekerDTO } from '@/features/onboarding/types/jobseeker-type'
import { UiFormInput } from '@/components/ui/UiFormInput'
import { UiFormSearchSelect } from '@/components/ui/UiFormSearchSelect'

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

const PersonalInfo = () => {
    const {
        register,
        formState: { errors, isSubmitting },
    } = useFormContext<JobseekerDTO>()

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
                    isSubmitting={isSubmitting}
                />
                <UiFormInput
                    {...register('lastName')}
                    label="Last Name"
                    placeholder="Doe"
                    error={errors.lastName}
                    isSubmitting={isSubmitting}
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

            {/* Professional Section */}
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

            {/* Contact & Location Section */}
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

            {/* Dates & Links */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <UiFormInput
                    {...register('birthday')}
                    type="date"
                    label="Birthday"
                    error={errors.birthday}
                    isSubmitting={isSubmitting}
                />
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
