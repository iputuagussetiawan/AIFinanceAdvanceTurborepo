import { api } from '@/lib/api-factory'

import type { IUserResponse, profileDTO, UpdateUserProfileDTO } from '../types/user-type'

export const userService = {
    // 1. Add the Register function
    getMe: () =>
        api.API<IUserResponse>('/api/user/current', {
            method: 'GET',
            cache: 'no-store', // Always get fresh data
        }),

    update: (formData: FormData) =>
        api.API<IUserResponse>('/api/user/update', {
            method: 'PUT',
            body: formData,
            // We usually don't cache registration attempts
            cache: 'no-store',
        }),

    updateProfile: (data: UpdateUserProfileDTO) =>
        api.API<IUserResponse>('/api/user/update-profile', {
            method: 'PUT',
            body: JSON.stringify(data),
            // We usually don't cache registration attempts
            cache: 'no-store',
        }),
    updatePhotoProfile: (formData: FormData) =>
        api.API<IUserResponse>('/api/user/update-photo', {
            method: 'PUT',
            body: formData,
            // We usually don't cache registration attempts
            cache: 'no-store',
        }),
}
