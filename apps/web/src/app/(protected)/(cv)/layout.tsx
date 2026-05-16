import { AuthProvider } from '@/providers/auth-provider'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'

import { sessionService } from '@/features/session/services/session-service'
import { AppSidebar } from '@/components/app-sidebar'
import { DynamicBreadcrumbs } from '@/components/dynamic-breadcrumbs'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

// 1. This remains a Server Component (no 'use client' at the top)
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient()

    // 2. Prefetch the auth data on the server
    await queryClient.prefetchQuery({
        queryKey: ['authUser'],
        queryFn: sessionService.get,
    })

    const dehydratedState = dehydrate(queryClient)

    return (
        <HydrationBoundary state={dehydratedState}>
            <AuthProvider>
                <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset>
                        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                            <div className="flex items-center gap-2">
                                <SidebarTrigger className="-ml-1" />
                                <Separator orientation="vertical" className="mr-2 h-4" />
                                <DynamicBreadcrumbs />
                            </div>
                        </header>
                        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
                    </SidebarInset>
                </SidebarProvider>
            </AuthProvider>
        </HydrationBoundary>
    )
}
