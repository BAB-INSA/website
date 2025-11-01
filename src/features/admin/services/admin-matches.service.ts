import apiClient from '@/core/lib/axios'
import type { Match, MatchFilters, MatchesResponse } from '@/features/admin/types/match'

class AdminMatchesService {
    async getMatches(filters: MatchFilters = {}, page: number = 1, per_page: number = 20): Promise<MatchesResponse> {
        const params = new URLSearchParams({
            page: page.toString(),
            per_page: per_page.toString(),
            ...Object.fromEntries(
                Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
            )
        })
        
        const response = await apiClient.get(`/matches?${params}`)
        return response.data
    }

    async getMatchById(id: number): Promise<Match> {
        const response = await apiClient.get(`/matches/${id}`)
        return response.data
    }

    async updateMatch(matchId: number, data: Partial<Match>): Promise<Match> {
        const response = await apiClient.patch(`/matches/${matchId}`, data)
        return response.data
    }

    async deleteMatch(matchId: number): Promise<void> {
        await apiClient.delete(`/matches/${matchId}`)
    }

    async cancelMatch(matchId: number): Promise<Match> {
        const response = await apiClient.patch(`/matches/${matchId}/cancel`)
        return response.data
    }
}

export default new AdminMatchesService()