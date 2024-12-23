<script setup lang="ts">
defineProps<{
  message: string
  customCode: number
  details: string
  hint: string | null
  code: string
  statusCode: number
}>()

const error = ref({
  code: 500,
  msg: 'Ops, something went wrong!'
})
</script>

<template>
  <div>
    <iconify-icon icon="lucide:triangle-alert" class="error__icon" />
    <h1 class="error__code">{{ error.code }}</h1>
    <p class="error__msg">{{ error.msg }}</p>
    <div class="error-footer">
      <p class="error-footer__text">You'll find lots to explore on the home page.</p>
      <RouterLink :to="{ name: '/movies/[id]', params: { id: 1 } }">
        <Button class="max-w-36"> Back to homepage </Button>
      </RouterLink>
    </div>
  </div>
</template>
