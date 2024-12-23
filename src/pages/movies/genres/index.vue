<script setup lang="ts">
import { useGenresStore } from '@/stores/genres'

usePageStore().pageData.title = 'Movie Genres'

const router = useRouter()
const moviesStore = useMoviesStore()

const genresStore = useGenresStore()
await genresStore.getGenres()

const genres = computed(() => genresStore.genres)

const redirectToMovies = (id: number) => {
  if (id !== undefined) {
    moviesStore.filters.with_genres = id
    router.push({ name: '/movies/[id]', params: { id: 1 } })
  }
}
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
    <Card
      v-for="(genre, index) in genres"
      :key="index"
      class="hover:shadow-lg transition-shadow duration-200 ease-in-out"
    >
      <CardHeader>
        <CardTitle class="text-center text-lg sm:text-xl font-bold">
          {{ genre.name }}
        </CardTitle>
      </CardHeader>
      <CardFooter class="flex justify-center mt-4">
        <Button @click.prevent="redirectToMovies(genre.id)" class="rounded-lg"> View More </Button>
      </CardFooter>
    </Card>
  </div>
</template>
