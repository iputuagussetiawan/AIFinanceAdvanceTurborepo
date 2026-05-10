import { useAuthContext } from '@/providers/auth-provider'
import { Globe, Mail, MapPin, Phone } from 'lucide-react'

import { Skeleton } from '@/components/ui/skeleton'
import { SKELETON_STYLE } from '@/lib/constants'

const ResumeHeader = () => {
    const { isLoading, user } = useAuthContext()
    return (
        <section className="relative">
            <div className="absolute top-0 right-0 left-0 h-7 w-full bg-[#2E2C2F]"></div>
            <div className="flex">
                {/* Name Area */}
                <div className="flex flex-1 flex-col justify-end bg-white p-12 pb-0">
                    <h1 className="text-5xl leading-tight font-black tracking-widest text-[#1a1a1a] uppercase">
                        {isLoading ? (
                            <div className="space-y-2">
                                <Skeleton className={`h-12 w-3/4 ${SKELETON_STYLE}`} />
                                <Skeleton className={`h-12 w-1/2 ${SKELETON_STYLE}`} />
                            </div>
                        ) : (
                            <>
                                <span className="block">{user?.firstName}</span>
                                <span className="block">{user?.lastName}</span>
                            </>
                        )}
                    </h1>
                    <div className="mt-3 text-sm font-semibold tracking-[0.3em] text-[#4a4a4a] uppercase">
                        {isLoading ? (
                            <Skeleton className={`h-5 w-40 ${SKELETON_STYLE}`} />
                        ) : (
                            <p className="text-sm font-semibold tracking-[0.3em] text-[#4a4a4a] uppercase">
                                {user?.jobTitle}
                            </p>
                        )}
                    </div>
                </div>

                {/* Gray Contact Block */}
                <div className="relative flex w-[320px] flex-col justify-center pt-8 pr-16 pl-6 text-white">
                    {/* The Yellow Stripe */}
                    <div className="absolute top-0 right-15 z-0 h-full w-8 bg-[#f1c40f]"></div>

                    <div className="relative z-10 space-y-3">
                        {[
                            { text: user?.address, Icon: MapPin, width: 'w-32' },
                            { text: user?.phoneNumber, Icon: Phone, width: 'w-24' },
                            { text: user?.email, Icon: Mail, width: 'w-40' },
                            { text: user?.website, Icon: Globe, width: 'w-36' },
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center justify-end gap-3">
                                {isLoading ? (
                                    <Skeleton className={`h-4 ${item.width} ${SKELETON_STYLE}`} />
                                ) : (
                                    <span className="text-[12px] text-[#1a1a1a]">{item.text}</span>
                                )}
                                <div className="relative top-1 p-1">
                                    <item.Icon size={14} className="text-[#1a1a1a]" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ResumeHeader
