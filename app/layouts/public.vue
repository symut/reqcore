<script setup lang="ts">
const route = useRoute()

const activePage = computed(() => route.path.match(/\/jobs(?:\/|$)/) ? 'jobs' : undefined)
</script>

<template>
  <div class="min-h-screen bg-surface-50 dark:bg-surface-950">
    <PublicNavBar :active-page="activePage" />

    <!-- Content -->
    <main class="mx-auto max-w-3xl px-4 sm:px-6 pt-20 pb-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-surface-200 dark:border-surface-800 mt-12">
      <div class="mx-auto max-w-3xl px-4 sm:px-6 py-6">
        <p class="text-xs text-surface-400 text-center">
          Copyright © Karir - 2026 | Powered by <a :href="useRuntimeConfig().public.marketingUrl" class="underline hover:text-surface-600 dark:hover:text-surface-300">Reqcore</a>
        </p>
      </div>
    </footer>
  </div>
</template>
