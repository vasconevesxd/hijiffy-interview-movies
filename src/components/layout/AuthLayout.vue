<script setup lang="ts">
import { Button } from '@/components/ui/button'
const { pageData } = storeToRefs(usePageStore())
const router = useRouter()
const errorStore = useErrorStore()
</script>

<template>
  <div class="flex flex-col">
    <TopNavbar />

    <main class="flex flex-col flex-1 gap-4 p-4 lg:gap-6 lg:p-6 lg:mx-52 mx-16 transition-[margin]">
      <div v-if="!errorStore.activeError">
        <Button v-if="pageData.canGoBack" variant="outline" class="mb-6" @click="router.go(-1)">
          <iconify-icon icon="lucide:arrow-left" />
          <span> Go Back</span>
        </Button>
        <h1
          class="text-lg font-semibold md:text-2xl"
          v-if="pageData.title && pageData.title.length > 0"
        >
          {{ pageData.title }}
        </h1>
      </div>
      <slot />
    </main>
  </div>
</template>
