import apiClient from '@/core/lib/axios.ts'
import type { Player, EloChartEntry } from '@/features/core/types/player.ts'
import type { EloHistory } from '@/features/core/types/elo-history.ts'
import type { Match } from '@/features/core/types/match.ts'
import type { PaginatedResponse, PaginationParams } from '@/shared/types/pagination.ts'

class PlayerService {
    async getPlayers(params?: PaginationParams): Promise<PaginatedResponse<Player>> {
        const queryParams = new URLSearchParams()
        
        if (params?.page) queryParams.append('page', params.page.toString())
        if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString())
        
        const queryString = queryParams.toString()
        const url = `/players${queryString ? `?${queryString}` : ''}`
        
        const response = await apiClient.get(url)
        return response.data
    }

    async getTopPlayers(limit: number = 100): Promise<Player[]> {
        const response = await apiClient.get(`/players/top?limit=${limit}`)
        return response.data
    }

    async getPlayer(id: number): Promise<Player> {
        const response = await apiClient.get(`/players/${id}`)
        return response.data
    }

    async getPlayerMatches(id: number, params?: PaginationParams): Promise<PaginatedResponse<Match>> {
        const queryParams = new URLSearchParams()
        
        if (params?.page) queryParams.append('page', params.page.toString())
        if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString())
        if (params?.limit) queryParams.append('limit', params.limit.toString())
        if (params?.wins === 1) queryParams.append('wins', '1')
        if (params?.losses === 1) queryParams.append('losses', '1')
        
        const queryString = queryParams.toString()
        const url = `/players/${id}/matches${queryString ? `?${queryString}` : ''}`
        
        const response = await apiClient.get(url)
        return response.data
    }

    async getPlayerEloHistory(id: number, limit?: number): Promise<EloChartEntry[]> {
        const queryParams = new URLSearchParams()
        if (limit) queryParams.append('limit', limit.toString())
        
        const queryString = queryParams.toString()
        const url = `/players/${id}/elo-history${queryString ? `?${queryString}` : ''}`
        
        const response = await apiClient.get<EloHistory[]>(url)
        
        // Transformer les données de l'API pour le format attendu par le composant graphique
        return response.data.map((entry: EloHistory): EloChartEntry => ({
            date: entry.created_at,
            elo: entry.elo_after,
            eloChange: entry.elo_change,
            matchType: 'ranked'
        }))
    }
}

export default new PlayerService()