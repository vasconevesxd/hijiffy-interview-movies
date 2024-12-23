<script setup lang="ts">
import { NavigationMenu } from '@/components/ui/navigation-menu'

const routesLinks: {
  title: string
  to?: string
  options?: { title: string; to: string; description: string }[]
}[] = [
  {
    title: 'Home',
    to: '/',
    options: []
  },
  {
    title: 'Movies',
    options: [
      {
        title: 'All Movies',
        to: '/movies/1',
        description:
          'Watch the latest movie releases online with a vast selection ready for you to explore and enjoy.'
      },
      {
        title: 'Genres',
        to: '/movies/genres',
        description:
          'Dive into our curated collection of movies, categorized by genre to suit every mood. From action-packed thrillers to heartwarming dramas, find your next favorite film with ease.'
      }
    ]
  }
]

const actionLinks: {
  fallback: string
  icon?: string
  image?: string
  label?: string
  options: { title: string; to?: string; icon: string }[]
}[] = [
  {
    fallback: 'CN',
    image: 'https://github.com/radix-vue.png',
    label: 'My Account',
    options: [
      {
        title: 'Profile',
        icon: 'lucide:user'
      },
      {
        title: 'Sign Out',
        icon: 'lucide:log-out'
      }
    ]
  }
]

const router = useRouter()

const executeAction = async (linkTitle: string) => {
  if (linkTitle === 'Sign Out') {
    const { logout } = await import('@/services/supabase/supaAuth')
    const isLoogedOut = await logout()

    if (isLoogedOut) router.push('/login')
  }

  if (linkTitle === 'Profile') {
    const username = useAuthStore().profile?.username
    if (username) {
      router.push({ name: '/profile/[username]/', params: { username } })
    }
  }

  if (linkTitle === 'Favorite') {
    const username = useAuthStore().profile?.username
    if (username) {
      router.push({ name: '/profile/[username]/favorites', params: { username } })
    }
  }
}
</script>

<template>
  <NavigationMenu
    class="!max-w-full h-16 border-b bg-muted/40 flex gap-2 justify-between px-6 py-1 items-center"
  >
    <div class="flex gap-4">
      <TopNavbarLinks :links="routesLinks" />
    </div>
    <div>
      <TopNavbarActions :links="actionLinks" @actionClicked="executeAction" />
    </div>
  </NavigationMenu>
</template>
