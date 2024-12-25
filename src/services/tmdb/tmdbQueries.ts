import { services } from '@/services/services'
import type { Movie, MovieDetails, MovieQueryParams } from '@/types/Movie'
import type { Language } from '@/types/Language'
import type { RequestResponse } from '@/types/Request'
import type { Keyword } from '@/types/Keyword'
import type { Genre } from '@/types/Genre'

export const fetchMovies = async ({
  page = 1,
  include_adult = false,
  include_video = false,
  language = 'en',
  sort_by = 'popularity.desc',
  with_keywords,
  with_genres
}: MovieQueryParams): Promise<RequestResponse<Movie>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    include_adult: include_adult?.toString(),
    include_video: include_video?.toString(),
    language,
    sort_by
  })

  if (with_keywords) {
    params.append('with_keywords', with_keywords)
  }

  if (with_genres) {
    params.append('with_genres', with_genres.toString())
  }

  return services.get<RequestResponse<Movie>>(`/discover/movie?${params.toString()}`)
}

export const fetchLanguages = async (): Promise<Language[]> => {
  return services.get<Language[]>('/configuration/languages')
}

export const fetchKeywords = async ({
  page,
  query
}: {
  page: number
  query: string
}): Promise<RequestResponse<Keyword>> => {
  const params = new URLSearchParams({
    query: query?.toString(),
    page: page.toString()
  })

  return services.get<RequestResponse<Keyword>>(`/search/keyword?${params.toString()}`)
}

export const searchMovies = async ({
  query,
  include_adult = false,
  language = 'en',
  page = 1
}: {
  query: string
  include_adult?: boolean
  language?: string
  page?: number
}): Promise<RequestResponse<Movie>> => {
  const params = new URLSearchParams({
    query,
    include_adult: include_adult.toString(),
    language,
    page: page.toString()
  })

  return services.get<RequestResponse<Movie>>(`/search/movie?${params.toString()}`)
}

export const fetchMovieDetails = async ({
  movie_id,
  language = 'en'
}: {
  movie_id: number
  language?: string
}): Promise<MovieDetails> => {
  return services.get<MovieDetails>(`/movie/${movie_id}?language=${language}`)
}

export const fetchSimilarMovies = async ({
  movie_id,
  language = 'en',
  page = 1
}: {
  movie_id: string
  language?: string
  page?: number
}): Promise<RequestResponse<Movie>> => {
  const params = new URLSearchParams({
    language,
    page: page.toString()
  })

  return services.get<RequestResponse<Movie>>(`/movie/${movie_id}/similar?${params.toString()}`)
}

export const fetchGenres = async ({
  language = 'en'
}: {
  language?: string
}): Promise<{ genres: Genre[] }> => {
  const params = new URLSearchParams({
    language
  })

  return services.get<{ genres: Genre[] }>(`/genre/movie/list?${params.toString()}`)
}
