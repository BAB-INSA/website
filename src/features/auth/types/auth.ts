/**
 * User interface representing authenticated user data
 */
export type User = {
    id: number
    email: string
    username: string
    slug: string
    enabled: boolean
    roles: string[]
    last_login: string
    nb_connexion: number
    created_at: string
    updated_at: string
}
