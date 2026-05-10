'use client'

import { useEffect } from 'react'
import { useAuthContext } from '@/providers/auth-provider'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, Save } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form' // Added Controller
import { toast } from 'sonner'

import { userService } from '@/features/user/services/user-service'
import {
    updateUserProfileValidation,
    type UpdateUserProfileDTO,
} from '@/features/user/types/user-type'
import { RichTextEditor } from '@/components/editor' // Using your new editor
import { Button } from '@/components/ui/button'

export default function BioForm() {
    const { user } = useAuthContext()
    const queryClient = useQueryClient()

    const {
        handleSubmit,
        reset,
        setError,
        control, // Needed for the Controller
        formState: { errors },
    } = useForm<UpdateUserProfileDTO>({
        resolver: zodResolver(updateUserProfileValidation),
        defaultValues: {
            bio: user?.bio || '',
        },
    })

    useEffect(() => {
        if (user) {
            reset({ bio: user.bio || '' })
        }
    }, [user, reset])

    const { mutate, isPending } = useMutation({
        mutationFn: (data: UpdateUserProfileDTO) => userService.updateProfile(data),
        onSuccess: () => {
            toast.success('Bio updated successfully')
            queryClient.invalidateQueries({ queryKey: ['authUser'] })
        },
        onError: (error: any) => {
            const serverMessage = error.response?.data?.message || 'Failed to update bio'

            // 2. This pushes the server error into the form state
            // It will trigger the red border and the error text below the editor
            setError('bio', {
                type: 'server',
                message: serverMessage,
            })
            toast.error(error.response?.data?.message)
        },
    })

    const onSubmit = (data: UpdateUserProfileDTO) => {
        mutate(data)
    }

    if (!user) {
        return (
            <div className="flex justify-center p-10">
                <Loader2 className="animate-spin" />
            </div>
        )
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mt-4 grid grid-cols-12 gap-8">
                    <div className="col-span-12 space-y-2">
                        <label className="text-muted-foreground mb-2 block text-sm font-semibold tracking-wider uppercase">
                            Professional Bio
                        </label>

                        {/* 🗝️ Use Controller to bridge Tiptap and React Hook Form */}
                        <Controller
                            name="bio"
                            control={control}
                            render={({ field }) => (
                                <RichTextEditor
                                    initialContent={field.value}
                                    onChange={field.onChange}
                                    error={!!errors.bio}
                                />
                            )}
                        />

                        {errors.bio && (
                            <p className="text-destructive text-xs font-medium">
                                {errors.bio.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-between">
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="gap-2 rounded-lg px-6 py-5 hover:cursor-pointer"
                    >
                        {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        {isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
