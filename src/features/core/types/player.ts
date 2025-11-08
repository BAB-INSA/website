/**
 * Player interface representing a baby foot player
 */
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
    rank?: number
}

/**
 * ELO History entry for charts (simplified format)
 */
export interface EloChartEntry {
    date: string
    elo: number
    eloChange: number
    matchType?: string
}
