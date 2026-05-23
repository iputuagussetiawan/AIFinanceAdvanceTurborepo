import React, { useRef, useState } from 'react'
import { useAuthContext } from '@/providers/auth-provider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Camera, Loader2, Save } from 'lucide-react' // Added Save import
import { toast } from 'sonner'

import type { IUser } from '@/features/session/types/session-type'
import { userService } from '@/features/user/services/user-service'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { UserAvatar } from '@/components/user-avatar'

const PhotoProfileForm = () => {
    const { user } = useAuthContext()
    const [previewImage, setPreviewImage] = useState<string | null>(user?.profilePicture || null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const queryClient = useQueryClient()

    // 1. Define the Mutation
    const { mutate: updatePhotoProfile, isPending } = useMutation({
        mutationFn: (formData: FormData) => userService.updatePhotoProfile(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['authUser'] })
            toast.success('Profile picture updated successfully!', { position: 'top-center' })
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update profile')
            // Revert preview to original on error
            setPreviewImage(user?.profilePicture || null)
        },
    })

    // 2. Triggered when user selects a new file
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // 1. Instant Preview (Optimistic UI)
        const reader = new FileReader()
        reader.onloadend = () => {
            setPreviewImage(reader.result as string)
        }
        reader.readAsDataURL(file)

        // 2. Direct Upload to DB
        const formData = new FormData()
        formData.append('profilePicture', file)
        updatePhotoProfile(formData)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-6">
                <div
                    className="group relative cursor-pointer"
                    onClick={() => !isPending && fileInputRef.current?.click()}
                >
                    {/* Overlay Loader while uploading */}
                    {isPending && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-full bg-black/40">
                            <Loader2 className="h-6 w-6 animate-spin text-white" />
                        </div>
                    )}

                    <UserAvatar
                        name={user?.name}
                        image={previewImage}
                        className="h-20 w-20 transition-opacity group-hover:opacity-80"
                    />

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                        <Camera className="h-6 w-6 text-white drop-shadow-md" />
                    </div>

                    <input
                        type="file"
                        name="profilePicture"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={isPending}
                    />
                </div>

                <div>
                    <p className="text-sm font-medium">Profile Photo</p>
                    <p className="text-muted-foreground text-xs">
                        Click the avatar to change your photo
                    </p>
                </div>
            </div>
        </div>
    )
}

export default PhotoProfileForm
