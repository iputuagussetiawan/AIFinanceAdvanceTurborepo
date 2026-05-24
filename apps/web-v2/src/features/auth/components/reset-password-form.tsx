'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { CheckCircle, AlertCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SIGNIN_URL, FORGOT_PASSWORD_URL } from '@/lib/constants'
import { authService } from '../services/auth-service'
import { resetPasswordSchema, type ResetPasswordInput } from '../types/auth-type'

export function ResetPasswordForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const code = searchParams.get('code') ?? ''
    const exp = Number(searchParams.get('exp') ?? '0')
    const [expired, setExpired] = useState(exp > 0 && Date.now() > exp)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (!exp) return
        const remaining = exp - Date.now()
        if (remaining <= 0) { setExpired(true); return }
        const t = setTimeout(() => setExpired(true), remaining)
        return () => clearTimeout(t)
    }, [exp])

    const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { verificationCode: code },
    })

    const { mutate, isPending } = useMutation({
        mutationFn: (data: ResetPasswordInput) => authService.resetPassword(data),
        onSuccess: () => {
            setSuccess(true)
            setTimeout(() => router.push(SIGNIN_URL), 2500)
        },
        onError: (err: Error) => toast.error(err.message),
    })

    if (success) {
        return (
            <div className="flex flex-col items-center gap-4 text-center">
                <CheckCircle className="h-12 w-12 text-green-500" />
                <h2 className="text-xl font-semibold">Password reset!</h2>
                <p className="text-sm text-muted-foreground">Redirecting to sign in...</p>
            </div>
        )
    }

    if (expired || !code) {
        return (
            <div className="flex flex-col items-center gap-4 text-center">
                <AlertCircle className="h-12 w-12 text-destructive" />
                <h2 className="text-xl font-semibold">Link expired</h2>
                <p className="text-sm text-muted-foreground">This reset link has expired or is invalid.</p>
                <Button asChild className="w-full">
                    <Link href={FORGOT_PASSWORD_URL}>Request new link</Link>
                </Button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit((d) => mutate(d))} className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-1 text-center">
                <h1 className="text-2xl font-bold">Reset password</h1>
                <p className="text-sm text-muted-foreground">Enter your new password below</p>
            </div>

            <input type="hidden" {...register('verificationCode')} />

            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="password">New password</Label>
                    <Input id="password" type="password" placeholder="Min 8 characters" disabled={isPending} {...register('password')} />
                    {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="confirmPassword">Confirm password</Label>
                    <Input id="confirmPassword" type="password" placeholder="Repeat password" disabled={isPending} {...register('confirmPassword')} />
                    {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
                </div>

                <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? 'Resetting...' : 'Reset Password'}
                </Button>
            </div>
        </form>
    )
}
