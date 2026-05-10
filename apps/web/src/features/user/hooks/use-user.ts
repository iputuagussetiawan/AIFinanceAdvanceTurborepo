// File: hooks/use-user.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { userService } from '@/features/user/services/user-service'

export function useUser(initialData?: any) {
    const queryClient = useQueryClient()

    // 1. Fetcher for the current user
    const { data: user, isLoading } = useQuery({
        queryKey: ['user'],
        queryFn: () => userService.getMe(),
        initialData: initialData, // Use the user passed from the Server Component
    })

    // 2. Mutation for the update
    const updateMutation = useMutation({
        mutationFn: (formData: FormData) => userService.update(formData),
        onSuccess: () => {
            toast.success('Profile updated successfully!')
            // 🔄 This triggers a fresh 'getMe' call to update the UI globally
            queryClient.invalidateQueries({ queryKey: ['user'] })
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update profile')
        },
    })

    return {
        user,
        isLoading,
        updateProfile: updateMutation.mutate,
        isUpdating: updateMutation.isPending,
    }
}
