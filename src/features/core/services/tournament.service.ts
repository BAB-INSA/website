import apiClient from '@/core/lib/axios.ts'
import type { Tournament, TournamentFilters, TournamentsResponse } from '@/features/admin/types/tournament.ts'
import type { TournamentTeamsResponse, TournamentMatchesResponse } from '@/features/core/types/tournament'

class TournamentService {
    async getOpenedTeamTournaments(): Promise<Tournament[]> {
        const response = await apiClient.get('/tournaments?status=opened&type=team')
        return response.data.data
    }

    async joinTournament(tournamentId: number, teamId: number): Promise<void> {
        await apiClient.post(`/tournaments/${tournamentId}/join`, { team_id: teamId })
    }

    async getTournaments(filters: TournamentFilters = {}, page: number = 1, perPage: number = 10): Promise<TournamentsResponse> {
        const params = new URLSearchParams({
            page: page.toString(),
            per_page: perPage.toString(),
            ...Object.fromEntries(
                Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
            )
        })
        const response = await apiClient.get(`/tournaments?${params}`)
        return response.data
    }

    async getTournamentById(id: number): Promise<Tournament> {
        const response = await apiClient.get(`/tournaments/${id}`)
        return response.data
    }

    async getTournamentTeams(tournamentId: number, page: number = 1, perPage: number = 10): Promise<TournamentTeamsResponse> {
        const params = new URLSearchParams({
            page: page.toString(),
            per_page: perPage.toString()
        })
        const response = await apiClient.get(`/tournaments/${tournamentId}/teams?${params}`)
        return response.data
    }

    async leaveTournament(tournamentId: number, teamId: number): Promise<void> {
        await apiClient.delete(`/tournaments/${tournamentId}/teams/${teamId}`)
    }

    async getTournamentMatches(tournamentId: number, page: number = 1, perPage: number = 10): Promise<TournamentMatchesResponse> {
        const params = new URLSearchParams({
            page: page.toString(),
            per_page: perPage.toString()
        })
        const response = await apiClient.get(`/tournaments/${tournamentId}/matches?${params}`)
        return response.data
    }
}

export default new TournamentService()
