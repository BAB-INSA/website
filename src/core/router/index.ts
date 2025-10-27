import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../../features/auth/stores/auth.ts'

// Import layouts
import AppLayout from '@/shared/components/layout/AppLayout.vue'
import ViewLayout from '@/shared/components/layout/ViewLayout.vue'

// Import views
import Home from '../../views/Home.vue'
import Login from '../../features/auth/views/Login.vue'
import Register from '../../features/auth/views/Register.vue'
import Profile from '@/features/auth/views/Profile.vue'
import ForgotPassword from '@/features/auth/views/ForgotPassword.vue'
import ResetPassword from '@/features/auth/views/ResetPassword.vue'
import NotFound from '@/views/NotFound.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: AppLayout,
        children: [
            {
                path: '',
                component: ViewLayout,
                children: [
                    {
                        path: '',
                        name: 'Home',
                        component: Home
                    },
                    {
                        path: 'pwa-settings',
                        name: 'PwaSettings',
                        component: () => import(/* webpackChunkName: "pwa" */ '@/views/PWASettings.vue'),
                        meta: {
                            title: 'PWA Settings',
                            requiresAuth: false
                        }
                    },
                    {
                        path: 'login',
                        name: 'Login',
                        component: Login,
                        meta: { guest: true }
                    },
                    {
                        path: 'register',
                        name: 'Register',
                        component: Register,
                        meta: { guest: true }
                    },
                    {
                        path: 'forgot-password',
                        name: 'ForgotPassword',
                        component: ForgotPassword,
                        meta: { guest: true }
                    },
                    {
                        path: 'reset-password',
                        name: 'ResetPassword',
                        component: ResetPassword,
                        meta: { guest: true }
                    },
                    {
                        path: 'profile',
                        name: 'Profile',
                        component: Profile,
                        meta: { requiresAuth: true }
                    },
                    {
                        path: 'settings',
                        name: 'Settings',
                        component: () => import('@/views/Settings.vue'),
                        meta: {
                            title: 'Settings',
                            description: 'Configure your preferences and account settings'
                        }
                    },
                    {
                        path: 'faq',
                        name: 'Faq',
                        component: () => import(/* webpackChunkName: "faq" */ '@/views/FAQ.vue'),
                        meta: {
                            title: 'FAQ'
                        }
                    },
                    {
                        path: 'rules',
                        name: 'Rules',
                        component: () => import(/* webpackChunkName: "rules" */ '@/views/Rules.vue'),
                        meta: {
                            title: 'Community Rules'
                        }
                    },
                    {
                        path: 'privacy',
                        name: 'Privacy',
                        component: () => import(/* webpackChunkName: "privacy" */ '@/views/Privacy.vue'),
                        meta: {
                            title: 'Privacy Policy'
                        }
                    },
                    {
                        path: 'terms',
                        name: 'Terms',
                        component: () => import(/* webpackChunkName: "terms" */ '@/views/Terms.vue'),
                        meta: {
                            title: 'Terms of Service'
                        }
                    },
                    {
                        path: 'contact',
                        name: 'Contact',
                        component: () => import(/* webpackChunkName: "contact" */ '@/views/Contact.vue'),
                        meta: {
                            title: 'Contact Us'
                        }
                    },
                    {
                        path: 'about',
                        name: 'About',
                        component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue'),
                        meta: {
                            title: 'About Us'
                        }
                    },
                    {
                        path: 'legal',
                        name: 'Legal',
                        component: () => import(/* webpackChunkName: "legal" */ '@/views/Legal.vue'),
                        meta: {
                            title: 'Legal Notice'
                        }
                    },
                    {
                        path: ':pathMatch(.*)*',
                        name: 'NotFound',
                        component: NotFound
                    }
                ]
            }
        ]
    }
]


const router = createRouter({
    history: createWebHistory(),
    routes
})


// Global navigation guard
router.beforeEach((to, _from, next) => {
    const authStore = useAuthStore()

    // Auth checks
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const isGuestOnly = to.matched.some(record => record.meta.guest)

    if (requiresAuth && !authStore.isAuthenticated) {
        next('/login')
    } else if (isGuestOnly && authStore.isAuthenticated) {
        // Redirect authenticated users to home
        next('/')
    } else {
        next()
    }
})


export default router