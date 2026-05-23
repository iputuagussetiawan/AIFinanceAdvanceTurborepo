'use client'

import { useState } from 'react'
import { useFormContext, useController } from 'react-hook-form'

import type { JobseekerDTO } from '@/features/onboarding/types/jobseeker-type'
import { UiFormInput } from '@/components/ui/UiFormInput'
import { Switch } from '@/components/ui/switch'
import { CountryAutoSuggest } from '@/features/master/country/components/CountryAutoSuggest'
import { StateAutoSuggest } from '@/features/master/state/components/StateAutoSuggest'
import { CityAutoSuggest } from '@/features/master/city/components/CityAutoSuggest'

const PersonalInfo = () => {
    const [countryDisplay, setCountryDisplay] = useState('')
    const [stateDisplay, setStateDisplay] = useState('')
    const [cityDisplay, setCityDisplay] = useState('')

    const {
        register,
        control,
        setValue,
        formState: { errors, isSubmitting },
    } = useFormContext<JobseekerDTO>()

    const { field: countryField } = useController({ name: 'country', control })
    const { field: stateField } = useController({ name: 'state', control })
    const { field: cityField } = useController({ name: 'city', control })
    const { field: openToWorkField } = useController({ name: 'openToWork', control })

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-semibold">Professional Profile</h2>
                <p className="text-muted-foreground text-sm">
                    Set up your professional details and location.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <UiFormInput
                    {...register('jobTitle')}
                    label="Job Title (Optional)"
                    placeholder="e.g. Senior Software Engineer"
                    error={errors.jobTitle}
                    isSubmitting={isSubmitting}
                />
                <UiFormInput
                    {...register('currentPosition')}
                    label="Current Position"
                    placeholder="e.g. Software Engineer"
                    error={errors.currentPosition}
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

            <UiFormInput
                {...register('industry')}
                label="Industry"
                placeholder="e.g. Technology"
                error={errors.industry}
                isSubmitting={isSubmitting}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <CountryAutoSuggest
                    value={countryDisplay}
                    error={errors.country}
                    onValueChange={setCountryDisplay}
                    onSelect={(item) => {
                        countryField.onChange(item.id)
                        setCountryDisplay(item.name)
                        setValue('state', '')
                        setValue('city', '')
                        setStateDisplay('')
                        setCityDisplay('')
                    }}
                />
                <StateAutoSuggest
                    value={stateDisplay}
                    countryId={countryField.value || undefined}
                    error={errors.state}
                    onValueChange={setStateDisplay}
                    onSelect={(item) => {
                        stateField.onChange(item.id)
                        setStateDisplay(item.name)
                        setValue('city', '')
                        setCityDisplay('')
                    }}
                />
                <CityAutoSuggest
                    value={cityDisplay}
                    stateId={stateField.value || undefined}
                    countryId={countryField.value || undefined}
                    error={errors.city}
                    onValueChange={setCityDisplay}
                    onSelect={(item) => {
                        cityField.onChange(item.id)
                        setCityDisplay(item.name)
                    }}
                />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                    <p className="text-sm font-medium">Open to Work</p>
                    <p className="text-muted-foreground text-xs">
                        Let recruiters know you're available
                    </p>
                </div>
                <Switch
                    checked={!!openToWorkField.value}
                    onCheckedChange={openToWorkField.onChange}
                    disabled={isSubmitting}
                />
            </div>
        </div>
    )
}

export default PersonalInfo
