import { api } from '@/lib/api-factory'
import type { ISession } from '@/features/user/types/user-type'

export const sessionService = {
    getAll: () =>
        api.API<ISession[]>('/api/sessions', { cache: 'no-store' }),

    getOthers: () =>
        api.API<ISession[]>('/api/sessions/others', { cache: 'no-store' }),

    revoke: (id: string) =>
        api.API<{ message: string }>(`/api/sessions/${id}`, { method: 'DELETE', cache: 'no-store' }),

    revokeOthers: () =>
        api.API<{ message: string }>('/api/sessions/others', { method: 'DELETE', cache: 'no-store' }),
}
