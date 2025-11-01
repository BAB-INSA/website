export interface Player {
    id: number
    username: string
    elo_rating: number
    total_matches: number
    wins: number
    losses: number
    current_win_streak: number
    best_win_streak: number
    created_at: string
    updated_at: string
}

export interface Match {
    id: number
    player1_id: number
    player2_id: number
    winner_id: number | null
    status: 'pending' | 'confirmed' | 'rejected' | 'cancelled'
    created_at: string
    confirmed_at?: string
    updated_at: string
    player1: Player
    player2: Player
    winner: Player | null
}

export interface MatchFilters {
    player_id?: string
    status?: 'pending' | 'confirmed' | 'rejected' | 'cancelled'
    date_from?: string
    date_to?: string
}

export interface MatchesResponse {
    data: Match[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}