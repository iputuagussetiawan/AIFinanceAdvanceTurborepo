export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="grid min-h-svh lg:grid-cols-4">
            <div className="flex flex-col gap-4 p-6 md:p-10 lg:col-span-1">
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-sm">{children}</div>
                </div>
            </div>
            <div className="relative hidden lg:col-span-3 lg:block">
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
                    <h2 className="text-4xl font-bold">AI Finance</h2>
                    <p className="mt-4 text-lg text-neutral-300">Smart financial management powered by AI</p>
                </div>
            </div>
        </div>
    )
}
