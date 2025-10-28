import type { Player } from './player'

/**
 * Match interface representing a baby foot match
 */
export interface Match {
    id: number
    player1_id: number
    player2_id: number
    winner_id: number
    status: 'pending' | 'confirmed' | 'rejected'
    created_at: string
    confirmed_at?: string
    updated_at: string
    player1?: Player
    player2?: Player
    winner?: Player
}

/**
 * Match creation data interface
 */
export interface MatchCreateData {
    player1_id: number
    player2_id: number
    winner_id: number
    status?: 'pending' | 'confirmed' | 'rejected'
}

/**
 * Match update data interface
 */
export interface MatchUpdateData {
    winner_id?: number
    status?: 'pending' | 'confirmed' | 'rejected'
    confirmed_at?: string
}