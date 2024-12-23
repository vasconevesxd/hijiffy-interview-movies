import { createRouter, createWebHistory } from 'vue-router/auto'
import { routes } from 'vue-router/auto-routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from) => {
  const pageStore = usePageStore()

  pageStore.pageData.title = ''
  pageStore.pageData.canGoBack = false

  const authStore = useAuthStore()
  await authStore.getSession()

  const isAuthPage = ['/login', '/register'].includes(to.path)
  if (!authStore.user && !isAuthPage) {
    return {
      name: '/login'
    }
  }

  if (authStore.user && isAuthPage) {
    return {
      name: '/movies/[id]',
      params: { id: 1 }
    }
  }
})

export default router
