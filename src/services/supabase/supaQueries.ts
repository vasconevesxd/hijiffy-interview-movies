import { supabase } from '@/services/supabase/supabaseClient'
import type { QueryData } from '@supabase/supabase-js'

export const fetchProfile = ({ column, value }: { column: string; value: string }) => {
  return supabase.from('profiles').select().eq(column, value).single()
}

export const fetchFavoriteMovies = (profile_id: string) =>
  supabase.from('favorite_movies').select('*').eq('profile_id', profile_id)

export type FavoriteMovies = QueryData<ReturnType<typeof fetchFavoriteMovies>>

export const insertFavoriteMovie = async ({
  profile_id,
  movie_id
}: {
  profile_id: string
  movie_id: number
}) => {
  return supabase.from('favorite_movies').insert([{ profile_id, movie_id }]).select()
}

export const deleteFavoriteMovie = async ({
  profile_id,
  movie_id
}: {
  profile_id: string
  movie_id: number
}) => {
  return supabase
    .from('favorite_movies')
    .delete()
    .eq('profile_id', profile_id)
    .eq('movie_id', movie_id)
}
