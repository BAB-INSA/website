import { computed } from 'vue'
import { useAuthStore } from '@/features/auth/stores/auth'
import type { AdminPermissions } from '@/features/admin/types/admin'

export function useAdmin() {
    const authStore = useAuthStore()

    const isAdmin = computed(() => {
        return authStore.user?.roles.includes('admin') || authStore.user?.roles.includes('superAdmin') || false
    })

    const isSuperAdmin = computed(() => {
        return authStore.user?.roles.includes('superAdmin') || false
    })

    const hasRole = (role: string) => {
        return authStore.user?.roles.includes(role) || false
    }

    const permissions = computed<AdminPermissions>(() => {
        if (!authStore.user) {
            return {
                canManageUsers: false,
                canViewStats: false,
                canViewLogs: false,
                canManageRoles: false,
                canDeleteUsers: false,
                canViewSystemInfo: false
            }
        }

        const userRoles = authStore.user.roles

        return {
            canManageUsers: userRoles.includes('admin') || userRoles.includes('superAdmin'),
            canViewStats: userRoles.includes('admin') || userRoles.includes('superAdmin'),
            canViewLogs: userRoles.includes('admin') || userRoles.includes('superAdmin'),
            canManageRoles: userRoles.includes('superAdmin'),
            canDeleteUsers: userRoles.includes('superAdmin'),
            canViewSystemInfo: userRoles.includes('admin') || userRoles.includes('superAdmin')
        }
    })

    const checkPermission = (permission: keyof AdminPermissions) => {
        return permissions.value[permission]
    }

    return {
        isAdmin,
        isSuperAdmin,
        hasRole,
        permissions,
        checkPermission
    }
}