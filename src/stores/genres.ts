import { defineStore } from 'pinia'
import type { Genre } from '@/types/Genre'
import { fetchGenres } from '@/services/tmdb/tmdbQueries'
import { useMemoize } from '@vueuse/core'

export const useGenresStore = defineStore('genres', () => {
  const genres = ref<Genre[]>([])
  const isLoading = ref(false)

  const memoizedFetchGenres = useMemoize(async (language: string) => await fetchGenres(language), {
    getKey: (language) => `genres-${language}`
  })

  const validateCache = async (language: string) => {
    try {
      const latestGenresData = await memoizedFetchGenres(language)

      if (JSON.stringify(genres.value) !== JSON.stringify(latestGenresData.genres)) {
        memoizedFetchGenres.delete(`genres-${language}`)

        genres.value = latestGenresData.genres || []
      }
    } catch (error: any | Error) {
      useErrorStore().setError({ error, customCode: error?.code })
    }
  }

  const getGenres = async () => {
    isLoading.value = true

    try {
      const moviesStore = useMoviesStore()
      const { filters } = storeToRefs(moviesStore)

      const language = filters.value.language ?? 'en'

      await validateCache(language)
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
