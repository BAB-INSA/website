<!-- src/features/core/views/player/profile/PlayerMain.vue -->
<template>
  <div class="container mx-auto p-6 space-y-6">
    <div v-if="isLoading" class="text-center">
      <div class="text-lg">Chargement...</div>
    </div>
    
    <div v-else-if="!playerData" class="text-center">
      <div class="text-lg text-red-600">Joueur introuvable</div>
    </div>
    
    <template v-else>
      <Card>
        <CardHeader class="pb-4">
          <div class="flex items-center gap-4">
            <Avatar class="h-16 w-16">
              <AvatarFallback class="text-lg">{{ getPlayerInitials(playerData.username) }}</AvatarFallback>
            </Avatar>
            <div class="flex-1">
              <CardTitle class="text-2xl">{{ playerData.username }}</CardTitle>
              <p class="text-muted-foreground">Membre depuis le {{ formatDate(playerData.created_at) }}</p>
            </div>
            <div class="text-right">
              <div class="text-sm text-muted-foreground">ELO Rating</div>
              <div class="text-2xl font-bold">{{ playerData.elo_rating }}</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs :model-value="activeTab" @update:model-value="handleTabChange" class="w-full">
        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <div class="mt-6">
          <router-view />
        </div>
      </Tabs>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Card, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar'
import PlayerService from '@/features/core/services/player.service'
import type { Player } from '@/features/core/types/player'

const route = useRoute()
const router = useRouter()

const playerId = computed(() => route.params.id as string)
const activeTab = computed(() => {
  const pathSegments = route.path.split('/')
  return pathSegments[pathSegments.length - 1] || 'profile'
})

const playerData = ref<Player | null>(null)
const isLoading = ref(true)

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(async () => {
  try {
    const id = parseInt(playerId.value)
    if (!isNaN(id)) {
      playerData.value = await PlayerService.getPlayer(id)
    }
  } catch (error) {
    console.error('Error fetching player data:', error)
  } finally {
    isLoading.value = false
  }
})

const handleTabChange = (value: string | number) => {
  router.push(`/player/${playerId.value}/${value}`)
}

const getPlayerInitials = (username: string) => {
  return username.slice(0, 2).toUpperCase()
}
</script>