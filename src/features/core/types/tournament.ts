export type {
    Tournament,
    TournamentFilters,
    TournamentsResponse,
} from '@/features/admin/types/tournament'

import type { Team } from '@/features/core/types/team'
import type { TeamMatch } from '@/features/admin/types/team-match'

export interface TournamentTeamEntry {
    id: number
    team_id: number
    wins: number
    losses: number
    team: Team
}

export interface TournamentTeamsResponse {
    data: TournamentTeamEntry[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

export interface TournamentMatchesResponse {
    data: TeamMatch[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}
