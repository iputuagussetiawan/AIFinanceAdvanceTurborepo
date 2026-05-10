'use client'

import React from 'react'

import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FormNavigationProps {
    currentStep: number
    totalSteps: number
    prev: () => void
    next: () => void
    isSubmitting?: boolean
}

export const FormNavigation = ({
    currentStep,
    totalSteps,
    prev,
    next,
    isSubmitting,
}: FormNavigationProps) => {
    const isLastStep = currentStep === totalSteps

    return (
        <div className="mt-8 flex justify-between border-t pt-4">
            {/* Back Button */}
            <Button
                type="button"
                variant="ghost"
                onClick={prev}
                disabled={currentStep === 1 || isSubmitting}
            >
                Back
            </Button>

            {isLastStep ? (
                /* Final Submit Button */
                <Button type="submit" disabled={isSubmitting} className="min-w-35">
                    {isSubmitting ? 'Completing...' : `Complete Step ${currentStep}`}
                </Button>
            ) : (
                /* Next Step "Div" Button */
                <div
                    role="button"
                    tabIndex={0}
                    onClick={next}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            next()
                        }
                    }}
                    className={cn(
                        buttonVariants({ variant: 'default' }),
                        'cursor-pointer select-none',
                    )}
                >
                    Next Step {currentStep}
                </div>
            )}
        </div>
    )
}
