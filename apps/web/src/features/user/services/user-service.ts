import { api } from '@/lib/api-factory'

import type { IUserResponse, UpdateUserProfileDTO } from '../types/user-type'

export const userService = {
    getMe: () =>
        api.API<IUserResponse>('/api/user/current', {
            method: 'GET',
            cache: 'no-store',
        }),

    updateProfile: (data: UpdateUserProfileDTO) =>
        api.API<IUserResponse>('/api/user/update-profile', {
            method: 'PUT',
            body: JSON.stringify(data),
            cache: 'no-store',
        }),

    updatePhoto: (formData: FormData) =>
        api.API<IUserResponse>('/api/user/update-photo', {
            method: 'PUT',
            body: formData,
            cache: 'no-store',
        }),
}
