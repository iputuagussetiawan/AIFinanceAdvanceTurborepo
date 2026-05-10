'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Briefcase, User } from 'lucide-react'

import { getCurrentUser } from '@/features/auth/actions/auth'
import { OnboardingCard } from '@/features/onboarding/components/onboarding-card'
import { Button } from '@/components/ui/button'

const roles = [
    {
        id: 'jobseeker',
        title: 'Job Seeker',
        description: 'Find your dream job and build your career.',
        icon: User,
        features: ['Browse thousands of jobs', 'AI-powered matching', 'Track applications'],
    },
    {
        id: 'employer',
        title: 'Employer',
        description: 'Hire top talent and grow your team.',
        icon: Briefcase,
        features: ['Post unlimited jobs', 'Smart candidate filtering', 'Analytics dashboard'],
    },
]

const Onboarding = () => {
    const router = useRouter()
    const [selected, setSelected] = useState<string | null>(null)

    const handleContinue = async () => {
        if (selected) {
            router.push(`/onboarding/${selected}`)
        }
    }
    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full max-w-2xl"
            >
                {/* Header Animation */}
                <div className="mb-10 text-center">
                    <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
                        How will you use our platform?
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Select your primary role to customize your experience.
                    </p>
                </div>

                {/* Grid Stagger Animation */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {roles.map((role, index) => (
                        <motion.div
                            key={role.id}
                            initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
                        >
                            <OnboardingCard
                                role={role}
                                isSelected={selected === role.id}
                                onSelect={() => setSelected(role.id)}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Footer Button Animation */}
                <motion.div
                    className="mt-8 flex flex-col items-center gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <AnimatePresence mode="wait">
                        <Button
                            key={selected ? 'active' : 'disabled'}
                            onClick={handleContinue}
                            disabled={!selected}
                            className="relative w-full overflow-hidden px-8 py-6 sm:w-auto"
                        >
                            <motion.span
                                className="flex items-center"
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -10, opacity: 0 }}
                            >
                                Continue
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </motion.span>
                        </Button>
                    </AnimatePresence>

                    <p className="text-muted-foreground text-xs">
                        You can change this later in your profile settings.
                    </p>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default Onboarding
