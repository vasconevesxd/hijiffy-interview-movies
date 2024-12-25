import { defineStore } from 'pinia'
import type { MovieDetails } from '@/types/Movie'
import { useMemoize } from '@vueuse/core'
import { fetchMovieDetails } from '@/services/tmdb/tmdbQueries'

export const useMovieStore = defineStore('movie', () => {
  const movie = ref<MovieDetails | undefined>(undefined)
  const movieId = ref<number | undefined>(undefined)
  const isLoading = ref(false)

  const memoizedFetchMovieDetails = useMemoize(
    async (id: number) => await fetchMovieDetails({ movie_id: id }),
    { getKey: (id) => `movie-details-${id}` }
  )

  const validateCache = async (id: number) => {
    try {
      const latestMovieDetails = await memoizedFetchMovieDetails(id)

      if (JSON.stringify(movie.value) !== JSON.stringify(latestMovieDetails)) {
        movie.value = latestMovieDetails
      }
    } catch (error: any | Error) {
      useErrorStore().setError({ error, customCode: error?.code })
    }
  }

  const getMovie = async () => {
    if (!movieId.value || typeof movieId.value !== 'number' || isNaN(movieId.value)) {
      useErrorStore().setError({
        error: new Error('Movie ID is undefined. Unable to fetch movie details.')
      })
      return
    }

    try {
      isLoading.value = true

      await validateCache(movieId.value)
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
