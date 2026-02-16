export interface TeamPlayer {
    id: number
    username: string
    elo_rating: number
    rank: number
    total_matches: number
    wins: number
    losses: number
    team_elo_rating: number
    team_rank: number
    team_total_matches: number
    team_wins: number
    team_losses: number
    created_at: string
    updated_at: string
}

export interface TeamInMatch {
    id: number
    player1_id: number
    player2_id: number
    name: string
    slug: string
    elo_rating: number
    total_matches: number
    wins: number
    losses: number
    created_at: string
    updated_at: string
    player1: TeamPlayer
    player2: TeamPlayer
}

export interface TeamMatch {
    id: number
    team1_id: number
    team2_id: number
    winner_team_id: number | null
    status: 'pending' | 'confirmed' | 'rejected' | 'cancelled'
    created_at: string
    confirmed_at?: string
    updated_at: string
    team1: TeamInMatch
    team2: TeamInMatch
    winner_team: TeamInMatch | null
}

export interface TeamMatchFilters {
    team_id?: string
    player_id?: string
    tournament_id?: string
    status?: 'pending' | 'confirmed' | 'rejected' | 'cancelled'
    date_from?: string
    date_to?: string
}

export interface TeamMatchesResponse {
    data: TeamMatch[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}