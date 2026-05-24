'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { Briefcase, Check, GraduationCap, User } from 'lucide-react'
import { FormProvider, useForm, type Resolver } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { educationService } from '@/features/jobseeker/jobseeker-education/services/education-service'
import { experienceService } from '@/features/jobseeker/jobseeker-experience/services/experience-service'
import { jobseekerService } from '@/features/jobseeker/services/jobseeker-service'
import { OnboardingStepper } from '@/features/onboarding/components/onboarding-stepper'
import { Button } from '@/components/ui/button'
import { useFormPersist } from '@/hooks/use-form-persist'

import { jobseekerValidation, type JobseekerDTO } from '../types/jobseeker-type'
import { FormNavigation } from './jobseeker/onboarding-stepper-navigation'
import EducationInfo from './jobseeker/steps/education-info'
import ExperienceInfo from './jobseeker/steps/experience-info'
import PersonalInfo from './jobseeker/steps/personal-info'
import ReviewStep from './jobseeker/steps/review'

const steps = [
    { step: 1, title: 'Personal Info', description: 'Account & contact details', icon: User },
    { step: 2, title: 'Last Education', description: 'Academic background', icon: GraduationCap },
    { step: 3, title: 'Last Experience', description: 'Work history', icon: Briefcase },
    { step: 4, title: 'Summary', description: 'Final review', icon: Check },
]

const totalSteps = steps.length

const OnboardingJobseeker = () => {
    const [currentStep, setCurrentStep] = useState(1)
    const [isSubmitted, setIsSubmitted] = useState(false)

    // 👇 1. Fetch authenticated user data
    const form = useForm<JobseekerDTO>({
        resolver: zodResolver(jobseekerValidation as any) as Resolver<JobseekerDTO>,
        mode: 'onTouched',
        defaultValues: {
            jobTitle: '',
            headline: '',
            currentPosition: '',
            industry: '',
            country: '',
            state: '',
            city: '',
            openToWork: false,
            educations: [
                {
                    institution: '',
                    institutionName: '',
                    degree: '',
                    fieldOfStudy: '',
                    startDate: '',
                    endDate: '',
                    grade: '',
                    activities: '',
                    description: '',
                    orderPosition: 0,
                },
            ],
            experiences: [],
        },
    })

    const { clearStorage } = useFormPersist(form, 'jobseeker-onboarding-data')

    const queryClient = useQueryClient()

    const { mutate: submitOnboarding, isPending } = useMutation({
        mutationFn: async (data: JobseekerDTO) => {
            // Must run sequentially — all three call UserModel.findById+save on the
            // same document. Parallel execution causes a Mongoose VersionError
            // because the first save increments __v before the others finish.
            await jobseekerService.saveProfile(data)

            await educationService.updateAll(data.educations)

            if (data.experiences.length > 0) {
                await experienceService.updateAll(data.experiences)
            }
        },
        onSuccess: () => {
            clearStorage()
            queryClient.invalidateQueries({ queryKey: ['authUser'] })
            setIsSubmitted(true)
            toast.success('Profile created successfully!')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Submission failed. Please try again.')
        },
    })

    const stepConfig = {
        1: {
            fields: [
                'headline',
                'currentPosition',
                'industry',
                'country',
                'state',
                'city',
            ],
        },
        2: { fields: ['educations'] },
        3: { fields: ['experiences'] },
        4: { fields: [] },
    } as Record<number, { fields: (keyof JobseekerDTO)[] }>

    const next = async () => {
        const fieldsToValidate = stepConfig[currentStep]?.fields || []
        const isValid = await form.trigger(fieldsToValidate)
        if (isValid) {
            setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
        }
    }

    const prev = () => setCurrentStep((s) => Math.max(s - 1, 1))

    const onSubmit = (data: JobseekerDTO) => {
        if (currentStep !== totalSteps) return
        submitOnboarding(data)
    }

    // Success View
    if (isSubmitted) {
        return (
            <div className="mx-auto max-w-2xl space-y-4 px-4 py-20 text-center">
                <div className="bg-primary/10 text-primary mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                    <Check className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold">Registration Complete!</h2>
                <p className="text-muted-foreground">
                    Your jobseeker profile has been created successfully.
                </p>
                <Button onClick={() => (window.location.href = '/dashboard')}>
                    Go to Dashboard
                </Button>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-2xl px-4 py-10">
            <OnboardingStepper
                steps={steps}
                currentStep={currentStep}
                onStepClick={(s) => s < currentStep && setCurrentStep(s)}
            />
            <FormProvider {...form}>
                <form
                    onSubmit={(e) => {
                        if (currentStep !== totalSteps) {
                            e.preventDefault()
                            return
                        }
                        form.handleSubmit(onSubmit)(e)
                    }}
                    className="bg-card space-y-8 rounded-xl border p-6 shadow-sm"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {currentStep === 1 && <PersonalInfo />}
                            {currentStep === 2 && <EducationInfo />}
                            {currentStep === 3 && <ExperienceInfo />}
                            {currentStep === 4 && <ReviewStep />}
                        </motion.div>
                    </AnimatePresence>
                    <FormNavigation
                        currentStep={currentStep}
                        totalSteps={totalSteps}
                        prev={prev}
                        next={next}
                        isSubmitting={isPending}
                    />
                </form>
            </FormProvider>
        </div>
    )
}

export default OnboardingJobseeker