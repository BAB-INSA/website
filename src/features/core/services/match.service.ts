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

class MatchService {
    async getMatches(): Promise<Match[]> {
        const response = await apiClient.get('/matches')
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

    async updateMatch(id: number, matchData: MatchUpdateData): Promise<Match> {
        const response = await apiClient.put(`/matches/${id}`, matchData)
        return response.data
    }

    async deleteMatch(id: number): Promise<void> {
        await apiClient.delete(`/matches/${id}`)
    }

    async confirmMatch(id: number): Promise<Match> {
        const response = await apiClient.put(`/matches/${id}/confirm`)
        return response.data
    }

    async autoValidateMatches(): Promise<Match[]> {
        const response = await apiClient.put('/matches/auto-validate')
        return response.data
    }
}

export default new MatchService()