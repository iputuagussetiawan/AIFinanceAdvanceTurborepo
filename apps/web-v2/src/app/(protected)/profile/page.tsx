'use client'

import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Camera, Loader2 } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useAuthContext } from '@/providers/auth-provider'
import { userService } from '@/features/user/services/user-service'

const profileSchema = z.object({
    firstName: z.string().min(1, 'Required'),
    lastName: z.string().min(1, 'Required'),
})
type ProfileInput = z.infer<typeof profileSchema>

const passwordSchema = z
    .object({
        currentPassword: z.string().min(1, 'Required'),
        newPassword: z.string().min(8, 'Min 8 characters'),
        confirmPassword: z.string(),
    })
    .refine((d) => d.newPassword === d.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })
type PasswordInput = z.infer<typeof passwordSchema>

export default function ProfilePage() {
    const queryClient = useQueryClient()
    const { user } = useAuthContext()
    const fileRef = useRef<HTMLInputElement>(null)
    const [preview, setPreview] = useState<string | null>(null)

    const initials = [user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join('').toUpperCase() || '?'

    const profileForm = useForm<ProfileInput>({
        resolver: zodResolver(profileSchema),
        values: { firstName: user?.firstName ?? '', lastName: user?.lastName ?? '' },
    })

    const passwordForm = useForm<PasswordInput>({ resolver: zodResolver(passwordSchema) })

    const { mutate: updateProfile, isPending: savingProfile } = useMutation({
        mutationFn: (d: ProfileInput) => userService.updateProfile(d),
        onSuccess: () => {
            toast.success('Profile updated')
            queryClient.invalidateQueries({ queryKey: ['me'] })
        },
        onError: (err: Error) => toast.error(err.message),
    })

    const { mutate: updateAvatar, isPending: uploadingAvatar } = useMutation({
        mutationFn: (file: File) => userService.updateAvatar(file),
        onSuccess: () => {
            toast.success('Avatar updated')
            queryClient.invalidateQueries({ queryKey: ['me'] })
            setPreview(null)
        },
        onError: (err: Error) => toast.error(err.message),
    })

    const { mutate: updatePassword, isPending: savingPassword } = useMutation({
        mutationFn: (d: PasswordInput) => userService.updatePassword(d),
        onSuccess: () => {
            toast.success('Password updated')
            passwordForm.reset()
        },
        onError: (err: Error) => toast.error(err.message),
    })

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        setPreview(URL.createObjectURL(file))
        updateAvatar(file)
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold">Profile</h1>
                <p className="text-muted-foreground">Manage your account details</p>
            </div>

            {/* Avatar */}
            <Card>
                <CardHeader>
                    <CardTitle>Profile picture</CardTitle>
                    <CardDescription>Click to upload a new avatar (JPEG, PNG, WebP, GIF · max 5 MB)</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                    <div className="relative">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={preview ?? user?.profilePicture ?? undefined} />
                            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
                        </Avatar>
                        <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow"
                        >
                            {uploadingAvatar ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
                        </button>
                        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </div>
                    <div className="text-sm text-muted-foreground">
                        <p className="font-medium text-foreground">{user?.firstName} {user?.lastName}</p>
                        <p>{user?.email}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Profile info */}
            <Card>
                <CardHeader>
                    <CardTitle>Personal information</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={profileForm.handleSubmit((d) => updateProfile(d))} className="flex flex-col gap-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="firstName">First name</Label>
                                <Input id="firstName" disabled={savingProfile} {...profileForm.register('firstName')} />
                                {profileForm.formState.errors.firstName && (
                                    <p className="text-xs text-destructive">{profileForm.formState.errors.firstName.message}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="lastName">Last name</Label>
                                <Input id="lastName" disabled={savingProfile} {...profileForm.register('lastName')} />
                                {profileForm.formState.errors.lastName && (
                                    <p className="text-xs text-destructive">{profileForm.formState.errors.lastName.message}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <Label>Email</Label>
                            <Input value={user?.email ?? ''} disabled className="opacity-60" />
                        </div>
                        <Button type="submit" disabled={savingProfile} className="w-fit">
                            {savingProfile ? 'Saving...' : 'Save changes'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Change password */}
            {user?.provider === 'email' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Change password</CardTitle>
                        <CardDescription>Choose a strong password with at least 8 characters</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={passwordForm.handleSubmit((d) => updatePassword(d))} className="flex flex-col gap-4">
                            {(['currentPassword', 'newPassword', 'confirmPassword'] as const).map((field) => (
                                <div key={field} className="flex flex-col gap-1.5">
                                    <Label htmlFor={field}>
                                        {field === 'currentPassword' ? 'Current password' : field === 'newPassword' ? 'New password' : 'Confirm new password'}
                                    </Label>
                                    <Input id={field} type="password" placeholder="••••••••" disabled={savingPassword} {...passwordForm.register(field)} />
                                    {passwordForm.formState.errors[field] && (
                                        <p className="text-xs text-destructive">{passwordForm.formState.errors[field]?.message}</p>
                                    )}
                                </div>
                            ))}
                            <Button type="submit" disabled={savingPassword} className="w-fit">
                                {savingPassword ? 'Updating...' : 'Update password'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
