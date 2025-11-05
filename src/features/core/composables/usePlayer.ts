import type { Player } from '@/features/core/types/player'

export function usePlayer() {
  const getWinRate = (player: Player): number => {
    if (player.total_matches === 0) return 0
    return Math.round((player.wins / player.total_matches) * 100 * 10) / 10
  }

  const getLosses = (player: Player): number => {
    return player.total_matches - player.wins
  }

  const getWinLossRecord = (player: Player): string => {
    return `${player.wins}V / ${getLosses(player)}D`
  }

  const getEloDisplay = (player: Player): string => {
    return Math.round(player.elo_rating).toString()
  }

  return {
    getWinRate,
    getLosses,
    getWinLossRecord,
    getEloDisplay
  }
}