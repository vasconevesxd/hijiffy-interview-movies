<script setup lang="ts">
import Filters from '@/components/reusables/Filters.vue'
import List from '@/components/reusables/List.vue'
import Pagination from '@/components/reusables/Pagination.vue'

import { useMoviesStore } from '@/stores/movies'
import type { MovieQueryParams } from '@/types/Movie'

const pageStore = usePageStore()

pageStore.pageData.title = 'All Movies'
pageStore.pageData.canGoBack = false

const moviesStore = useMoviesStore()
const { totalPages, isLoading, filters } = storeToRefs(moviesStore)

const router = useRouter()
const route = useRoute()
const errorStore = useErrorStore()

const selectedValue = ref('10')

const getMovies = async (id: number) => {
  moviesStore.filters.page = id
  await moviesStore.getMovies()
}

await getMovies(Number(route.params?.id))

onBeforeRouteUpdate(async (to) => {
  await getMovies(Number(to.params?.id))
})

const currentMovies = computed(() => {
  return moviesStore.movies.slice(0, Number(selectedValue.value))
})

const goToPage = (page: number) => {
  if (page > 0 && totalPages.value && page <= totalPages.value) {
    router.push({ name: '/movies/[id]', params: { id: page } })
  }
}

const handleShowPerPage = async (value: string) => {
  selectedValue.value = value
  // Adjust the displayed movies based on the selected limit
  const totalAvailableMovies = moviesStore.movies.length
  if (totalAvailableMovies < Number(selectedValue.value)) {
    await moviesStore.getMovies()
  }
}

const handleSearch = async (value: string) => {
  if (value && value.length > 0) {
    await moviesStore.getSearchedMovies(value)
  } else {
    moviesStore.filters.page = Number(route.params?.id) || 1
    await moviesStore.getMovies()
  }
}

const handleFilters = async (params: MovieQueryParams) => {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([key, value]) => value !== undefined)
  )

  moviesStore.filters = {
    ...moviesStore.filters,
    ...filteredParams
  }
  await moviesStore.getMovies()
}
</script>
<template>
  <div class="grid grid-cols-1 lg:grid-cols-[1fr_4fr] gap-6 pt-5" v-if="!errorStore.activeError">
    <aside class="lg:col-span-1">
      <Filters
        :page="filters.page || 1"
        :movieFilters="{ ...filters }"
        @update:filters="handleFilters"
        @update:search="handleSearch"
        class="sticky top-5"
      />
    </aside>

    <main class="lg:col-span-1">
      <div v-if="isLoading" class="text-center">Loading...</div>
      <div v-else-if="currentMovies.length === 0" class="text-center text-lg text-gray-500">
        No data available for this page.
      </div>
      <div v-else>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8 w-full max-w-[1400px] mx-auto"
        >
          <List v-for="movie in currentMovies" :key="movie.id" :movie="movie" />
        </div>
        <div class="flex flex-col sm:flex-row justify-center items-center mt-6 gap-6">
          <Pagination :totalPages :currentPage="filters.page || 1" @update:currentPage="goToPage" />
          <Select v-model="selectedValue" @update:modelValue="handleShowPerPage">
            <SelectTrigger class="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </main>
  </div>
</template>
