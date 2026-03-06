import type { Player } from './player'
import type { Match } from './match'

/**
 * EloHistory interface representing player Elo rating changes
 */
export interface EloHistory {
    id: number
    player_id: number
    match_id: number
    elo_before: number
    elo_after: number
    elo_change: number
    opponent_id?: number
    created_at: string
    updated_at: string
    player?: Player
    match?: Match
    opponent?: Player
}

/**
 * TeamEloHistory interface representing player Elo rating changes in team matches
 */
export interface TeamEloHistory {
    id: number
    player_id: number
    team_match_id: number
    elo_before: number
    elo_after: number
    elo_change: number
    opponent_team_id?: number
    created_at: string
    updated_at: string
}

/**
 * EloHistory creation data interface
 */
export interface EloHistoryCreateData {
    player_id: number
    match_id: number
    elo_before: number
    elo_after: number
    elo_change: number
    opponent_id?: number
}