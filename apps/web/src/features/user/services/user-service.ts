import { api } from '@/lib/api-factory'

import type { IUserResponse, UpdateUserProfileDTO } from '../types/user-type'

export const userService = {
    getMe: () =>
        api.API<IUserResponse>('/api/user/me', {
            method: 'GET',
            cache: 'no-store',
        }),

    updateProfile: (data: UpdateUserProfileDTO) =>
        api.API<IUserResponse>('/api/user/profile', {
            method: 'PATCH',
            body: JSON.stringify(data),
            cache: 'no-store',
        }),

    updatePhoto: (formData: FormData) =>
        api.API<IUserResponse>('/api/user/photo', {
            method: 'PATCH',
            body: formData,
            cache: 'no-store',
        }),
}
