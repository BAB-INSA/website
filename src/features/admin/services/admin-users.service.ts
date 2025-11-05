import apiClient from '@/core/lib/axios'
import type { User } from '@/features/auth/types/auth'
import type { UserFilters } from '@/features/admin/types/admin'

export interface UsersResponse {
    users: User[]
    total: number
    page: number
    limit: number
    totalPages: number
}

export interface UpdateUserRoleRequest {
    roles: string[]
}

export interface UpdateUserStatusRequest {
    enabled: boolean
}

class AdminUsersService {
    async getUsers(filters: UserFilters = {}, page: number = 1, limit: number = 20): Promise<UsersResponse> {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...Object.fromEntries(
                Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
            )
        })
        
        const response = await apiClient.get(`/users?${params}`)
        return response.data
    }

    async getUserById(id: number): Promise<User> {
        const response = await apiClient.get(`/users/${id}`)
        return response.data
    }

    async updateUser(userId: number, data: Partial<User>): Promise<User> {
        const response = await apiClient.patch(`/users/${userId}`, data)
        return response.data
    }

    async deleteUser(userId: number): Promise<void> {
        await apiClient.delete(`/users/${userId}`)
    }
}

export default new AdminUsersService()