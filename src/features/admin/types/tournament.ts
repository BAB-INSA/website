export interface Tournament {
    id: number
    name: string
    slug: string
    type: 'solo' | 'team'
    status: 'opened' | 'ongoing' | 'finished'
    description: string
    nb_participants: number
    nb_matches: number
    created_at: string
    updated_at: string
}

export interface TournamentFilters {
    type?: 'solo' | 'team'
    status?: 'opened' | 'ongoing' | 'finished'
}

export interface TournamentsResponse {
    data: Tournament[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

export interface TournamentFormData {
    name: string
    type: 'solo' | 'team'
    status: 'opened' | 'ongoing' | 'finished'
    description: string
}
