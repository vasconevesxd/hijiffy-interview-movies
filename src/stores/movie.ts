import { defineStore } from 'pinia'
import type { MovieDetails } from '@/types/Movie'
import { fetchMovieDetails } from '@/services/tmdb/tmdbQueries'

export const useMovieStore = defineStore('movie', () => {
  const movie = ref<MovieDetails | undefined>(undefined)
  const movieId = ref<number | undefined>(undefined)
  const isLoading = ref(false)

  const getMovie = async () => {
    if (!movieId.value) {
      return
    }

    isLoading.value = true

    try {
      const data = await fetchMovieDetails({ movie_id: movieId.value })
      movie.value = data
    } catch (error: any | Error) {
      useErrorStore().setError({ error, customCode: error?.code })
    } finally {
      isLoading.value = false
    }
  }

  return {
    movie,
    movieId,
    isLoading,
    getMovie
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMovieStore, import.meta.hot))
}
