<script lang="ts" setup>
import { Button } from '@/components/ui/button'
const router = useRouter()

const goToMovies = () => {
  router.push({ name: '/movies/[id]', params: { id: 1 } })
}
</script>

<template>
  <div class="flex flex-col items-center justify-center px-4">
    <div class="text-center">
      <h1 class="text-4xl md:text-6xl font-bold mb-4">Welcome to Hijiffy Movies</h1>
      <p class="text-lg md:text-xl mb-6">
        Discover your favorite movies and explore new ones with just a click!
      </p>
      <Button @click.prevent="goToMovies" class="px-6 py-3 font-semibold rounded-lg transition">
        See All Movies
      </Button>
    </div>
  </div>
</template>
