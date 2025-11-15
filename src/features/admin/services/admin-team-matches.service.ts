import apiClient from '@/core/lib/axios'
import type { TeamMatch, TeamMatchFilters, TeamMatchesResponse } from '@/features/admin/types/team-match'

class AdminTeamMatchesService {
    async getTeamMatches(filters: TeamMatchFilters = {}, page: number = 1, per_page: number = 20): Promise<TeamMatchesResponse> {
        const params = new URLSearchParams({
            page: page.toString(),
            per_page: per_page.toString(),
            ...Object.fromEntries(
                Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '' && value !== 'all')
            )
        })
        
        const response = await apiClient.get(`/team-matches?${params}`)
        return response.data
    }

    async getTeamMatchById(id: number): Promise<TeamMatch> {
        const response = await apiClient.get(`/team-matches/${id}`)
        return response.data
    }

    async updateTeamMatch(matchId: number, data: Partial<TeamMatch>): Promise<TeamMatch> {
        const response = await apiClient.patch(`/team-matches/${matchId}`, data)
        return response.data
    }

    async deleteTeamMatch(matchId: number): Promise<void> {
        await apiClient.delete(`/team-matches/${matchId}`)
    }

    async cancelTeamMatch(matchId: number): Promise<TeamMatch> {
        const response = await apiClient.patch(`/team-matches/${matchId}/cancel`)
        return response.data
    }
}

export default new AdminTeamMatchesService()