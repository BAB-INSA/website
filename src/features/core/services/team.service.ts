import apiClient from '@/core/lib/axios'
import type { Team } from '@/features/core/types/team'
import type { PaginatedResponse } from '@/shared/types/pagination'

interface GetTeamsParams {
  page?: number
  pageSize?: number
}

export interface TeamCreateData {
  player1_id: number
  player2_id: number
  name: string
}

class TeamService {
  async getTeams(params: GetTeamsParams = {}): Promise<PaginatedResponse<Team>> {
    const { page = 1, pageSize = 10 } = params
    const response = await apiClient.get('/teams', {
      params: { page, page_size: pageSize }
    })
    return response.data
  }

  async getTeam(id: number): Promise<Team> {
    const response = await apiClient.get(`/teams/${id}`)
    return response.data
  }

  async createTeam(teamData: TeamCreateData): Promise<Team> {
    const response = await apiClient.post('/teams', teamData)
    return response.data
  }
}

export default new TeamService()