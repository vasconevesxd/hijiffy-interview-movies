import { defineStore } from 'pinia'
import type { Genre } from '@/types/Genre'
import { fetchGenres } from '@/services/tmdb/tmdbQueries'

export const useGenresStore = defineStore('genres', () => {
  const genres = ref<Genre[]>([])
  const isLoading = ref(false)

  const getGenres = async () => {
    isLoading.value = true

    try {
      const data = await fetchGenres(useMoviesStore().filters?.language || 'en')
      genres.value = data?.genres || []
    } catch (error: any | Error) {
      useErrorStore().setError({ error, customCode: error?.code })
    } finally {
      isLoading.value = false
    }
  }

  return {
    genres,
    isLoading,
    getGenres
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGenresStore, import.meta.hot))
}
