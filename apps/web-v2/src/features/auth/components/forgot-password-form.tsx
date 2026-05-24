'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { MailCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SIGNIN_URL } from '@/lib/constants'
import { authService } from '../services/auth-service'
import { forgotPasswordSchema, type ForgotPasswordInput } from '../types/auth-type'

export function ForgotPasswordForm() {
    const [success, setSuccess] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema),
    })

    const { mutate, isPending } = useMutation({
        mutationFn: (data: ForgotPasswordInput) => authService.forgotPassword(data),
        onSuccess: () => setSuccess(true),
        onError: (err: Error) => toast.error(err.message),
    })

    if (success) {
        return (
            <div className="flex flex-col items-center gap-4 text-center">
                <MailCheck className="h-12 w-12 text-primary" />
                <h2 className="text-xl font-semibold">Check your inbox</h2>
                <p className="text-sm text-muted-foreground">
                    If that email exists we sent a reset link. Check your spam folder too.
                </p>
                <Button variant="outline" asChild className="w-full">
                    <Link href={SIGNIN_URL}>Back to sign in</Link>
                </Button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit((d) => mutate(d))} className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-1 text-center">
                <h1 className="text-2xl font-bold">Forgot password?</h1>
                <p className="text-sm text-muted-foreground">Enter your email and we'll send a reset link</p>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@example.com" disabled={isPending} {...register('email')} />
                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>

                <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? 'Sending...' : 'Send Reset Link'}
                </Button>

                <Button variant="ghost" asChild className="w-full">
                    <Link href={SIGNIN_URL}>Back to sign in</Link>
                </Button>
            </div>
        </form>
    )
}
