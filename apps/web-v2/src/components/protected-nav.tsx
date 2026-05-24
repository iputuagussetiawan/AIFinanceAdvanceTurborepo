'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { LogOut, Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuthContext } from '@/providers/auth-provider'
import { authService } from '@/features/auth/services/auth-service'
import { SIGNIN_URL, DASHBOARD_URL, PROFILE_URL, SESSIONS_URL } from '@/lib/constants'

export function ProtectedNav() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const { user } = useAuthContext()
    const { theme, setTheme } = useTheme()

    const { mutate: logout } = useMutation({
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            queryClient.clear()
            router.push(SIGNIN_URL)
        },
        onError: () => toast.error('Logout failed'),
    })

    const initials = [user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join('').toUpperCase() || '?'

    const nextTheme = theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark'
    const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor

    return (
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
            <div className="container mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
                <nav className="flex items-center gap-6">
                    <Link href={DASHBOARD_URL} className="font-semibold">
                        AI Finance
                    </Link>
                    <Link href={DASHBOARD_URL} className="text-sm text-muted-foreground hover:text-foreground">
                        Dashboard
                    </Link>
                    <Link href={SESSIONS_URL} className="text-sm text-muted-foreground hover:text-foreground">
                        Sessions
                    </Link>
                </nav>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setTheme(nextTheme)}>
                        <ThemeIcon className="h-4 w-4" />
                    </Button>
                    <Link href={PROFILE_URL}>
                        <Avatar className="h-8 w-8 cursor-pointer">
                            <AvatarImage src={user?.profilePicture ?? undefined} />
                            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                        </Avatar>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => logout()}>
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </header>
    )
}
