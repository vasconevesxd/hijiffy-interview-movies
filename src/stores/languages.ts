import { defineStore } from 'pinia'
import { useMemoize } from '@vueuse/core'
import { fetchLanguages } from '@/services/tmdb/tmdbQueries'
import type { Language } from '@/types/Language'

export const useLanguagesStore = defineStore('languages', () => {
  const languages = ref<Language[]>([])
  const isLoading = ref(false)

  const memoizedFetchLanguages = useMemoize(async (key: string) => await fetchLanguages())

  const validateCache = async () => {
    if (languages.value.length) {
      try {
        const latestLanguagesData = await memoizedFetchLanguages('languages')

        if (JSON.stringify(languages.value) !== JSON.stringify(latestLanguagesData)) {
          memoizedFetchLanguages.delete('languages')

          languages.value = latestLanguagesData || []
        }
      } catch (error: any | Error) {
        useErrorStore().setError({ error, customCode: error?.code })
      }
    }
  }

  const getLanguages = async () => {
    isLoading.value = true

    try {
      const data = await memoizedFetchLanguages('languages')
      languages.value = data

      await validateCache()
    } catch (error: any | Error) {
      useErrorStore().setError({ error, customCode: error?.code })
    } finally {
      isLoading.value = false
    }
  }

  return {
    languages,
    isLoading,
    getLanguages
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLanguagesStore, import.meta.hot))
}
