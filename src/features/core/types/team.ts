import type { Player } from './player'

export interface Team {
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
  player1: Player
  player2: Player
}