<script setup lang="ts">
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu'

interface LinkProp {
  title: string
  to?: string
  options?: { title: string; to: string; description: string }[]
}

defineProps<{
  links: LinkProp[]
}>()
</script>

<style scoped>
.nav-link {
  @apply flex items-center gap-3 px-4 py-2 mx-2 transition-colors rounded-lg hover:text-primary justify-center lg:justify-normal text-muted-foreground;
}
</style>
<template>
  <template v-for="link in links" :key="link.title">
    <NavigationMenuList v-if="!link.to && link.options && link.options.length > 0">
      <NavigationMenuItem>
        <NavigationMenuTrigger class="text-sm md:text-base lg:text-sm">
          {{ link.title }}
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul
            class="grid gap-3 p-4 sm:grid-cols-1 md:w-[400px] md:grid-cols-2 lg:w-[500px] xl:w-[600px]"
          >
            <li
              v-for="(option, optionIndex) in link.options"
              :key="optionIndex"
              class="rounded-md transition"
            >
              <NavigationMenuLink as-child>
                <RouterLink
                  v-if="option?.to"
                  :to="option.to"
                  class="block select-none space-y-1 p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  <div class="text-sm font-medium leading-none">
                    {{ option.title }}
                  </div>
                  <p class="line-clamp-2 text-xs sm:text-sm leading-snug text-muted-foreground">
                    {{ option.description }}
                  </p>
                </RouterLink>
              </NavigationMenuLink>
            </li>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>

    <div v-else class="cursor-pointer" :class="navigationMenuTriggerStyle()">
      <RouterLink v-if="link.to" :to="link.to">
        <span class="text-sm md:text-base lg:text-sm">{{ link.title }}</span>
      </RouterLink>
      <span v-else>{{ link.title }}</span>
    </div>
  </template>
</template>
