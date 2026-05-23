'use client'

import { useEffect } from 'react'
import { useAuthContext } from '@/providers/auth-provider'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Globe, Loader2, Mail, MapPin, Phone, Save } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { userService } from '@/features/user/services/user-service'
import {
    updateUserProfileValidation,
    type UpdateUserProfileDTO,
} from '@/features/user/types/user-type'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { UiFormInput } from '@/components/ui/UiFormInput'

export default function PersonalInfoForm() {
    const { user } = useAuthContext()
    const queryClient = useQueryClient()
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UpdateUserProfileDTO>({
        resolver: zodResolver(updateUserProfileValidation),
        defaultValues: {
            firstName: user?.firstName ?? '',
            lastName: user?.lastName ?? '',
            jobTitle: user?.jobTitle ?? '',
            address: user?.address ?? '',
            phoneNumber: user?.phoneNumber ?? '',
            email: user?.email ?? '',
            website: user?.website ?? '',
        },
    })

    useEffect(() => {
        if (user) {
            reset({
                firstName: user.firstName,
                lastName: user.lastName,
                jobTitle: user.jobTitle,
                address: user.address,
                phoneNumber: user.phoneNumber,
                email: user.email,
                website: user.website,
            })
        }
    }, [user, reset])

    const { mutate, isPending } = useMutation({
        mutationFn: (data: UpdateUserProfileDTO) => userService.updateProfile(data),
        onSuccess: () => {
            toast.success('Profile updated successfully')
            queryClient.invalidateQueries({ queryKey: ['authUser'] })
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update profile')
        },
    })

    const onSubmit = (data: UpdateUserProfileDTO) => {
        mutate(data)
    }

    return (
        <div>
            {/* A4 Wrapper */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-12 items-start justify-end gap-8">
                    {/* LEFT SIDE: Name & Title */}
                    <div className="col-span-12 space-y-2">
                        <UiFormInput
                            id="firstName"
                            label="First Name"
                            placeholder="FIRST NAME"
                            className="border-none py-6 text-5xl font-black tracking-widest uppercase focus-visible:ring-0"
                            error={errors.firstName}
                            isSubmitting={isPending}
                            {...register('firstName')}
                        />
                        <UiFormInput
                            id="lastName"
                            label="Last Name"
                            placeholder="LAST NAME"
                            className="border-none py-6 text-5xl font-black tracking-widest uppercase focus-visible:ring-0"
                            error={errors.lastName}
                            isSubmitting={isPending}
                            {...register('lastName')}
                        />
                        <div className="pt-4">
                            <UiFormInput
                                id="jobTitle"
                                label="Job Title"
                                placeholder="JOB TITLE"
                                className="border-none py-6 text-lg font-medium tracking-[0.3em] text-gray-600 uppercase focus-visible:ring-0"
                                error={errors.jobTitle}
                                isSubmitting={isPending}
                                {...register('jobTitle')}
                            />
                        </div>
                    </div>

                    {/* RIGHT SIDE: Contact Info + Yellow Bar */}
                    <div className="col-span-full col-start-1 flex items-stretch gap-3">
                        {/* The Yellow Icon Sidebar */}
                        <div className="flex w-10 shrink-0 flex-col items-center justify-between rounded-sm bg-[#eab308] py-4">
                            <MapPin size={18} />
                            <Phone size={18} />
                            <Mail size={18} />
                            <Globe size={18} />
                        </div>

                        {/* Contact Inputs */}
                        <div className="flex-1 space-y-3">
                            <UiFormInput
                                id="address"
                                placeholder="Address"
                                className="h-9 border-none py-6 text-right text-sm focus-visible:ring-0"
                                error={errors.address}
                                isSubmitting={isPending}
                                {...register('address')}
                            />
                            <UiFormInput
                                id="phoneNumber"
                                placeholder="Phone"
                                className="h-9 border-none py-6 text-right text-sm focus-visible:ring-0"
                                error={errors.phoneNumber}
                                isSubmitting={isPending}
                                {...register('phoneNumber')}
                            />
                            <UiFormInput
                                id="email"
                                type="email"
                                placeholder="Email"
                                className="h-9 border-none py-6 text-right text-sm focus-visible:ring-0"
                                error={errors.email}
                                isSubmitting={isPending}
                                {...register('email')}
                            />
                            <UiFormInput
                                id="website"
                                placeholder="Website"
                                className="h-9 border-none py-6 text-right text-sm focus-visible:ring-0"
                                error={errors.website}
                                isSubmitting={isPending}
                                {...register('website')}
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-10 flex items-center justify-between">
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="rounded-lg px-6 py-5 hover:cursor-pointer"
                    >
                        {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        Save Changes
                    </Button>
                </div>
            </form>
        </div>
    )
}
