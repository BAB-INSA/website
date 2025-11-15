import apiClient from '@/core/lib/axios'

export interface TeamMatchCreateData {
  team1_id: number
  team2_id: number
  winner_team_id: number
}

export interface TeamMatch {
  id: number
  team1_id: number
  team2_id: number
  winner_team_id: number
  status: string
  created_at: string
  updated_at: string
}

class TeamMatchService {
  async createTeamMatch(teamMatchData: TeamMatchCreateData): Promise<TeamMatch> {
    const response = await apiClient.post('/team-matches', teamMatchData)
    return response.data
  }
}

export default new TeamMatchService()