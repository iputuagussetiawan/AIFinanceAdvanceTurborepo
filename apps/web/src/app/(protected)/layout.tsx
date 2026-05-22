import { requireAuth } from '@/lib/require-auth'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { sessionService } from '@/features/session/services/session-service'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const [_, queryClient] = await Promise.all([
        requireAuth('/dashboard'),
        (async () => {
            const client = new QueryClient()
            await client.prefetchQuery({
                queryKey: ['authUser'],
                queryFn: sessionService.get,
            })
            return client
        })(),
    ])

    const dehydratedState = dehydrate(queryClient)

    return (
        <HydrationBoundary state={dehydratedState}>
            {children}
        </HydrationBoundary>
    )
}