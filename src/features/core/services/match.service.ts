import apiClient from '@/core/lib/axios.ts'
import type { Match } from '@/features/core/types/match.ts'

export interface MatchCreateData {
    player1_id: number
    player2_id: number
    winner_id?: number
}

export interface MatchUpdateData {
    winner_id?: number
    status?: 'pending' | 'confirmed' | 'rejected'
}

export interface MatchFilters {
    page?: number
    per_page?: number
    player_id?: number
    status?: 'pending' | 'confirmed' | 'rejected'
    date_from?: string
    date_to?: string
}

export interface MatchPaginatedResponse {
    data: Match[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

class MatchService {
    async getMatches(): Promise<Match[]> {
        const response = await apiClient.get('/matches')
        return response.data
    }

    async getMatchesPaginated(filters: MatchFilters = {}): Promise<MatchPaginatedResponse> {
        const params = new URLSearchParams()
        
        if (filters.page) params.append('page', filters.page.toString())
        if (filters.per_page) params.append('per_page', filters.per_page.toString())
        if (filters.player_id) params.append('player_id', filters.player_id.toString())
        if (filters.status) params.append('status', filters.status)
        if (filters.date_from) params.append('date_from', filters.date_from)
        if (filters.date_to) params.append('date_to', filters.date_to)

        const response = await apiClient.get(`/matches?${params.toString()}`)
        return response.data
    }

    async getRecentMatches(): Promise<Match[]> {
        const response = await apiClient.get('/matches/recent?limit=5')
        return response.data
    }

    async getMatch(id: number): Promise<Match> {
        const response = await apiClient.get(`/matches/${id}`)
        return response.data
    }

    async createMatch(matchData: MatchCreateData): Promise<Match> {
        const response = await apiClient.post('/matches', matchData)
        return response.data
    }
}

export default new MatchService()