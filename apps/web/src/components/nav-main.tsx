'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ChevronRight, type LucideIcon } from 'lucide-react'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar'

type NavItem = {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: { title: string; url: string }[]
}

function isSubItemActive(pathname: string, url: string) {
    return pathname === url || pathname.startsWith(url + '/')
}

function isGroupActive(pathname: string, item: NavItem) {
    if (item.items?.length) {
        return item.items.some((sub) => isSubItemActive(pathname, sub.url))
    }
    return isSubItemActive(pathname, item.url)
}

export function NavMain({ items }: { items: NavItem[] }) {
    const pathname = usePathname()

    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
        Object.fromEntries(items.map((item) => [item.title, isGroupActive(pathname, item)])),
    )

    // Auto-open the matching group on SPA navigation
    useEffect(() => {
        setOpenGroups((prev) => {
            const next = { ...prev }
            items.forEach((item) => {
                if (isGroupActive(pathname, item)) next[item.title] = true
            })
            return next
        })
    }, [pathname])

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const groupActive = isGroupActive(pathname, item)
                    const open = !!openGroups[item.title]

                    return (
                        <Collapsible
                            key={item.title}
                            asChild
                            open={open}
                            onOpenChange={(val) =>
                                setOpenGroups((prev) => ({ ...prev, [item.title]: val }))
                            }
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton tooltip={item.title} isActive={groupActive}>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.items?.map((subItem) => (
                                            <SidebarMenuSubItem key={subItem.title}>
                                                <SidebarMenuSubButton
                                                    asChild
                                                    isActive={isSubItemActive(pathname, subItem.url)}
                                                >
                                                    <Link href={subItem.url}>
                                                        <span>{subItem.title}</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}
