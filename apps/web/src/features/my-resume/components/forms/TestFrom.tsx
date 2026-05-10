'use client'

// Required for hooks in Next.js App Router
import React from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { UiFormDatePicker } from '@/components/ui/UiFormDatePicker'

const TestFrom = () => {
    // 1. Initialize the form
    const { control, handleSubmit } = useForm({
        defaultValues: {
            startDate: '',
        },
    })

    // 2. Handle the save logic
    const onSubmit = (data: any) => {
        console.log('Saving CV Data:', data)
    }

    return (
        <div className="container mx-auto space-y-8 p-6">
            <div className="bg-card max-w-md space-y-4 rounded-lg border p-4">
                <h2 className="text-lg font-semibold">General Information</h2>

                {/* 3. Pass the control object to the component */}
                <UiFormDatePicker label="Start Date" name="startDate" control={control} />

                <Button onClick={handleSubmit(onSubmit)} className="w-full">
                    Save Changes
                </Button>
            </div>
        </div>
    )
}

export default TestFrom
