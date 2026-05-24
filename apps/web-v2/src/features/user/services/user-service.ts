import { api } from '@/lib/api-factory'
import type { IUserMe } from '../types/user-type'

export const userService = {
    getMe: () =>
        api.API<IUserMe>('/api/user/me', { cache: 'no-store' }),

    updateProfile: (data: { firstName?: string; lastName?: string }) =>
        api.API<{ message: string; user: Partial<IUserMe> }>('/api/user/profile', {
            method: 'PATCH',
            body: JSON.stringify(data),
            cache: 'no-store',
        }),

    updateAvatar: (file: File) => {
        const formData = new FormData()
        formData.append('profilePicture', file)
        return api.API<{ message: string; user: Partial<IUserMe> }>('/api/user/avatar', {
            method: 'PATCH',
            body: formData,
            cache: 'no-store',
        })
    },

    updatePassword: (data: { currentPassword: string; newPassword: string; confirmPassword: string }) =>
        api.API<{ message: string }>('/api/user/password', {
            method: 'PATCH',
            body: JSON.stringify(data),
            cache: 'no-store',
        }),
}
