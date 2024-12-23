<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import type { Movie } from '@/types/Movie'

defineProps({
  movie: {
    type: Object as () => Movie,
    required: true
  }
})

const moviesStore = useMoviesStore()

const handleUpdateFavoriteMovie = async (id: number) => {
  await moviesStore.toggleFavorite(id)
}

defineEmits(['click:movie'])
</script>

<template>
  <Card class="w-full max-w-md mx-auto md:max-w-lg lg:max-w-xl xl:max-w-2xl">
    <CardHeader>
      <CardTitle class="text-lg sm:text-xl md:text-2xl lg:text-3xl">{{ movie.title }}</CardTitle>
      <CardDescription class="text-sm sm:text-base md:text-lg">
        Release Date: {{ movie.release_date }}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="cursor-pointer" @click="$emit('click:movie', movie.id)">
        <img
          v-if="movie.poster_path"
          :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
          :alt="movie.title"
          class="w-full h-auto max-h-96 sm:max-h-[28rem] md:max-h-[32rem] lg:max-h-[36rem] xl:max-h-[40rem] object-cover rounded-lg mb-4 shadow-md"
        />
      </div>
    </CardContent>
    <CardFooter class="flex flex-col items-center space-y-4">
      <Button
        size="icon"
        class="bg-transparent hover:bg-transparent"
        @click.prevent="handleUpdateFavoriteMovie(movie.id)"
      >
        <iconify-icon
          v-if="movie.is_favorite"
          icon="flowbite:star-solid"
          class="text-yellow-500 text-xl sm:text-2xl"
        ></iconify-icon>
        <iconify-icon
          v-else
          icon="flowbite:star-outline"
          class="text-xl sm:text-2xl"
        ></iconify-icon>
      </Button>
      <span class="text-gray-600 text-sm sm:text-base md:text-lg">
        Votes: {{ movie.vote_count }}
      </span>
    </CardFooter>
  </Card>
</template>
