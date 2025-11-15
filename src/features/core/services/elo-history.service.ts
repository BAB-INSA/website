import apiClient from '@/core/lib/axios.ts'
import type { EloHistory } from '@/features/core/types/elo-history.ts'

class EloHistoryService {
    async getEloHistory(): Promise<EloHistory[]> {
        const response = await apiClient.get('/elo-history')
        return response.data
    }

    async getRecentEloHistory(): Promise<EloHistory[]> {
        const response = await apiClient.get('/elo-history/recent?limit=10')
        return response.data
    }

    async getPlayerEloHistory(playerId: number, matchType?: 'solo' | 'team'): Promise<EloHistory[]> {
        let url = `/elo-history/player/${playerId}`
        if (matchType) {
            url += `?match_type=${matchType}`
        }
        const response = await apiClient.get(url)
        return response.data
    }

    async getMatchEloHistory(matchId: number): Promise<EloHistory[]> {
        const response = await apiClient.get(`/elo-history/match/${matchId}`)
        return response.data
    }
}

export default new EloHistoryService()