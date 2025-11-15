import apiClient from '@/core/lib/axios.ts'

export interface Stats {
    total_players: number
    total_matches: number
    matches_last_7_days: number
    matches_previous_7_days: number
    total_teams: number
    total_team_matches: number
    team_matches_last_7_days: number
    team_matches_previous_7_days: number
}

class StatsService {
    async getStats(): Promise<Stats> {
        const response = await apiClient.get('/stats')
        return response.data
    }
}

export default new StatsService()