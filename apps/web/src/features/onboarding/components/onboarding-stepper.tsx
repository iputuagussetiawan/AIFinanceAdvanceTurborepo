'use client'

import React from 'react'
import { Check, type LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

interface Step {
    step: number
    title: string
    description?: string
    icon: LucideIcon
}

interface OnboardingStepperProps {
    steps: Step[]
    currentStep: number
    onStepClick?: (step: number) => void // 🗝️ Added prop for redirection
}

export function OnboardingStepper({ steps, currentStep, onStepClick }: OnboardingStepperProps) {
    return (
        <nav aria-label="Progress" className="mb-12">
            <ol className="flex w-full items-start gap-2">
                {steps.map((item, index) => {
                    const Icon = item.icon
                    const isCompleted = currentStep > item.step
                    const isActive = currentStep === item.step

                    // 🗝️ Logic: Allow clicking only on steps the user has already visited or is on
                    const isClickable = onStepClick && (isCompleted || isActive)

                    return (
                        <li
                            key={item.step}
                            className="group relative flex w-full flex-col items-center"
                        >
                            {/* Progress Line */}
                            {index !== steps.length - 1 && (
                                <div
                                    className="bg-muted absolute top-5 right-[calc(-50%+20px)] left-[calc(50%+20px)] h-0.5 rounded-full"
                                    aria-hidden="true"
                                >
                                    <div
                                        className="bg-primary h-full transition-all duration-500 ease-in-out"
                                        style={{ width: isCompleted ? '100%' : '0%' }}
                                    />
                                </div>
                            )}

                            {/* Step Button/Indicator */}
                            <button
                                type="button"
                                disabled={!isClickable}
                                onClick={() => isClickable && onStepClick(item.step)}
                                className={cn(
                                    'group focus-visible:ring-primary flex flex-col items-center rounded-lg transition-all outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                                    isClickable ? 'cursor-pointer' : 'cursor-default',
                                )}
                            >
                                <div
                                    className={cn(
                                        'relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-500',
                                        isCompleted || isActive
                                            ? 'bg-primary border-primary text-primary-foreground shadow-primary/20 shadow-lg'
                                            : 'bg-background border-muted text-muted-foreground',
                                        isClickable && 'group-hover:scale-110 active:scale-95', // 🗝️ Interaction feedback
                                    )}
                                >
                                    {isCompleted ? (
                                        <Check className="h-5 w-5 stroke-3" />
                                    ) : (
                                        <Icon className="h-5 w-5" />
                                    )}
                                </div>

                                {/* Text Labels */}
                                <div className="mt-3 flex flex-col items-center text-center">
                                    <span
                                        className={cn(
                                            'text-sm font-semibold transition-colors duration-300',
                                            isActive || isCompleted
                                                ? 'text-primary'
                                                : 'text-muted-foreground',
                                        )}
                                    >
                                        {item.title}
                                    </span>
                                    {item.description && (
                                        <span className="text-muted-foreground hidden text-[10px] font-medium tracking-wider uppercase sm:block">
                                            {item.description}
                                        </span>
                                    )}
                                </div>
                            </button>
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}
