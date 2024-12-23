<script setup lang="ts">
usePageStore().pageData.canGoBack = true

import List from '@/components/reusables/List.vue'
import Pagination from '@/components/reusables/Pagination.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useMovieStore } from '@/stores/movie'

const router = useRouter()
const route = useRoute()
const errorStore = useErrorStore()
const movieStore = useMovieStore()
const moviesStore = useMoviesStore()

const getMovie = async (id: number) => {
  movieStore.movieId = id
  await movieStore.getMovie()
  await moviesStore.getSimilarMovies()
}

await getMovie(Number(route.params?.id))

onBeforeRouteUpdate(async (to) => {
  await getMovie(Number(to.params?.id))
})

const movie = computed(() => movieStore.movie)

const isSimilarMoviesLoading = computed(() => moviesStore.isLoading)
const similarMovies = computed(() => moviesStore.movies)
const totalPages = computed(() => moviesStore.totalPages)
const currentPage = computed(() => moviesStore.currentPage)

const goToPage = async (page: number) => {
  if (page > 0 && totalPages.value && page <= totalPages.value) {
    movieStore.currentPage = page
    await moviesStore.getSimilarMovies()
  }
}
const redirectToMovie = (id: number) => {
  if (id === undefined) return
  router.push({ name: '/movie/[id]', params: { id } })
}
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
<template>
  <div class="bg-gray-900 text-gray-100 min-h-screen" v-if="!errorStore.activeError">
    <header class="relative bg-gray-800">
      <Card class="overflow-hidden">
        <img
          :src="`https://image.tmdb.org/t/p/original${movie.backdrop_path}`"
          alt="Backdrop"
          class="w-full h-64 md:h-96 lg:h-[400px] object-cover opacity-60"
        />
        <div class="absolute inset-0 flex flex-col items-center justify-center space-y-4 px-6">
          <Avatar>
            <AvatarImage
              :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
              alt="Poster"
              class="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40"
            />
            <AvatarFallback>Movie</AvatarFallback>
          </Avatar>
          <h1 class="text-lg sm:text-xl md:text-3xl lg:text-4xl font-bold text-center">
            {{ movie.title || 'Title not available' }}
          </h1>
          <p class="text-sm sm:text-base md:text-lg text-gray-300 italic text-center">
            {{ movie.tagline || 'A captivating story awaits...' }}
          </p>
        </div>
      </Card>
    </header>

    <main class="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <section>
        <Card v-if="movie.overview">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-sm sm:text-base leading-relaxed">
              {{ movie.overview || 'Overview not available.' }}
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Movie Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-if="movie.genres && movie.genres?.length">
                <h3 class="font-medium">Genres</h3>
                <div class="flex flex-wrap">
                  <Badge v-for="genre in movie.genres" :key="genre.id" class="mr-2 mb-2">{{
                    genre.name
                  }}</Badge>
                </div>
              </div>
              <div v-if="movie.release_date">
                <h3 class="font-medium">Release Date</h3>
                <p>{{ movie.release_date || 'Release date not available' }}</p>
              </div>
              <div v-if="movie.runtime">
                <h3 class="font-medium">Runtime</h3>
                <p>{{ movie.runtime ? `${movie.runtime} minutes` : 'Runtime not available' }}</p>
              </div>
              <div v-if="movie.spoken_languages && movie.spoken_languages?.length">
                <h3 class="font-medium">Original Language</h3>
                <p>{{ movie.spoken_languages[0]?.english_name || 'Language not available' }}</p>
              </div>
              <div v-if="movie.production_companies?.length">
                <h3 class="font-medium">Production Companies</h3>
                <ul class="list-disc list-inside text-gray-300">
                  <li v-for="company in movie.production_companies" :key="company.id">
                    {{ company.name }}
                  </li>
                </ul>
              </div>
              <div v-if="movie.production_countries && movie.production_countries?.length">
                <h3 class="font-medium">Country</h3>
                <p>{{ movie.production_countries[0]?.name || 'Country not available' }}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Ratings</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex flex-wrap items-center justify-start space-x-4">
              <Badge class="flex items-center space-x-2">
                <p class="text-lg sm:text-xl md:text-2xl font-bold">
                  {{ movie.vote_average || 'N/A' }}
                </p>
                <p class="text-sm text-gray-400">Average Rating</p>
              </Badge>
              <Badge class="flex items-center space-x-2">
                <p class="text-lg sm:text-xl md:text-2xl font-bold">
                  {{ movie.vote_count || 'N/A' }}
                </p>
                <p class="text-sm text-gray-400">Votes</p>
              </Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      <section class="flex flex-wrap gap-4 mt-8">
        <Button
          v-if="movie.homepage"
          :href="movie.homepage"
          target="_blank"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
        >
          Official Site
        </Button>
        <Button
          v-if="movie.imdb_id"
          :href="`https://www.imdb.com/title/${movie.imdb_id}`"
          target="_blank"
          class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2"
        >
          IMDb Page
        </Button>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Similar Movies</CardTitle>
          </CardHeader>
          <CardContent>
            <div v-if="isSimilarMoviesLoading" class="text-center">Loading...</div>
            <div v-else-if="similarMovies.length === 0" class="text-center text-lg text-gray-500">
              No data available for this page.
            </div>
            <div v-else>
              <div class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-5">
                <List
                  v-for="movie in similarMovies"
                  :key="movie.id"
                  :movie="movie"
                  @click:movie="redirectToMovie(movie.id)"
                />
              </div>
              <div class="flex justify-center mt-6 gap-6">
                <Pagination
                  :totalPages
                  :currentPage="currentPage || 1"
                  @update:currentPage="goToPage"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  </div>
</template>
