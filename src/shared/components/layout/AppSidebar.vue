<script setup lang="ts">
import { Home, Users, HelpCircle, Shield, Eye, FileText, Mail, Heart, Scale, Settings, Trophy } from "lucide-vue-next"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/shared/components/ui/sidebar"
import { useSidebar } from '@/shared/components/ui/sidebar'
import { useRouter } from 'vue-router'
import { watch } from 'vue'
import { useAdmin } from '@/features/admin/composables/useAdmin'

const { setOpenMobile } = useSidebar()
const router = useRouter()
const { isAdmin } = useAdmin()

/**
 * Watch for route changes and close mobile sidebar
 * This handles cases where navigation happens programmatically
 */
watch(() => router.currentRoute.value.path, () => {
    setOpenMobile(false)
})
</script>

<template>
  <Sidebar>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <RouterLink :to="{name: 'Home'}">
                  <Home />
                  <span>Accueil</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <RouterLink :to="{name: 'PlayerList'}">
                  <Users />
                  <span>Liste des Joueurs</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <RouterLink :to="{name: 'PlayerLeaderboard'}">
                  <Trophy />
                  <span>Classement</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <!-- Section Admin -->
      <SidebarGroup v-if="isAdmin" class="mt-6">
        <SidebarGroupLabel>Administration</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <RouterLink :to="{name: 'AdminUsers'}">
                  <Settings />
                  <span>Gestion des utilisateurs</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <RouterLink :to="{name: 'AdminMatches'}">
                  <Trophy />
                  <span>Gestion des matchs</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <!-- Section Liens utiles -->
      <SidebarGroup class="mt-6">
        <SidebarGroupLabel>Liens utiles</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <RouterLink :to="{name: 'Faq'}">
                  <HelpCircle />
                  <span>FAQ</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <RouterLink :to="{name: 'Rules'}">
                  <Shield />
                  <span>Rules</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <RouterLink :to="{name: 'Privacy'}">
                  <Eye />
                  <span>Privacy</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <RouterLink :to="{name: 'Terms'}">
                  <FileText />
                  <span>Terms</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <RouterLink :to="{name: 'Contact'}">
                  <Mail />
                  <span>Contact</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <RouterLink :to="{name: 'About'}">
                  <Heart />
                  <span>About</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <RouterLink :to="{name: 'Legal'}">
                  <Scale />
                  <span>Legal</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>
