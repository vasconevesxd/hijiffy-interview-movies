<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface LinkProp {
  fallback: string
  icon?: string
  image?: string
  label?: string
  options: { title: string; to?: string; icon: string }[]
}

defineProps<{
  links: LinkProp[]
}>()

const emits = defineEmits<{
  actionClicked: [string]
}>()

const handleOptionClick = (linkTitle: string) => {
  emits('actionClicked', linkTitle)
}
</script>

<template>
  <DropdownMenu v-for="(link, index) in links" :key="`dropdown-${index}`">
    <DropdownMenuTrigger>
      <Avatar>
        <AvatarImage v-if="link.image" :src="link.image" />
        <iconify-icon v-else-if="link.icon" :icon="link.icon" />
        <AvatarFallback>{{ link.fallback || 'N/A' }}</AvatarFallback>
      </Avatar>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>{{ link.label || 'No Label' }}</DropdownMenuLabel>
      <DropdownMenuSeparator />

      <template v-if="Array.isArray(link.options) && link.options.length">
        <DropdownMenuItem
          v-for="(option, optionIndex) in link.options"
          :key="`option-${optionIndex}`"
          @click="handleOptionClick(option.title)"
          class="!cursor-pointer"
        >
          <iconify-icon v-if="option.icon" :icon="option.icon" />
          {{ option.title || 'Unnamed Option' }}
        </DropdownMenuItem>
      </template>
      <template v-else>
        <DropdownMenuItem disabled>No options available</DropdownMenuItem>
      </template>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
