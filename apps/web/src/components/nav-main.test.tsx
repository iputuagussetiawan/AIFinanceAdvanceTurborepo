import React from 'react'
import { render, screen } from '@testing-library/react'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Settings2 } from 'lucide-react'

import { NavMain } from './nav-main'

// ── mocks ────────────────────────────────────────────────────────────────────

jest.mock('next/navigation', () => ({ usePathname: jest.fn() }))

jest.mock('next/link', () => {
    const Link = ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    )
    Link.displayName = 'MockLink'
    return Link
})

jest.mock('@/components/ui/collapsible', () => ({
    Collapsible: ({ children, open }: any) => (
        <div data-testid="collapsible" data-open={String(open)}>
            {children}
        </div>
    ),
    CollapsibleTrigger: ({ children }: any) => <div>{children}</div>,
    CollapsibleContent: ({ children }: any) => <div>{children}</div>,
}))

jest.mock('@/components/ui/sidebar', () => ({
    SidebarGroup: ({ children }: any) => <div>{children}</div>,
    SidebarGroupLabel: ({ children }: any) => <span>{children}</span>,
    SidebarMenu: ({ children }: any) => <ul>{children}</ul>,
    SidebarMenuItem: ({ children }: any) => <li>{children}</li>,
    SidebarMenuButton: ({ children, isActive, tooltip }: any) => (
        <button data-testid="menu-btn" data-active={String(isActive)} title={tooltip}>
            {children}
        </button>
    ),
    SidebarMenuSub: ({ children }: any) => <ul>{children}</ul>,
    SidebarMenuSubItem: ({ children }: any) => <li>{children}</li>,
    SidebarMenuSubButton: ({ children, isActive }: any) => (
        <a data-testid="sub-btn" data-active={String(isActive)}>
            {children}
        </a>
    ),
}))

// ── fixtures ──────────────────────────────────────────────────────────────────

const items = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboard,
        items: [
            { title: 'Analytics', url: '/dashboard/analytics' },
            { title: 'Statistics', url: '/dashboard/statistics' },
        ],
    },
    {
        title: 'Settings',
        url: '#',
        icon: Settings2,
        items: [
            { title: 'General', url: '/settings' },
            { title: 'Security', url: '/settings/security' },
        ],
    },
]

const mockPathname = usePathname as jest.MockedFunction<typeof usePathname>

function setup(pathname: string) {
    mockPathname.mockReturnValue(pathname)
    render(<NavMain items={items} />)
}

function subBtn(text: string) {
    return screen.getAllByTestId('sub-btn').find((el) => el.textContent?.includes(text))
}

function menuBtn(text: string) {
    return screen.getAllByTestId('menu-btn').find((el) => el.textContent?.includes(text))
}

// ── tests ─────────────────────────────────────────────────────────────────────

describe('NavMain — active state', () => {
    beforeEach(() => jest.clearAllMocks())

    it('marks matched sub-item as active', () => {
        setup('/dashboard/analytics')
        expect(subBtn('Analytics')).toHaveAttribute('data-active', 'true')
    })

    it('leaves unmatched sub-items inactive', () => {
        setup('/dashboard/analytics')
        expect(subBtn('Statistics')).toHaveAttribute('data-active', 'false')
        expect(subBtn('General')).toHaveAttribute('data-active', 'false')
    })

    it('marks parent group button active when a sub-item matches', () => {
        setup('/dashboard/statistics')
        expect(menuBtn('Dashboard')).toHaveAttribute('data-active', 'true')
        expect(menuBtn('Settings')).toHaveAttribute('data-active', 'false')
    })

    it('opens the collapsible for the active group only', () => {
        setup('/dashboard/analytics')
        const collapsibles = screen.getAllByTestId('collapsible')
        expect(collapsibles[0]).toHaveAttribute('data-open', 'true')  // Dashboard
        expect(collapsibles[1]).toHaveAttribute('data-open', 'false') // Settings
    })

    it('opens Settings collapsible when settings path matches', () => {
        setup('/settings/security')
        const collapsibles = screen.getAllByTestId('collapsible')
        expect(collapsibles[0]).toHaveAttribute('data-open', 'false') // Dashboard
        expect(collapsibles[1]).toHaveAttribute('data-open', 'true')  // Settings
        expect(subBtn('Security')).toHaveAttribute('data-active', 'true')
    })

    it('uses prefix matching — child paths activate parent', () => {
        setup('/settings/security/2fa')
        expect(subBtn('Security')).toHaveAttribute('data-active', 'true')
        expect(menuBtn('Settings')).toHaveAttribute('data-active', 'true')
    })

    it('marks nothing active on an unrelated path', () => {
        setup('/some/unknown/route')
        screen.getAllByTestId('menu-btn').forEach((btn) =>
            expect(btn).toHaveAttribute('data-active', 'false'),
        )
        screen.getAllByTestId('sub-btn').forEach((btn) =>
            expect(btn).toHaveAttribute('data-active', 'false'),
        )
    })
})
