'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { CheckCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SIGNIN_URL, VERIFY_EMAIL_URL } from '@/lib/constants'
import { authService } from '../services/auth-service'
import { signupSchema, type SignupInput } from '../types/auth-type'

export function SignUpForm() {
    const [success, setSuccess] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupInput>({ resolver: zodResolver(signupSchema) })

    const { mutate, isPending } = useMutation({
        mutationFn: (data: SignupInput) => authService.register(data),
        onSuccess: () => setSuccess(true),
        onError: (err: Error) => toast.error(err.message),
    })

    if (success) {
        return (
            <div className="flex flex-col items-center gap-4 text-center">
                <CheckCircle className="h-12 w-12 text-green-500" />
                <h2 className="text-xl font-semibold">Check your email</h2>
                <p className="text-sm text-muted-foreground">
                    We sent a verification link to your email. Click it to activate your account.
                </p>
                <Button variant="outline" asChild className="w-full">
                    <Link href={VERIFY_EMAIL_URL}>Enter verification code</Link>
                </Button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit((d) => mutate(d))} className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-1 text-center">
                <h1 className="text-2xl font-bold">Create account</h1>
                <p className="text-sm text-muted-foreground">Fill in your details to get started</p>
            </div>

            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="firstName">First name</Label>
                        <Input id="firstName" placeholder="John" disabled={isPending} {...register('firstName')} />
                        {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="lastName">Last name</Label>
                        <Input id="lastName" placeholder="Doe" disabled={isPending} {...register('lastName')} />
                        {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@example.com" disabled={isPending} {...register('email')} />
                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="Min 8 characters" disabled={isPending} {...register('password')} />
                    {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="confirmPassword">Confirm password</Label>
                    <Input id="confirmPassword" type="password" placeholder="Repeat password" disabled={isPending} {...register('confirmPassword')} />
                    {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
                </div>

                <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? 'Creating account...' : 'Create Account'}
                </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href={SIGNIN_URL} className="font-medium text-foreground hover:underline">
                    Sign in
                </Link>
            </p>
        </form>
    )
}
