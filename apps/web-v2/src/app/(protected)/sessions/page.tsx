'use client'

import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { Monitor, Smartphone, Tablet, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { sessionService } from '@/features/session/services/session-service'
import type { ISession } from '@/features/user/types/user-type'

function DeviceIcon({ device }: { device: string }) {
    if (device === 'mobile') return <Smartphone className="h-5 w-5" />
    if (device === 'tablet') return <Tablet className="h-5 w-5" />
    return <Monitor className="h-5 w-5" />
}

function SessionCard({ session, onRevoke, isRevoking }: { session: ISession; onRevoke: (id: string) => void; isRevoking: boolean }) {
    return (
        <div className="flex items-start gap-4 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <DeviceIcon device={session.device} />
            </div>
            <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{session.browser || 'Unknown browser'}</span>
                    {session.isCurrent && <Badge variant="success">Current</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{session.os || 'Unknown OS'} · {session.device}</p>
                {session.ipAddress && (
                    <p className="text-xs text-muted-foreground">IP: {session.ipAddress}</p>
                )}
                <p className="text-xs text-muted-foreground">
                    Last active {formatDistanceToNow(new Date(session.lastActiveAt), { addSuffix: true })}
                </p>
            </div>
            {!session.isCurrent && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onRevoke(session.id)}
                    disabled={isRevoking}
                >
                    {isRevoking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                </Button>
            )}
        </div>
    )
}

export default function SessionsPage() {
    const queryClient = useQueryClient()

    const { data: sessions = [], isLoading } = useQuery({
        queryKey: ['sessions'],
        queryFn: () => sessionService.getAll(),
    })

    const { mutate: revoke, isPending: isRevoking } = useMutation({
        mutationFn: (id: string) => sessionService.revoke(id),
        onSuccess: () => {
            toast.success('Session revoked')
            queryClient.invalidateQueries({ queryKey: ['sessions'] })
            queryClient.invalidateQueries({ queryKey: ['me'] })
        },
        onError: (err: Error) => toast.error(err.message),
    })

    const { mutate: revokeOthers, isPending: isRevokingAll } = useMutation({
        mutationFn: () => sessionService.revokeOthers(),
        onSuccess: () => {
            toast.success('All other sessions revoked')
            queryClient.invalidateQueries({ queryKey: ['sessions'] })
            queryClient.invalidateQueries({ queryKey: ['me'] })
        },
        onError: (err: Error) => toast.error(err.message),
    })

    const otherSessions = sessions.filter((s) => !s.isCurrent)

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold">Active Sessions</h1>
                <p className="text-muted-foreground">Manage devices logged into your account</p>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Devices</CardTitle>
                        <CardDescription>{sessions.length} active session{sessions.length !== 1 ? 's' : ''}</CardDescription>
                    </div>
                    {otherSessions.length > 0 && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => revokeOthers()}
                            disabled={isRevokingAll}
                        >
                            {isRevokingAll ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Revoke all others
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex h-32 items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <div className="divide-y">
                            {sessions.map((session, i) => (
                                <SessionCard
                                    key={session.id}
                                    session={session}
                                    onRevoke={revoke}
                                    isRevoking={isRevoking}
                                />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
