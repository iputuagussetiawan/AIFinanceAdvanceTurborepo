'use client'

import * as React from 'react'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer'
import { cn } from '@/lib/utils'

type DrawerDirection = 'top' | 'bottom' | 'left' | 'right'

interface CVDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    direction?: DrawerDirection
    title: string
    description?: string
    children: React.ReactNode
    footer?: React.ReactNode
    className?: string
}

export function CVDrawer({
    open,
    onOpenChange,
    direction = 'bottom',
    title,
    description,
    children,
    footer,
    className,
}: CVDrawerProps) {
    const isVertical = direction === 'right' || direction === 'left'

    const directionStyles = {
        right: 'fixed right-0 top-0 bottom-0 mt-0 h-screen w-full sm:min-w-[25vw] rounded-none border-l z-100',
        left: 'fixed left-0 top-0 bottom-0 mt-0 h-screen w-full sm:w-[450px] rounded-none border-r z-100',
        bottom: 'fixed inset-x-0 bottom-0 mt-24 max-h-[96%] rounded-t-[10px] border-t z-100',
        top: 'fixed inset-x-0 top-0 mb-24 max-h-[96%] rounded-b-[10px] border-b z-100',
    }

    return (
        <Drawer direction={direction} open={open} onOpenChange={onOpenChange}>
            <DrawerContent className={cn(directionStyles[direction], 'outline-none', className)}>
                {!isVertical && (
                    <div className="bg-muted mx-auto mt-4 h-2 w-25 rounded-full border border-white/20 shadow-sm backdrop-blur-md" />
                )}

                <div className="flex h-full flex-col">
                    <DrawerHeader className="sr-only px-6 py-4">
                        <div className="flex items-center justify-between">
                            <DrawerTitle className="text-xl font-bold">{title}</DrawerTitle>
                            <DrawerClose asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </DrawerClose>
                        </div>
                        {description && <DrawerDescription>{description}</DrawerDescription>}
                    </DrawerHeader>
                    <div className="flex-1 overflow-y-auto px-6">{children}</div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
