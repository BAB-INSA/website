<!-- src/features/core/views/player/profile/PlayerProfile.vue -->
<template>
  <div class="space-y-6">
    <div v-if="isLoading" class="text-center">
      <div class="text-lg">Chargement...</div>
    </div>
    
    <div v-else-if="!playerData" class="text-center">
      <div class="text-lg text-red-600">Joueur introuvable</div>
    </div>
    
    <template v-else>
      <!-- Section Statistiques avec cards individuelles -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Parties jouées -->
        <Card class="text-center">
          <CardContent class="pt-6">
            <div class="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full">
              <Target class="w-6 h-6 text-blue-600" />
            </div>
            <div class="text-3xl font-bold text-blue-600 mb-2">{{ playerData.total_matches }}</div>
            <div class="text-sm font-medium text-muted-foreground">Parties jouées</div>
          </CardContent>
        </Card>

        <!-- Victoires -->
        <Card class="text-center">
          <CardContent class="pt-6">
            <div class="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full">
              <Trophy class="w-6 h-6 text-green-600" />
            </div>
            <div class="text-3xl font-bold text-green-600 mb-2">{{ playerData.wins }}</div>
            <div class="text-sm font-medium text-muted-foreground">Victoires</div>
          </CardContent>
        </Card>

        <!-- Défaites -->
        <Card class="text-center">
          <CardContent class="pt-6">
            <div class="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
              <Target class="w-6 h-6 text-red-600" />
            </div>
            <div class="text-3xl font-bold text-red-600 mb-2">{{ getLosses(playerData) }}</div>
            <div class="text-sm font-medium text-muted-foreground">Défaites</div>
          </CardContent>
        </Card>

        <!-- Taux de victoire -->
        <Card class="text-center">
          <CardContent class="pt-6">
            <div class="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-full">
              <TrendingUp class="w-6 h-6 text-purple-600" />
            </div>
            <div class="text-3xl font-bold text-purple-600 mb-2">{{ winRate }}%</div>
            <div class="text-sm font-medium text-muted-foreground">Taux de victoire</div>
          </CardContent>
        </Card>
      </div>

      <!-- Section Graphique ELO et Derniers Matches -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        <!-- Graphique ELO -->
        <Card>
          <CardContent class="pt-6">
            <EloChart 
              :player-id="parseInt(playerId)" 
              :elo-history="eloHistory"
              :is-loading="isLoadingElo"
            />
          </CardContent>
        </Card>

        <!-- Derniers Matches -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Clock class="w-5 h-5" />
              Derniers matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div v-if="recentMatches.length === 0" class="text-center text-muted-foreground py-8">
              Aucun match trouvé
            </div>
            <div v-else class="space-y-3">
              <div 
                v-for="match in recentMatches" 
                :key="match.id"
                class="flex items-center justify-between p-4 rounded-lg border bg-muted/20"
              >
                <div class="flex items-center gap-3">
                  <User class="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div class="font-medium">
                      vs <PlayerLink v-if="getOpponent(match, playerData.id)" :player="getOpponent(match, playerData.id)!" />
                      <span v-else>Joueur inconnu</span>
                    </div>
                    <div class="text-sm text-muted-foreground">
                      {{ formatDate(match.created_at) }}
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <Badge 
                    :variant="getMatchResult(match, playerData.id) === 'win' ? 'default' : getMatchResult(match, playerData.id) === 'loss' ? 'destructive' : 'secondary'"
                  >
                    {{ getMatchResult(match, playerData.id) === 'win' ? 'Victoire' : getMatchResult(match, playerData.id) === 'loss' ? 'Défaite' : 'En attente' }}
                  </Badge>
                  <Badge v-if="match.status !== 'confirmed'" variant="outline" class="text-xs">
                    {{ match.status === 'pending' ? 'En attente' : 'Rejeté' }}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Trophy, Target, TrendingUp, Clock, User } from 'lucide-vue-next'
import PlayerService from '@/features/core/services/player.service'
import PlayerLink from '@/features/core/components/PlayerLink.vue'
import EloChart from '@/features/core/components/EloChart.vue'
import { usePlayer } from '@/features/core/composables/usePlayer'
import type { Player, EloChartEntry } from '@/features/core/types/player'
import type { Match } from '@/features/core/types/match'

const route = useRoute()
const playerId = computed(() => route.params.id as string)

const playerData = ref<Player | null>(null)
const recentMatches = ref<Match[]>([])
const eloHistory = ref<EloChartEntry[]>([])
const isLoading = ref(true)
const isLoadingElo = ref(true)

const { getWinRate, getLosses } = usePlayer()

const winRate = computed(() => {
  if (!playerData.value) return 0
  return getWinRate(playerData.value)
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getMatchResult = (match: Match, currentPlayerId: number) => {
  if (match.winner_id === currentPlayerId) return 'win'
  if (match.winner_id && match.winner_id !== currentPlayerId) return 'loss'
  return 'pending'
}

const getOpponent = (match: Match, currentPlayerId: number) => {
  return match.player1_id === currentPlayerId ? match.player2 : match.player1
}

const loadPlayerData = async () => {
  const id = parseInt(playerId.value)
  if (isNaN(id)) return
  
  try {
    isLoading.value = true
    const [player, matchesResponse] = await Promise.all([
      PlayerService.getPlayer(id),
      PlayerService.getPlayerMatches(id, { page: 1, pageSize: 5 })
    ])
    playerData.value = player
    recentMatches.value = matchesResponse.data
    
    // Charger l'historique ELO en parallèle
    loadEloHistory(id)
  } catch (error) {
    console.error('Error fetching player data:', error)
  } finally {
    isLoading.value = false
  }
}

// Watcher pour surveiller les changements d'ID dans l'URL
watch(playerId, () => {
  loadPlayerData()
}, { immediate: true })

onMounted(() => {
  // Le watcher avec immediate: true gère déjà le chargement initial
})

const loadEloHistory = async (id: number) => {
  try {
    isLoadingElo.value = true
    const history = await PlayerService.getPlayerEloHistory(id, 30) // 30 derniers matchs
    eloHistory.value = history
  } catch (error) {
    console.error('Error fetching ELO history:', error)
    eloHistory.value = []
  } finally {
    isLoadingElo.value = false
  }
}
</script>