import type { CustomError, ExtendedPostgrestError, TMDBError } from '@/types/Error'
import type { PostgrestError } from '@supabase/supabase-js'

export const useErrorStore = defineStore('error-store', () => {
  const activeError = ref<null | CustomError | ExtendedPostgrestError>(null)
  const isCustomError = ref(false)

  const setError = ({
    error,
    customCode
  }: {
    error: string | PostgrestError | Error | TMDBError
    customCode?: number
  }) => {
    if (typeof error === 'string') isCustomError.value = true

    if (typeof error === 'string' || error instanceof Error) {
      activeError.value = typeof error === 'string' ? Error(error) : error
      activeError.value.customCode = customCode || 500
      return
    }

    if (typeof error === 'object' && error !== null && 'status_message' in error) {
      const { status_message: message, status_code } = error
      activeError.value = {
        message,
        statusCode: status_code || 500
      } as ExtendedPostgrestError
      return
    }

    activeError.value = error
    activeError.value.statusCode = customCode || 500
  }

  const clearError = () => {
    activeError.value = null
    isCustomError.value = false
  }

  return {
    activeError,
    setError,
    isCustomError,
    clearError
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useErrorStore, import.meta.hot))
}
