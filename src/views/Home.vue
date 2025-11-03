<template>
  <div class="space-y-8">
    <!-- Welcome Header -->
    <div class="flex flex-col space-y-2">
      <h1 class="text-3xl font-bold tracking-tight">Baby-Foot Dashboard</h1>
      <p class="text-muted-foreground">
        Suivez les statistiques, classements et derniers matchs de baby-foot
      </p>
    </div>

    <!-- Stats Overview -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Joueurs</CardTitle>
          <UserIcon class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.totalPlayers }}</div>
          <p class="text-xs text-muted-foreground">Joueurs enregistrés</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Matchs Totaux</CardTitle>
          <TrophyIcon class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.totalMatches }}</div>
          <p class="text-xs text-muted-foreground">Matchs joués</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Matchs 7 derniers jours</CardTitle>
          <CalendarIcon class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats.weekMatches }}</div>
          <p class="text-xs text-muted-foreground">
            <span class="text-green-600">+{{ stats.weekMatchesChange }}%</span> vs semaine précédente
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">ELO Moyen</CardTitle>
          <TrendingUpIcon class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ Math.round(stats.averageElo) }}</div>
          <p class="text-xs text-muted-foreground">Points ELO</p>
        </CardContent>
      </Card>
    </div>

    <!-- Main Content Grid -->
    <div class="grid gap-6 lg:grid-cols-3">
      <!-- Left Column: Leaderboard -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Top 10 ELO Players -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <TrophyIcon class="h-5 w-5" />
              Top 10 Classement ELO
            </CardTitle>
            <CardDescription>Les meilleurs joueurs par points ELO</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div v-for="(player, index) in topPlayers" :key="player.id" class="flex items-center gap-3">
              <div class="flex h-8 w-8 items-center justify-center rounded-full" 
                   :class="getRankBadgeClass(index)">
                <span class="text-sm font-bold">{{ index + 1 }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <PlayerLink :player="player" class="text-left" />
                <p class="text-sm text-muted-foreground">
                  {{ player.wins }}V / {{ player.losses }}D
                </p>
              </div>
              <div class="text-right">
                <p class="font-bold">{{ Math.round(player.elo_rating) }}</p>
                <p class="text-xs text-muted-foreground">ELO</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Quick Actions -->
        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <Button v-if="authStore.isAuthenticated" @click="openNewMatchModal" class="w-full justify-start" variant="outline">
              <PlusIcon class="mr-2 h-4 w-4" />
              Nouveau Match
            </Button>
            <Button @click="viewAllPlayers" class="w-full justify-start" variant="outline">
              <UsersIcon class="mr-2 h-4 w-4" />
              Voir Tous les Joueurs
            </Button>
          </CardContent>
        </Card>
      </div>

      <!-- Right Column: Recent Activity -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Recent Matches -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <ClockIcon class="h-5 w-5" />
              Derniers Matchs
            </CardTitle>
            <CardDescription>Les {{ recentMatches.length }} derniers matchs joués</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div v-for="match in recentMatches" :key="match.id" 
                   class="flex items-center justify-between p-4 rounded-lg border">
                <div class="flex items-center gap-4">
                  <div class="text-center">
                    <PlayerLink v-if="getPlayer(match.player1_id)" :player="getPlayer(match.player1_id)!" />
                    <span v-else class="font-medium">{{ getPlayerName(match.player1_id) }}</span>
                    <p class="text-sm text-muted-foreground">vs</p>
                    <PlayerLink v-if="getPlayer(match.player2_id)" :player="getPlayer(match.player2_id)!" />
                    <span v-else class="font-medium">{{ getPlayerName(match.player2_id) }}</span>
                  </div>
                  <div class="text-center">
                    <Badge :variant="match.status === 'confirmed' ? 'default' : 'secondary'">
                      {{ getStatusLabel(match.status) }}
                    </Badge>
                  </div>
                </div>
                <div class="text-right">
                  <PlayerLink v-if="getPlayer(match.winner_id)" :player="getPlayer(match.winner_id)!" class="font-bold text-green-600" />
                  <span v-else class="font-bold text-green-600">{{ getPlayerName(match.winner_id) }}</span>
                  <p class="text-sm text-muted-foreground">{{ formatMatchDate(match.created_at) }}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>


        <!-- Recent ELO Changes -->
        <Card>
          <CardHeader>
            <CardTitle>Changements ELO Récents</CardTitle>
            <CardDescription>Dernières variations de points ELO</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              <div v-for="change in recentEloChanges" :key="change.id" 
                   class="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div class="flex items-center gap-3">
                  <PlayerLink v-if="getPlayer(change.player_id)" :player="getPlayer(change.player_id)!" class="font-medium" />
                  <span v-else class="font-medium">{{ getPlayerName(change.player_id) }}</span>
                  <span class="text-sm text-muted-foreground">vs 
                    <PlayerLink v-if="change.opponent_id && getPlayer(change.opponent_id)" :player="getPlayer(change.opponent_id)!" />
                    <span v-else>{{ getPlayerName(change.opponent_id || 0) }}</span>
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <span :class="change.elo_change > 0 ? 'text-green-600' : 'text-red-600'" class="font-bold">
                    {{ change.elo_change > 0 ? '+' : '' }}{{ Math.round(change.elo_change) }}
                  </span>
                  <div class="text-xs text-muted-foreground">
                    {{ Math.round(change.elo_before) }} → {{ Math.round(change.elo_after) }}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Create Match Modal -->
    <CreateMatchModal 
      v-model:open="showCreateMatchModal"
      @match-created="handleMatchCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSEO } from '@/shared/composables/useSEO'
import { useDateFormatter } from '@/shared/composables/useDateFormatter'
import { useAuthStore } from '@/features/auth/stores/auth'
import type { Player, Match, EloHistory } from '@/features/core/types'
import playerService from '@/features/core/services/player.service'
import matchService from '@/features/core/services/match.service'
import eloHistoryService from '@/features/core/services/elo-history.service'
import statsService, { type Stats } from '@/features/core/services/stats.service'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import PlayerLink from '@/features/core/components/PlayerLink.vue'
import CreateMatchModal from '@/features/core/components/CreateMatchModal.vue'
import {
  UserIcon,
  TrophyIcon,
  CalendarIcon,
  TrendingUpIcon,
  ClockIcon,
  PlusIcon,
  UsersIcon,
} from 'lucide-vue-next'

// Router and auth store
const router = useRouter()
const authStore = useAuthStore()

// Reactive data
const topPlayersData = ref<Player[]>([])
const recentMatchesData = ref<Match[]>([])
const recentEloChangesData = ref<EloHistory[]>([])
const statsData = ref<Stats>({ total_players: 0, total_matches: 0, matches_last_7_days: 0, matches_previous_7_days: 0 })
const isLoading = ref(false)
const showCreateMatchModal = ref(false)



// Computed values
const topPlayers = computed(() => {
  return topPlayersData.value.slice(0, 10)
})

const recentMatches = computed(() => {
  return recentMatchesData.value.slice(0, 10)
})

const recentEloChanges = computed(() => {
  return recentEloChangesData.value.slice(0, 8)
})

const stats = computed(() => {
  const totalPlayers = statsData.value.total_players
  const totalMatches = statsData.value.total_matches
  const weekMatches = statsData.value.matches_last_7_days
  
  // Calculer le pourcentage de changement
  const weekMatchesChange = statsData.value.matches_previous_7_days > 0 
    ? Math.round(((weekMatches - statsData.value.matches_previous_7_days) / statsData.value.matches_previous_7_days) * 100)
    : 0
  
  const averageElo = topPlayersData.value.length > 0 
    ? topPlayersData.value.reduce((sum, p) => sum + p.elo_rating, 0) / topPlayersData.value.length 
    : 0

  return {
    totalPlayers,
    totalMatches,
    weekMatches,
    weekMatchesChange,
    averageElo
  }
})

// Utility functions
const { formatRelativeTime } = useDateFormatter()

const getPlayer = (playerId: number): Player | null => {
  return topPlayersData.value.find(p => p.id === playerId) || null
}

const getPlayerName = (playerId: number): string => {
  const player = getPlayer(playerId)
  return player?.username || `Joueur ${playerId}`
}

// Load top players from API
const loadTopPlayers = async () => {
  try {
    isLoading.value = true
    // Use getPlayers with pagination to get all players, then take top 10
    const response = await playerService.getPlayers({ page: 1, pageSize: 50 })
    // Sort by ELO rating descending and take top 10
    topPlayersData.value = response.data
      .sort((a, b) => b.elo_rating - a.elo_rating)
      .slice(0, 10)
  } catch (error) {
    console.error('Error loading top players:', error)
  } finally {
    isLoading.value = false
  }
}

// Load recent matches from API
const loadRecentMatches = async () => {
  try {
    recentMatchesData.value = await matchService.getRecentMatches()
  } catch (error) {
    console.error('Error loading recent matches:', error)
  }
}

// Load recent ELO changes from API
const loadRecentEloChanges = async () => {
  try {
    recentEloChangesData.value = await eloHistoryService.getRecentEloHistory()
  } catch (error) {
    console.error('Error loading recent ELO changes:', error)
  }
}

// Load stats from API
const loadStats = async () => {
  try {
    statsData.value = await statsService.getStats()
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

// Load data on mount
onMounted(() => {
  loadTopPlayers()
  loadRecentMatches()
  loadRecentEloChanges()
  loadStats()
})

const getRankBadgeClass = (index: number): string => {
  if (index === 0) return 'bg-yellow-500 text-yellow-900'
  if (index === 1) return 'bg-gray-400 text-gray-900'
  if (index === 2) return 'bg-amber-600 text-amber-900'
  return 'bg-muted text-muted-foreground'
}

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    'pending': 'En attente',
    'confirmed': 'Confirmé',
    'rejected': 'Rejeté'
  }
  return labels[status] || status
}

const formatMatchDate = (dateStr: string): string => {
  return formatRelativeTime(dateStr)
}

// Action handlers
const openNewMatchModal = () => {
  showCreateMatchModal.value = true
}

const handleMatchCreated = (_match: Match) => {
  // Recharger les données après création d'un match
  loadRecentMatches()
  loadRecentEloChanges()
  loadTopPlayers()
  loadStats()
}


const viewAllPlayers = () => {
  router.push({ name: 'PlayerList' })
}

// SEO Configuration
const seoData = computed(() => ({
  title: 'Dashboard Baby-Foot',
  description: 'Suivez les statistiques, classements et derniers matchs de baby-foot en temps réel.',
  ogType: 'website'
}))

useSEO(seoData)
</script>