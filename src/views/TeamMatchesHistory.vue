<template>
    <div class="container mx-auto py-6 space-y-6">
        <div class="flex flex-col gap-4">
            <h1 class="text-3xl font-bold">Historique des Matchs 2v2</h1>
            <p class="text-muted-foreground">Consultez l'historique complet des matchs d'équipes avec filtres et pagination</p>
        </div>

        <!-- Filters -->
        <Card>
            <CardContent class="pt-6">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <Select v-model="selectedTeamId">
                            <SelectTrigger class="w-64">
                                <SelectValue placeholder="Filtrer par équipe..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Toutes les équipes</SelectItem>
                                <SelectItem 
                                    v-for="team in teams" 
                                    :key="team.id" 
                                    :value="team.id.toString()"
                                >
                                    {{ team.name }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        
                        <Select v-model="selectedPlayerId">
                            <SelectTrigger class="w-64">
                                <SelectValue placeholder="Filtrer par joueur..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les joueurs</SelectItem>
                                <SelectItem 
                                    v-for="player in players" 
                                    :key="player.id" 
                                    :value="player.id.toString()"
                                >
                                    {{ player.username }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        
                        <Select v-model="statusFilter">
                            <SelectTrigger class="w-40">
                                <SelectValue placeholder="Statut" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous</SelectItem>
                                <SelectItem value="pending">En attente</SelectItem>
                                <SelectItem value="confirmed">Confirmé</SelectItem>
                                <SelectItem value="rejected">Rejeté</SelectItem>
                            </SelectContent>
                        </Select>
                        
                        <Input
                            v-model="dateFrom"
                            type="date"
                            placeholder="Date de début"
                            class="w-40"
                        />
                        <Input
                            v-model="dateTo"
                            type="date"
                            placeholder="Date de fin"
                            class="w-40"
                        />
                    </div>
                    <div class="flex space-x-2">
                        <Button variant="outline" @click="resetFilters">
                            Réinitialiser
                        </Button>
                        <Button @click="loadTeamMatches">
                            Actualiser
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        <!-- Team Matches List -->
        <Card v-else-if="teamMatches.length > 0">
            <CardHeader>
                <CardTitle>Matchs d'Équipes</CardTitle>
                <p class="text-sm text-muted-foreground">
                    {{ totalMatches }} match(s) trouvé(s)
                </p>
            </CardHeader>
            <CardContent>
                <div class="space-y-4">
                    <div
                        v-for="teamMatch in teamMatches"
                        :key="teamMatch.id"
                        class="flex items-center justify-between p-6 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                        <div class="flex items-center gap-6">
                            <div class="text-sm text-muted-foreground font-medium">
                                #{{ teamMatch.id }}
                            </div>
                            <div class="flex flex-col space-y-3">
                                <!-- Team 1 -->
                                <div class="flex items-center space-x-3">
                                    <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                        T1
                                    </div>
                                    <div>
                                        <div class="font-medium">{{ teamMatch.team1.name }}</div>
                                        <div class="text-sm text-muted-foreground">
                                            {{ teamMatch.team1.player1.username }} & {{ teamMatch.team1.player2.username }}
                                        </div>
                                    </div>
                                    <div v-if="teamMatch.winner_team?.id === teamMatch.team1.id" class="text-yellow-500">
                                        👑
                                    </div>
                                </div>
                                
                                <div class="text-center text-muted-foreground text-sm font-medium">
                                    VS
                                </div>
                                
                                <!-- Team 2 -->
                                <div class="flex items-center space-x-3">
                                    <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                        T2
                                    </div>
                                    <div>
                                        <div class="font-medium">{{ teamMatch.team2.name }}</div>
                                        <div class="text-sm text-muted-foreground">
                                            {{ teamMatch.team2.player1.username }} & {{ teamMatch.team2.player2.username }}
                                        </div>
                                    </div>
                                    <div v-if="teamMatch.winner_team?.id === teamMatch.team2.id" class="text-yellow-500">
                                        👑
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="flex items-center gap-6">
                            <div class="text-right">
                                <div class="text-sm text-muted-foreground">Créé le</div>
                                <div class="font-medium">{{ formatDate(teamMatch.created_at) }}</div>
                                <div v-if="teamMatch.confirmed_at" class="text-xs text-muted-foreground">
                                    Confirmé: {{ formatDate(teamMatch.confirmed_at) }}
                                </div>
                            </div>
                            <Badge
                                :variant="getStatusVariant(teamMatch.status)"
                                class="capitalize"
                            >
                                {{ getStatusLabel(teamMatch.status) }}
                            </Badge>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

        <!-- Empty State -->
        <Card v-else>
            <CardContent class="py-12">
                <div class="text-center">
                    <h3 class="text-lg font-medium mb-2">Aucun match d'équipe trouvé</h3>
                    <p class="text-muted-foreground">Aucun match ne correspond à vos critères de recherche.</p>
                </div>
            </CardContent>
        </Card>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex justify-center">
            <Pagination
                v-slot="{ page }"
                :items-per-page="pageSize"
                :total="totalMatches"
                :default-page="currentPage"
                @update:page="goToPage"
            >
                <PaginationContent v-slot="{ items }">
                    <PaginationPrevious />
                    <template v-for="(item, index) in items" :key="index">
                        <PaginationItem
                            v-if="item.type === 'page'"
                            :value="item.value"
                            :is-active="item.value === page"
                        >
                            {{ item.value }}
                        </PaginationItem>
                        <PaginationEllipsis v-else :index="index" />
                    </template>
                    <PaginationNext />
                </PaginationContent>
            </Pagination>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Badge } from '@/shared/components/ui/badge'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination'
import teamMatchService from '@/features/core/services/team-match.service'
import teamService from '@/features/core/services/team.service'
import playerService from '@/features/core/services/player.service'
import type { TeamMatch } from '@/features/admin/types/team-match'
import type { Team } from '@/features/core/types/team'
import type { Player } from '@/features/core/types/player'

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'pending':
            return 'En attente'
        case 'confirmed':
            return 'Confirmé'
        case 'rejected':
            return 'Rejeté'
        case 'cancelled':
            return 'Annulé'
        default:
            return status
    }
}

const teamMatches = ref<TeamMatch[]>([])
const teams = ref<Team[]>([])
const players = ref<Player[]>([])
const loading = ref(false)
const selectedTeamId = ref('all')
const selectedPlayerId = ref('all')
const statusFilter = ref('all')
const dateFrom = ref('')
const dateTo = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const totalMatches = ref(0)
const pageSize = 10

const filters = computed(() => ({
  team_id: selectedTeamId.value === 'all' ? undefined : parseInt(selectedTeamId.value),
  player_id: selectedPlayerId.value === 'all' ? undefined : parseInt(selectedPlayerId.value),
  status: statusFilter.value === 'all' ? undefined : statusFilter.value as 'pending' | 'confirmed' | 'rejected' | 'cancelled',
  date_from: dateFrom.value || undefined,
  date_to: dateTo.value || undefined
}))

const loadTeamMatches = async () => {
  loading.value = true
  try {
    const response = await teamMatchService.getTeamMatchesPaginated({ ...filters.value, page: currentPage.value, per_page: pageSize })
    teamMatches.value = response.data
    totalPages.value = response.totalPages
    totalMatches.value = response.total
  } catch (error) {
    console.error('Error loading team matches:', error)
  } finally {
    loading.value = false
  }
}

const loadTeams = async () => {
  try {
    const response = await teamService.getTeams()
    teams.value = Array.isArray(response) ? response : response.data
  } catch (error) {
    console.error('Error loading teams:', error)
  }
}

const loadPlayers = async () => {
  try {
    const response = await playerService.getPlayers()
    players.value = Array.isArray(response) ? response : response.data
  } catch (error) {
    console.error('Error loading players:', error)
  }
}

const resetFilters = () => {
  selectedTeamId.value = 'all'
  selectedPlayerId.value = 'all'
  statusFilter.value = 'all'
  dateFrom.value = ''
  dateTo.value = ''
  currentPage.value = 1
  loadTeamMatches()
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    currentPage.value = page
    loadTeamMatches()
  }
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
}

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'confirmed':
            return 'default'
        case 'pending':
            return 'secondary'
        case 'rejected':
            return 'destructive'
        case 'cancelled':
            return 'outline'
        default:
            return 'outline'
    }
}

watch(filters, () => {
  currentPage.value = 1
  loadTeamMatches()
}, { deep: true })

onMounted(() => {
    loadTeams()
    loadPlayers()
    loadTeamMatches()
})
</script>