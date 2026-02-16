import apiClient from '@/core/lib/axios'
import type { Tournament, TournamentFilters, TournamentsResponse, TournamentFormData } from '@/features/admin/types/tournament'

class AdminTournamentsService {
    async getTournaments(filters: TournamentFilters = {}, page: number = 1, per_page: number = 20): Promise<TournamentsResponse> {
        const params = new URLSearchParams({
            page: page.toString(),
            per_page: per_page.toString(),
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

    async createTournament(data: TournamentFormData): Promise<Tournament> {
        const response = await apiClient.post('/tournaments', data)
        return response.data
    }

    async updateTournament(id: number, data: Partial<TournamentFormData>): Promise<Tournament> {
        const response = await apiClient.put(`/tournaments/${id}`, data)
        return response.data
    }

    async deleteTournament(id: number): Promise<void> {
        await apiClient.delete(`/tournaments/${id}`)
    }
}

export default new AdminTournamentsService()
