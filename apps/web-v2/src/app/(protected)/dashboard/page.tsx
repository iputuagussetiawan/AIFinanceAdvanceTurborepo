'use client'

import Link from 'next/link'
import { Monitor, User, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuthContext } from '@/providers/auth-provider'
import { PROFILE_URL, SESSIONS_URL } from '@/lib/constants'

export default function DashboardPage() {
    const { user, isLoading } = useAuthContext()

    if (isLoading) {
        return <div className="flex h-64 items-center justify-center text-muted-foreground">Loading...</div>
    }

    const currentSession = user?.sessions.find((s) => s.isCurrent)
    const otherCount = (user?.sessions.length ?? 0) - 1

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold">
                    Welcome, {user?.firstName ?? 'there'} 👋
                </h1>
                <p className="text-muted-foreground">{user?.email}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Role</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <Badge variant="secondary" className="capitalize">{user?.role ?? 'none'}</Badge>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Current device</CardTitle>
                        <Monitor className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <p className="text-sm font-medium">{currentSession?.browser ?? '—'}</p>
                        <p className="text-xs text-muted-foreground">{currentSession?.os}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Other sessions</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{otherCount > 0 ? otherCount : 0}</p>
                        <p className="text-xs text-muted-foreground">active on other devices</p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex gap-3">
                <Button asChild variant="outline">
                    <Link href={PROFILE_URL}>Edit profile</Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href={SESSIONS_URL}>Manage sessions</Link>
                </Button>
            </div>
        </div>
    )
}
