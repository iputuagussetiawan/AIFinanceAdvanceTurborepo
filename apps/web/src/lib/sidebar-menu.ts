import {
    AudioWaveform,
    BookOpen,
    Bot,
    Briefcase,
    Command,
    FileUser,
    Frame,
    GalleryVerticalEnd,
    LayoutDashboard,
    Map,
    PieChart,
    Search,
    Settings2,
    SquareTerminal,
} from 'lucide-react'

export const getSidebarData = (roleName?: string) => {
    const isAdmin = roleName === 'ADMIN'
    const isJobSeeker = roleName === 'JOBSEEKER'

    return {
        teams: [{ name: 'Acme Inc', logo: GalleryVerticalEnd, plan: 'Enterprise' }],
        // --- MAIN NAVIGATION ---
        navMain: [
            {
                title: 'Dashboard',
                url: '/dashboard',
                icon: LayoutDashboard,
                isActive: true,
                items: [
                    {
                        title: 'Analytics',
                        url: '/dashboard/analytics',
                    },
                    {
                        title: 'Data Statistics',
                        url: '/dashboard/statistics',
                    },
                ],
            },
            // Job Seeker Specific Menu
            ...(isJobSeeker
                ? [
                      {
                          title: 'My Resume',
                          url: '#',
                          icon: FileUser,
                          items: [
                              { title: 'View CV', url: '/cv/preview' },
                              { title: 'Manage CV', url: '/cv/manage' },
                          ],
                      },
                      {
                          title: 'Job Search',
                          url: '#',
                          icon: Search,
                          items: [
                              { title: 'Browse Jobs', url: '/jobs' },
                              { title: 'Applied Jobs', url: '/jobs/applied' },
                              { title: 'Saved', url: '/jobs/saved' },
                          ],
                      },
                      {
                          title: 'My Career',
                          url: '#',
                          icon: Briefcase, // Or 'TrendingUp' / 'UserCheck'
                          items: [
                              {
                                  title: 'Career Path',
                                  url: '/career/path',
                              },
                              {
                                  title: 'Skill Up',
                                  url: '/career/skills',
                              },
                              {
                                  title: 'Experience Up',
                                  url: '/career/Experience',
                              },
                              {
                                  title: 'Target Achieved', // Fixed spelling from 'Achive'
                                  url: '/career/targets',
                              },
                          ],
                      },
                  ]
                : []),
            // Admin Specific Menu
            ...(isAdmin
                ? [
                      {
                          title: 'Management',
                          url: '#',
                          icon: Briefcase,
                          items: [
                              { title: 'All Users', url: '/admin/users' },
                              { title: 'Job Listings', url: '/admin/jobs' },
                              { title: 'Reports', url: '/admin/reports' },
                          ],
                      },
                  ]
                : []),
            {
                title: 'Settings',
                url: '#',
                icon: Settings2,
                items: [
                    { title: 'General', url: '/settings' },
                    { title: 'Security', url: '/settings/security' },
                    ...(isAdmin ? [{ title: 'System Limits', url: '/settings/limits' }] : []),
                ],
            },
        ],
        // --- PROJECT SECTION ---
        projects: [
            { name: 'Documentation', url: '/docs', icon: BookOpen },
            ...(isAdmin ? [{ name: 'Sales & Marketing', url: '#', icon: PieChart }] : []),
        ],
    }
}
