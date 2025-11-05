<!-- src/features/core/views/player/profile/PlayerHistory.vue -->
<template>
  <div class="space-y-6">
    <div v-if="isLoading" class="text-center">
      <div class="text-lg">Chargement de l'historique...</div>
    </div>
    
    <template v-else>
      <!-- Statistiques et Filtres -->
      <Card>
        <CardHeader>
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Historique des matchs</CardTitle>
            <div class="flex gap-2">
              <Badge 
                variant="outline" 
                @click="changeFilter('all')" 
                :class="selectedFilter === 'all' ? 'bg-primary text-primary-foreground cursor-pointer' : 'cursor-pointer'"
              >
                Tous
              </Badge>
              <Badge 
                variant="outline" 
                @click="changeFilter('win')" 
                :class="selectedFilter === 'win' ? 'bg-green-100 text-green-800 cursor-pointer' : 'cursor-pointer'"
              >
                Victoires
              </Badge>
              <Badge 
                variant="outline" 
                @click="changeFilter('loss')" 
                :class="selectedFilter === 'loss' ? 'bg-red-100 text-red-800 cursor-pointer' : 'cursor-pointer'"
              >
                Défaites
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div class="text-2xl font-bold text-primary">{{ stats.total }}</div>
              <div class="text-sm text-muted-foreground">Total</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-green-600">{{ stats.wins }}</div>
              <div class="text-sm text-muted-foreground">Victoires</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-red-600">{{ stats.losses }}</div>
              <div class="text-sm text-muted-foreground">Défaites</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-blue-600">{{ stats.winRate }}%</div>
              <div class="text-sm text-muted-foreground">Taux de victoire</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Liste des Matchs -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Clock class="w-5 h-5" />
            Historique des matchs ({{ matches.length }})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="matches.length === 0" class="text-center text-muted-foreground py-8">
            Aucun match trouvé.
          </div>
          <div v-else class="space-y-3">
            <div 
              v-for="match in matches" 
              :key="match.id"
              class="flex items-center justify-between p-4 rounded-lg border bg-muted/20"
            >
              <div class="flex items-center gap-3">
                <User class="w-5 h-5 text-muted-foreground" />
                <div>
                  <div class="font-medium">
                    vs <PlayerLink v-if="getOpponent(match, parseInt(playerId))" :player="getOpponent(match, parseInt(playerId))!" />
                    <span v-else>Joueur inconnu</span>
                  </div>
                  <div class="text-sm text-muted-foreground">
                    {{ formatDate(match.created_at) }}
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <Badge 
                  :variant="getMatchResult(match, parseInt(playerId)) === 'win' ? 'default' : getMatchResult(match, parseInt(playerId)) === 'loss' ? 'destructive' : 'secondary'"
                >
                  {{ getMatchResult(match, parseInt(playerId)) === 'win' ? 'Victoire' : getMatchResult(match, parseInt(playerId)) === 'loss' ? 'Défaite' : 'En attente' }}
                </Badge>
                <Badge v-if="match.status !== 'confirmed'" variant="outline" class="text-xs">
                  {{ match.status === 'pending' ? 'En attente' : 'Rejeté' }}
                </Badge>
              </div>
            </div>
          </div>
          
          <!-- Informations de pagination et bouton Charger plus -->
          <div v-if="paginationInfo && paginationInfo.total > 0" class="mt-6 space-y-4">
            <div class="text-center text-sm text-muted-foreground">
              Affichage de {{ matches.length }} sur {{ paginationInfo.total }} matches
              (Page {{ paginationInfo.page }} sur {{ paginationInfo.totalPages }})
            </div>
            
            <div v-if="currentPage < paginationInfo.totalPages" class="flex justify-center">
              <Button 
                variant="outline" 
                @click="loadMore"
                :disabled="isLoading"
              >
                {{ isLoading ? 'Chargement...' : 'Charger plus de matchs' }}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { User, Clock } from 'lucide-vue-next'
import PlayerService from '@/features/core/services/player.service'
import PlayerLink from '@/features/core/components/PlayerLink.vue'
import type { Match } from '@/features/core/types/match'
import type { PaginatedResponse } from '@/shared/types/pagination'

const route = useRoute()
const playerId = computed(() => route.params.id as string)

const matches = ref<Match[]>([])
const paginationInfo = ref<PaginatedResponse<Match> | null>(null)
const isLoading = ref(true)
const currentPage = ref(1)
const pageSize = ref(10)

const selectedFilter = ref('all')

const getMatchResult = (match: Match, currentPlayerId: number) => {
  if (match.winner_id === currentPlayerId) return 'win'
  if (match.winner_id && match.winner_id !== currentPlayerId) return 'loss'
  return 'pending'
}

const getOpponent = (match: Match, currentPlayerId: number) => {
  return match.player1_id === currentPlayerId ? match.player2 : match.player1
}

const stats = computed(() => {
  const total = matches.value.length
  const wins = matches.value.filter(m => getMatchResult(m, parseInt(playerId.value)) === 'win').length
  const losses = matches.value.filter(m => getMatchResult(m, parseInt(playerId.value)) === 'loss').length
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0

  return { total, wins, losses, winRate }
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadMatches = async (page: number = currentPage.value, append: boolean = false) => {
  try {
    isLoading.value = true
    const id = parseInt(playerId.value)
    if (!isNaN(id)) {
      const params: Record<string, string | number> = {
        page,
        pageSize: pageSize.value
      }
      
      // Ajouter les filtres si nécessaire
      if (selectedFilter.value === 'win') {
        params.wins = 1
      } else if (selectedFilter.value === 'loss') {
        params.losses = 1
      }
      
      const response = await PlayerService.getPlayerMatches(id, params)
      paginationInfo.value = response
      
      if (append) {
        matches.value = [...matches.value, ...response.data]
      } else {
        matches.value = response.data
      }
      
      currentPage.value = page
    }
  } catch (error) {
    console.error('Error fetching match history:', error)
  } finally {
    isLoading.value = false
  }
}

const loadMore = () => {
  if (paginationInfo.value && currentPage.value < paginationInfo.value.totalPages) {
    loadMatches(currentPage.value + 1, true)
  }
}

const changeFilter = (newFilter: string) => {
  selectedFilter.value = newFilter
  currentPage.value = 1
  loadMatches(1, false)
}

onMounted(() => {
  loadMatches(1)
})
</script>