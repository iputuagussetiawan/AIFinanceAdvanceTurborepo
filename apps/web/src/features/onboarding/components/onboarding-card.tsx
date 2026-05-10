'use client'

import React from 'react'
import { Check, type LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

interface Role {
    id: string
    title: string
    description: string
    icon: LucideIcon // 🗝️ Next.js uses LucideIcon type for passed components
    features: string[]
}

interface OnboardingCardProps {
    role: Role
    isSelected: boolean
    onSelect: (id: string) => void
}

export function OnboardingCard({ role, isSelected, onSelect }: OnboardingCardProps) {
    const Icon = role.icon

    return (
        <div
            onClick={() => onSelect(role.id)}
            role="radio"
            aria-checked={isSelected}
            tabIndex={0}
            // 🗝️ Using 'cn' utility for cleaner conditional tailwind classes
            className={cn(
                'focus-visible:ring-primary relative flex h-full cursor-pointer flex-col rounded-xl border-2 p-6 transition-all outline-none focus-visible:ring-2',
                isSelected
                    ? 'border-primary bg-primary/5 ring-primary ring-1'
                    : 'border-muted bg-card hover:border-muted-foreground/50',
            )}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    onSelect(role.id)
                }
            }}
        >
            {/* Conditional Rendering (v-if equivalent) */}
            {isSelected && (
                <div className="bg-primary text-primary-foreground animate-in fade-in zoom-in-50 absolute top-4 right-4 flex h-5 w-5 items-center justify-center rounded-full duration-200">
                    <Check className="h-3 w-3 stroke-3" />
                </div>
            )}

            <div className="bg-background mb-4 flex h-10 w-10 items-center justify-center rounded-lg border shadow-sm">
                <Icon className="text-foreground h-5 w-5" />
            </div>

            <div className="mb-4 space-y-1">
                <h3 className="text-lg leading-none font-semibold tracking-tight">{role.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{role.description}</p>
            </div>

            {/* Feature List (v-for equivalent) */}
            <ul className="mt-auto space-y-2">
                {role.features.map((feature, i) => (
                    <li key={i} className="text-muted-foreground flex items-center gap-2 text-sm">
                        <div className="bg-muted-foreground/40 h-1 w-1 shrink-0 rounded-full" />
                        {feature}
                    </li>
                ))}
            </ul>
        </div>
    )
}
