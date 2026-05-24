import { ProtectedNav } from '@/components/protected-nav'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-svh bg-background">
            <ProtectedNav />
            <main className="container mx-auto max-w-4xl px-4 py-8">{children}</main>
        </div>
    )
}
