<script lang="ts" setup>
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev
} from '@/components/ui/pagination'

const props = defineProps<{
  totalPages: number
  currentPage: number
}>()

const emit = defineEmits(['update:currentPage'])

const goToPage = (page: number) => {
  emit('update:currentPage', page)
}
</script>

<template>
  <Pagination
    v-slot="{ page }"
    :total="props.totalPages"
    :sibling-count="1"
    show-edges
    :default-page="props.currentPage"
  >
    <PaginationList v-slot="{ items }" class="flex items-center gap-1">
      <PaginationFirst @click.prevent="goToPage(1)" />
      <PaginationPrev @click.prevent="goToPage(Math.max(props.currentPage - 1, 1))" />

      <template v-for="(item, index) in items" :key="index">
        <PaginationListItem v-if="item.type === 'page'" :value="item.value" as-child>
          <Button
            class="w-10 h-10 p-0"
            :variant="item.value === page ? 'default' : 'outline'"
            @click.prevent="goToPage(item.value)"
          >
            {{ item.value }}
          </Button>
        </PaginationListItem>
        <PaginationEllipsis v-else :index="index" />
      </template>

      <PaginationNext
        @click.prevent="goToPage(Math.min(props.currentPage + 1, props.totalPages || 0))"
      />
      <PaginationLast @click.prevent="goToPage(props.totalPages || 0)" />
    </PaginationList>
  </Pagination>
</template>
