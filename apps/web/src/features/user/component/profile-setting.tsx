'use client'

import { useRef, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { CalendarIcon, Camera, Loader2, Save } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import type { IUser } from '@/features/session/types/session-type'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { UiFormInput } from '@/components/ui/UiFormInput'
import { UserAvatar } from '@/components/user-avatar'

import { userService } from '../services/user-service'
import { profileSettingSchema, type ProfileSettingDTO } from '../types/user-type'
import ManageEmail from './profile-setting/manage-email'

const MAX_FILE_SIZE = 2 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

interface ProfileSettingsProps {
    user: IUser
}

type DialogType = 'email' | 'password' | null

export default function ProfileSettings({ user }: ProfileSettingsProps) {
    const [previewImage, setPreviewImage] = useState<string | null>(user.profilePicture)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [activeDialog, setActiveDialog] = useState<DialogType>(null)
    const queryClient = useQueryClient()

    const form = useForm<ProfileSettingDTO>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(profileSettingSchema as any),
        defaultValues: {
            firstName: user.firstName ?? '',
            lastName: user.lastName ?? '',
            phoneNumber: user.phoneNumber ?? '',
            address: user.address ?? '',
            website: user.website ?? '',
            birthday: user.birthday ?? '',
            bio: user.bio ?? '',
        },
    })

    const { mutate: updateProfile, isPending } = useMutation({
        mutationFn: async (values: ProfileSettingDTO) => {
            await userService.updateProfile(values)
            const file = fileInputRef.current?.files?.[0]
            if (file) {
                const formData = new FormData()
                formData.append('profilePicture', file)
                await userService.updatePhoto(formData)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['authUser'] })
            toast.success('Profile updated successfully!', { position: 'top-center' })
            form.reset(form.getValues())
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update profile')
        },
    })

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > MAX_FILE_SIZE) {
            toast.error('Max image size is 2MB.')
            e.target.value = ''
            return
        }
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
            toast.error('Only .jpg, .jpeg, .png and .webp formats are supported.')
            e.target.value = ''
            return
        }

        const reader = new FileReader()
        reader.onloadend = () => setPreviewImage(reader.result as string)
        reader.readAsDataURL(file)
        form.setValue('firstName', form.getValues('firstName'), { shouldDirty: true })
    }

    function onSubmit(values: ProfileSettingDTO) {
        updateProfile(values)
    }

    return (
        <div className="max-w-3xl space-y-8 p-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your profile, login information, and devices
                </p>
            </div>

            <section className="space-y-6">
                <header>
                    <h2 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
                        Account
                    </h2>
                    <Separator className="mt-2" />
                </header>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Avatar + Name */}
                    <div className="flex items-start gap-6">
                        <div
                            className="group relative cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <UserAvatar
                                name={user.fullName ?? user.firstName ?? user.email}
                                image={previewImage}
                                className="h-16 w-16 transition-opacity group-hover:opacity-80"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                                <Camera className="h-5 w-5 text-white drop-shadow-md" />
                            </div>
                            <input
                                type="file"
                                name="profilePicture"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>

                        <div className="flex flex-1 gap-3">
                            <UiFormInput
                                label="First Name"
                                id="firstName"
                                className="bg-secondary/50"
                                error={form.formState.errors.firstName}
                                isSubmitting={isPending}
                                {...form.register('firstName')}
                            />
                            <UiFormInput
                                label="Last Name"
                                id="lastName"
                                className="bg-secondary/50"
                                error={form.formState.errors.lastName}
                                isSubmitting={isPending}
                                {...form.register('lastName')}
                            />
                        </div>
                    </div>

                    {/* Contact + Birthday */}
                    <div className="grid grid-cols-2 gap-4">
                        <UiFormInput
                            label="Phone Number"
                            id="phoneNumber"
                            className="bg-secondary/50"
                            error={form.formState.errors.phoneNumber}
                            isSubmitting={isPending}
                            {...form.register('phoneNumber')}
                        />
                        <div className="space-y-1">
                            <Label htmlFor="birthday">Birthday</Label>
                            <Controller
                                name="birthday"
                                control={form.control}
                                render={({ field }) => {
                                    const selected = field.value ? new Date(field.value) : undefined
                                    return (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    id="birthday"
                                                    variant="outline"
                                                    disabled={isPending}
                                                    className={`bg-secondary/50 w-full justify-start text-left font-normal ${!field.value ? 'text-muted-foreground' : ''}`}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {selected ? format(selected, 'PPP') : 'Pick a date'}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={selected}
                                                    onSelect={(date) =>
                                                        field.onChange(date ? format(date, 'yyyy-MM-dd') : null)
                                                    }
                                                    captionLayout="dropdown"
                                                    startMonth={new Date(1900, 0)}
                                                    endMonth={new Date()}
                                                    autoFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    )
                                }}
                            />
                            {form.formState.errors.birthday && (
                                <span className="text-destructive mt-1 text-xs">
                                    {form.formState.errors.birthday.message}
                                </span>
                            )}
                        </div>
                        <UiFormInput
                            label="Address"
                            id="address"
                            className="bg-secondary/50"
                            error={form.formState.errors.address}
                            isSubmitting={isPending}
                            {...form.register('address')}
                        />
                        <UiFormInput
                            label="Website"
                            id="website"
                            className="bg-secondary/50"
                            error={form.formState.errors.website}
                            isSubmitting={isPending}
                            {...form.register('website')}
                        />
                    </div>

                    {/* Bio */}
                    <div className="space-y-1">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            {...form.register('bio')}
                            id="bio"
                            rows={4}
                            className="bg-secondary/50 resize-none"
                            disabled={isPending}
                            placeholder="Tell us a little about yourself"
                        />
                        {form.formState.errors.bio && (
                            <p className="text-destructive text-xs">
                                {form.formState.errors.bio.message}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-start">
                        <Button type="submit" disabled={isPending}>
                            {isPending ? <Loader2 className="animate-spin" /> : <Save />}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </section>

            {/* Account Security */}
            <section className="space-y-6">
                <h2 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
                    Account security
                </h2>
                <Separator />

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-base">Email</Label>
                        <p className="text-muted-foreground text-sm">{user.email}</p>
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => setActiveDialog('email')}>
                        Manage emails
                    </Button>
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-base">Password (On Progress dev... )</Label>
                        <p className="text-muted-foreground text-sm">
                            Set a password for your account
                        </p>
                    </div>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setActiveDialog('password')}
                    >
                        Manage password
                    </Button>
                </div>
            </section>

            <Dialog
                open={activeDialog !== null}
                onOpenChange={(open) => !open && setActiveDialog(null)}
            >
                <DialogContent className="sm:max-w-sm">
                    {activeDialog === 'email' && (
                        <ManageEmail user={user} onSuccess={() => setActiveDialog(null)} />
                    )}

                    {activeDialog === 'password' && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Change Password</DialogTitle>
                                <DialogDescription>Choose a strong password.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-3 py-4">
                                <Input type="password" placeholder="New Password" />
                                <Input type="password" placeholder="Confirm Password" />
                            </div>
                            <DialogFooter>
                                <Button onClick={() => setActiveDialog(null)}>
                                    Update Password
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
