import apiClient from '@/core/lib/axios'
import type { TeamMatch } from '@/features/admin/types/team-match'

export interface TeamMatchCreateData {
  team1_id: number
  team2_id: number
  winner_team_id: number
}

export interface TeamMatchFilters {
    page?: number
    per_page?: number
    team_id?: number
    player_id?: number
    status?: 'pending' | 'confirmed' | 'rejected' | 'cancelled'
    date_from?: string
    date_to?: string
}

export interface TeamMatchPaginatedResponse {
    data: TeamMatch[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

class TeamMatchService {
  async createTeamMatch(teamMatchData: TeamMatchCreateData): Promise<TeamMatch> {
    const response = await apiClient.post('/team-matches', teamMatchData)
    return response.data
  }

  async getTeamMatchesPaginated(filters: TeamMatchFilters = {}): Promise<TeamMatchPaginatedResponse> {
    const params = new URLSearchParams()
    
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.per_page) params.append('per_page', filters.per_page.toString())
    if (filters.team_id) params.append('team_id', filters.team_id.toString())
    if (filters.player_id) params.append('player_id', filters.player_id.toString())
    if (filters.status) params.append('status', filters.status)
    if (filters.date_from) params.append('date_from', filters.date_from)
    if (filters.date_to) params.append('date_to', filters.date_to)

    const response = await apiClient.get(`/team-matches?${params.toString()}`)
    return response.data
  }
}

export default new TeamMatchService()