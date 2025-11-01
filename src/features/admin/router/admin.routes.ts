import type { RouteRecordRaw } from 'vue-router'
import AdminUsers from '@/features/admin/views/AdminUsers.vue'
import AdminMatches from '@/features/admin/views/AdminMatches.vue'

export const adminRoutes: RouteRecordRaw[] = [
    {
        path: 'admin/users',
        name: 'AdminUsers',
        component: AdminUsers,
        meta: { 
            requiresAuth: true,
            requiresAdmin: true,
            title: 'Administration - Gestion des utilisateurs'
        }
    },
    {
        path: 'admin/matches',
        name: 'AdminMatches',
        component: AdminMatches,
        meta: { 
            requiresAuth: true,
            requiresAdmin: true,
            title: 'Administration - Gestion des matchs'
        }
    }
    // Ici on pourra ajouter d'autres routes admin plus tard :
    // {
    //     path: 'admin/dashboard',
    //     name: 'AdminDashboard',
    //     component: () => import('@/features/admin/views/AdminDashboard.vue'),
    //     meta: { 
    //         requiresAuth: true,
    //         requiresAdmin: true,
    //         title: 'Administration - Dashboard'
    //     }
    // },
    // {
    //     path: 'admin/logs',
    //     name: 'AdminLogs', 
    //     component: () => import('@/features/admin/views/AdminLogs.vue'),
    //     meta: { 
    //         requiresAuth: true,
    //         requiresAdmin: true,
    //         title: 'Administration - Logs'
    //     }
    // }
]