<script lang="ts" setup>
import { refDebounced, watchDebounced } from '@vueuse/core'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { fetchLanguages } from '@/services/tmdb/tmdbQueries'
import type { Language } from '@/types/Language'
import type { MovieQueryParams } from '@/types/Movie'
import type { Keyword } from '@/types/Keyword'

import { fetchKeywords } from '@/services/tmdb/tmdbQueries'

import { cn } from '@/lib/utils'

const props = defineProps<{
  movieFilters: MovieQueryParams
  page: number
}>()

const keywordFilter = ref<string | undefined>(undefined)
const debounceKeywordFilter = refDebounced(keywordFilter, 1000, { maxWait: 2000 })

const search = ref<string | undefined>(undefined)
const debounceSearch = refDebounced(search, 1000, { maxWait: 2000 })

const filters = ref<MovieQueryParams>({
  include_adult: props.movieFilters?.include_adult ?? undefined,
  include_video: props.movieFilters?.include_video ?? undefined,
  language: props.movieFilters?.language ?? undefined,
  sort_by: props.movieFilters?.sort_by ?? undefined,
  with_keywords: undefined,
  with_genres: undefined
})

const languages = ref<Language[] | []>([])
const showListSearch = ref<boolean>(false)
const keywords = ref<Keyword[] | undefined>(undefined)

const emit = defineEmits(['update:filters', 'update:search'])

watch(debounceKeywordFilter, async () => {
  const { results } = await fetchKeywords({ page: props.page, query: keywordFilter.value || '' })
  keywords.value = results || []
})

watch(debounceSearch, async () => {
  emit('update:search', search.value)
})

watchDebounced(
  filters,
  () => {
    emit('update:filters', filters.value)
  },
  {
    debounce: 1000,
    deep: true
  }
)

const fetchResults = async () => {
  const data = await fetchLanguages()
  languages.value = data
}

await fetchResults()

const updateKeywordFilter = async (event: Event) => {
  const target = event.target as HTMLInputElement | null

  if (!target) {
    console.warn('Event target is not an HTMLInputElement')
    return
  }

  const inputValue = target.value.trim()

  showListSearch.value = inputValue.length > 0
  keywordFilter.value = inputValue || undefined
}

const handleKeywordSelection = (id: number) => {
  if (id === undefined) return

  filters.value.with_keywords = id.toString()
  keywordFilter.value = keywords.value ? keywords.value.find((el) => el.id === id)?.name : undefined
  showListSearch.value = false
  keywords.value = undefined
}

const open = ref<boolean>(false)
const genresStore = useGenresStore()

const genres = computed(() => genresStore.genres)

if (genres.value?.length <= 0) {
  await genresStore.getGenres()
}
</script>

<template>
  <div class="filters">
    {{ filters.with_genres }}
    <div class="filter-item">
      <label for="search" class="block text-sm font-medium pb-2">Search</label>
      <Input v-model="search" id="search" placeholder="Search for a movie..." />
    </div>
    <div class="filter-item">
      <label for="sort_by" class="block text-sm font-medium pb-2">Sort By</label>
      <Select v-model="filters.sort_by">
        <SelectTrigger class="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="popularity.desc">Popularity Descending</SelectItem>
            <SelectItem value="popularity.asc">Popularity Ascending</SelectItem>
            <SelectItem value="release_date.desc">Release Date Descending</SelectItem>
            <SelectItem value="release_date.asc">Release Date Ascending</SelectItem>
            <SelectItem value="vote_average.desc">Vote Average Descending</SelectItem>
            <SelectItem value="vote_average.asc">Vote Average Ascending</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>

    <div class="filters">
      <Popover v-model:open="open">
        <PopoverTrigger as-child>
          <Button
            variant="outline"
            role="combobox"
            :aria-expanded="open"
            class="w-[200px] justify-between"
          >
            {{
              filters.with_genres
                ? genres.find((genre) => genre.id === filters.with_genres)?.name
                : 'Select framework...'
            }}
            <iconify-icon icon="lucide:arrow-down" class="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-[200px] p-0">
          <Command v-model="filters.with_genres">
            <CommandInput class="h-9" placeholder="Search framework..." />
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                <CommandItem
                  v-for="genre in genres"
                  :key="genre.name"
                  :value="genre.id"
                  @select="open = false"
                >
                  {{ genre.name }}

                  <iconify-icon
                    icon="lucide:check"
                    width="24"
                    height="24"
                    :class="
                      cn(
                        'ml-auto h-4 w-4',
                        filters.with_genres === genre.id ? 'opacity-100' : 'opacity-0'
                      )
                    "
                  />
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>

    <div class="filter-item">
      <div class="flex items-center space-x-2">
        <Checkbox v-model:checked="filters.include_adult" id="include_adult" />
        <label
          for="include_adult"
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Include Adult
        </label>
      </div>
    </div>

    <div class="filter-item">
      <div class="flex items-center space-x-2">
        <Checkbox v-model:checked="filters.include_video" id="include_video" />
        <label
          for="include_video"
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Include Video
        </label>
      </div>
    </div>

    <div class="filter-item">
      <label for="language" class="block text-sm font-medium pb-2">Language</label>
      <Select v-model="filters.language">
        <SelectTrigger class="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem v-for="lang in languages" :key="lang.iso_639_1" :value="lang.iso_639_1">
              {{ lang.english_name }} ({{ lang.iso_639_1 }})
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>

    <div class="filter-item relative">
      <label for="keyword" class="block text-sm font-medium pb-2">Keywords</label>
      <Input
        v-model="keywordFilter"
        ref="keywordInput"
        @input="updateKeywordFilter"
        id="keyword"
        placeholder="Filter by keyword..."
      />
      <ScrollArea
        class="h-36 w-48 rounded-md border !absolute top-[4.5rem] z-10 bg-background"
        v-if="keywordFilter && keywordFilter.length > 0 && showListSearch && keywords !== undefined"
      >
        <ul class="p-4" v-if="keywords.length">
          <li v-for="keyword in keywords" :key="keyword.id">
            <span
              class="cursor-pointer text-sm hover:bg-primary hover:text-secondary rounded-md px-2 py-1 transition-colors w-fit"
              @click="handleKeywordSelection(keyword.id)"
            >
              {{ keyword.name }}
            </span>
            <Separator class="my-2" />
          </li>
        </ul>
        <div v-else class="flex justify-center text-center pt-2">
          <p class="text-muted">No data found.</p>
        </div>
      </ScrollArea>
    </div>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.filter-item {
  display: flex;
  flex-direction: column;
}
.results {
  border-top: 1px solid #e5e5e5;
  padding-top: 1rem;
}
</style>
