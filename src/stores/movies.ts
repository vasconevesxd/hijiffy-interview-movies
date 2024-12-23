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

  const getMovieData = async ({ fetchFunction }: { fetchFunction: () => Promise<any[]> }) => {
    isLoading.value = true

    try {
      const data = await fetchFunction()
      return data
    } catch (error: any | Error) {
      useErrorStore().setError({ error, customCode: error?.code })
    } finally {
      isLoading.value = false
    }
  }

  const handleMoviesData = (
    moviesData: RequestResponse<Movie>,
    favoriteMoviesData: FavoriteMovies
  ) => {
    const favoriteIds = new Set(favoriteMoviesData.map((fav: Movie) => fav.movie_id))
    return moviesData.results.map((movie) => ({
      ...movie,
      is_favorite: favoriteIds.has(movie.id)
    }))
  }

  const getMovies = async () => {
    const authStore = useAuthStore()
    try {
      const [moviesData, favoriteMovies] = await getMovieData({
        fetchFunction: async () =>
          Promise.all([fetchMovies(filters.value), fetchFavoriteMovies(authStore.profile?.id)])
      })

      const favoriteMoviesData = favoriteMovies.data || []
      favoriteMovieIds.value = new Set(favoriteMoviesData.map((fav: Movie) => fav.movie_id))
      movies.value = handleMoviesData(moviesData, favoriteMoviesData)
      currentPage.value = moviesData.page
      totalPages.value = moviesData.total_pages
    } catch (error: any | Error) {
      useErrorStore().setError({ error, customCode: error?.code })
    }
  }

  const getSimilarMovies = async () => {
    const authStore = useAuthStore()
    try {
      const [moviesData, favoriteMovies] = await getMovieData({
        fetchFunction: async () =>
          Promise.all([
            fetchSimilarMovies({ movie_id: useMovieStore().movieId, page: currentPage.value || 1 }),
            fetchFavoriteMovies(authStore.profile?.id)
          ])
      })

      const favoriteMoviesData = favoriteMovies.data || []
      favoriteMovieIds.value = new Set(favoriteMoviesData.map((fav: Movie) => fav.movie_id))
      movies.value = handleMoviesData(moviesData, favoriteMoviesData)
      currentPage.value = moviesData.page
      totalPages.value = moviesData.total_pages
    } catch (error: any | Error) {
      useErrorStore().setError({ error, customCode: error?.code })
    }
  }

  const getSearchedMovies = async (query: string) => {
    const authStore = useAuthStore()
    try {
      const [moviesData, favoriteMovies] = await getMovieData({
        fetchFunction: async () =>
          Promise.all([
            searchMovies({ ...filters.value, query }),
            fetchFavoriteMovies(authStore.profile?.id)
          ])
      })

      const favoriteMoviesData = favoriteMovies.data || []
      favoriteMovieIds.value = new Set(favoriteMoviesData.map((fav: Movie) => fav.movie_id))
      movies.value = handleMoviesData(moviesData, favoriteMoviesData)
      currentPage.value = moviesData.page
      totalPages.value = moviesData.total_pages
    } catch (error: any | Error) {
      useErrorStore().setError({ error, customCode: error?.code })
    }
  }

  const toggleFavorite = async (movieId: number) => {
    const authStore = useAuthStore()
    try {
      const profileId = authStore.profile?.id

      if (favoriteMovieIds.value.has(movieId)) {
        await deleteFavoriteMovie({ profile_id: profileId, movie_id: movieId })
        favoriteMovieIds.value.delete(movieId)
      } else {
        await insertFavoriteMovie({ profile_id: profileId, movie_id: movieId })
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
