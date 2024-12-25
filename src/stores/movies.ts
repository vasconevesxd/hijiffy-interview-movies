import { defineStore } from 'pinia'
import type { Movie, MovieQueryParams } from '@/types/Movie'
import { fetchMovies, fetchSimilarMovies, searchMovies } from '@/services/tmdb/tmdbQueries'
import {
  deleteFavoriteMovie,
  fetchFavoriteMovies,
  insertFavoriteMovie,
  type FavoriteMovies
} from '@/services/supabase/supaQueries'
import type { RequestResponse } from '@/types/Request'
import { useMemoize } from '@vueuse/core'

export const useMoviesStore = defineStore('movies', () => {
  const movies = ref<Movie[]>([])
  const favoriteMovieIds = ref<Set<number>>(new Set())
  const currentPage = ref<number | null>(null)
  const totalPages = ref<number | null>(null)
  const isLoading = ref(false)

  const filters = ref<MovieQueryParams>({
    page: 1,
    include_adult: false,
    include_video: false,
    language: 'en',
    sort_by: 'popularity.desc',
    with_keywords: undefined,
    with_genres: undefined
  })

  const handleMoviesData = (
    moviesData: RequestResponse<Movie>,
    favoriteMoviesData: FavoriteMovies
  ) => {
    favoriteMovieIds.value = new Set(favoriteMoviesData.map((fav: FavoriteMovies) => fav.movie_id))
    return moviesData.results.map((movie) => ({
      ...movie,
      is_favorite: favoriteMovieIds.value.has(movie.id)
    }))
  }

  const memoizedFetchMovies = useMemoize(
    async (params: MovieQueryParams) => await fetchMovies(params),
    { getKey: (params) => JSON.stringify(params) }
  )

  const memoizedFetchSimilarMovies = useMemoize(
    async (params: { movie_id: string; language?: string; page?: number }) =>
      await fetchSimilarMovies(params),
    { getKey: (params) => `similar-movies-${params.movie_id}-${params.page}` }
  )

  const memoizedFetchFavoriteMovies = useMemoize(
    async (profileId: string) => await fetchFavoriteMovies(profileId),
    { getKey: (profileId) => `favorite-movies-${profileId}` }
  )

  const fetchMoviesData = async (
    fetchFn: (params: any) => Promise<RequestResponse<Movie>>,
    params: any
  ) => {
    try {
      isLoading.value = true
      const authStore = useAuthStore()

      const [moviesData, favoriteMovies] = await Promise.all([
        fetchFn(params), // eg:. fetchFn(params) => memoizedFetchMovies({ genre: 'action', page: 1 })
        memoizedFetchFavoriteMovies(authStore.profile?.id)
      ])

      const favoriteMoviesData = favoriteMovies.data || []

      // Validate the cache by comparing current movies with fetched movies
      if (
        movies.value.length === 0 ||
        JSON.stringify(movies.value) !== JSON.stringify(moviesData.results)
      ) {
        if (fetchFn === memoizedFetchMovies) {
          memoizedFetchMovies.delete(JSON.stringify(params))
        } else if (fetchFn === memoizedFetchSimilarMovies) {
          memoizedFetchSimilarMovies.delete(`similar-movies-${params.movie_id}-${params.page || 1}`)
        }

        movies.value = handleMoviesData(moviesData, favoriteMoviesData)
        currentPage.value = moviesData.page
        totalPages.value = moviesData.total_pages
      }
    } catch (error: any | Error) {
      useErrorStore().setError({ error, customCode: error?.code })
    } finally {
      isLoading.value = false
    }
  }

  const getMovies = async () => {
    const params = filters.value
    await fetchMoviesData(memoizedFetchMovies, params)
  }

  const getSimilarMovies = async () => {
    const movieStore = useMovieStore()
    const params = {
      movie_id: movieStore.movieId,
      page: currentPage.value || 1
    }
    await fetchMoviesData(memoizedFetchSimilarMovies, params)
  }

  const getSearchedMovies = async (query: string) => {
    try {
      isLoading.value = true
      const authStore = useAuthStore()

      const [moviesData, favoriteMovies] = await Promise.all([
        searchMovies({ ...filters.value, query }),
        fetchFavoriteMovies(authStore.profile?.id)
      ])

      const favoriteMoviesData = favoriteMovies.data || []
      movies.value = handleMoviesData(moviesData, favoriteMoviesData)
      currentPage.value = moviesData.page
      totalPages.value = moviesData.total_pages
    } catch (error: any | Error) {
      useErrorStore().setError({ error, customCode: error?.code })
    } finally {
      isLoading.value = false
    }
  }

  const toggleFavorite = async (movieId: number) => {
    try {
      const authStore = useAuthStore()

      if (favoriteMovieIds.value.has(movieId)) {
        await deleteFavoriteMovie({ profile_id: authStore.profile.id, movie_id: movieId })
        favoriteMovieIds.value.delete(movieId)
      } else {
        await insertFavoriteMovie({ profile_id: authStore.profile.id, movie_id: movieId })
        favoriteMovieIds.value.add(movieId)
      }

      const movie = movies.value.find((m) => m.id === movieId)
      if (movie) {
        movie.is_favorite = favoriteMovieIds.value.has(movieId)
      }
    } catch (error: any | Error) {
      useErrorStore().setError({ error, customCode: error?.code })
    }
  }

  return {
    movies,
    currentPage,
    totalPages,
    isLoading,
    filters,
    getMovies,
    getSimilarMovies,
    toggleFavorite,
    getSearchedMovies
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMoviesStore, import.meta.hot))
}
