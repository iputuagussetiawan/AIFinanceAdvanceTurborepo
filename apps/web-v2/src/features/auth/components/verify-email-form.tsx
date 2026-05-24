'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { CheckCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SIGNIN_URL } from '@/lib/constants'
import { authService } from '../services/auth-service'
import { verifyEmailSchema, type VerifyEmailInput } from '../types/auth-type'

export function VerifyEmailForm() {
    const router = useRouter()
    const [success, setSuccess] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm<VerifyEmailInput>({
        resolver: zodResolver(verifyEmailSchema),
    })

    const { mutate, isPending } = useMutation({
        mutationFn: (data: VerifyEmailInput) => authService.verifyEmail(data),
        onSuccess: () => {
            setSuccess(true)
            setTimeout(() => router.push(SIGNIN_URL), 2000)
        },
        onError: (err: Error) => toast.error(err.message),
    })

    if (success) {
        return (
            <div className="flex flex-col items-center gap-4 text-center">
                <CheckCircle className="h-12 w-12 text-green-500" />
                <h2 className="text-xl font-semibold">Email verified!</h2>
                <p className="text-sm text-muted-foreground">Redirecting to sign in...</p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit((d) => mutate(d))} className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-1 text-center">
                <h1 className="text-2xl font-bold">Verify your email</h1>
                <p className="text-sm text-muted-foreground">Enter the verification code sent to your email</p>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="code">Verification code</Label>
                    <Input id="code" placeholder="Paste your code here" disabled={isPending} {...register('code')} />
                    {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
                </div>

                <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? 'Verifying...' : 'Verify Email'}
                </Button>
            </div>
        </form>
    )
}
