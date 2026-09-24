<script setup lang="ts">
  import { ArrowRight, Briefcase, CalendarDays, CheckCircle2, Clock3, FileText, GraduationCap, MapPin, Sparkles, Users } from 'lucide-vue-next'

  const { t, locale } = useI18n()
  const localePath = useLocalePath()
  const { data: session } = await authClient.useSession(useFetch)

  const pillars = computed(() => [
    { icon: Briefcase, label: t('home.pillars.yourData.label'), desc: t('home.pillars.yourData.desc') },
    { icon: Sparkles, label: t('home.pillars.auditable.label'), desc: t('home.pillars.auditable.desc') },
    { icon: Users, label: t('home.pillars.unlimitedSeats.label'), desc: t('home.pillars.unlimitedSeats.desc') },
  ])

  const jobTypes = computed(() => [
    { icon: Briefcase, key: 'fullTime', tone: 'emerald' },
    { icon: Clock3, key: 'partTime', tone: 'sky' },
    { icon: FileText, key: 'contract', tone: 'amber' },
    { icon: GraduationCap, key: 'internship', tone: 'rose' },
  ])

  const toneClasses: Record<string, { box: string, icon: string }> = {
    emerald: {
      box: 'border-emerald-200 bg-emerald-50 hover:border-emerald-400 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:hover:border-emerald-500/40',
      icon: 'text-emerald-600 dark:text-emerald-400'
    },
    sky: {
      box: 'border-sky-200 bg-sky-50 hover:border-sky-400 dark:border-sky-500/20 dark:bg-sky-500/10 dark:hover:border-sky-500/40',
      icon: 'text-sky-600 dark:text-sky-400'
    },
    amber: {
      box: 'border-amber-200 bg-amber-50 hover:border-amber-400 dark:border-amber-500/20 dark:bg-amber-500/10 dark:hover:border-amber-500/40',
      icon: 'text-amber-600 dark:text-amber-400'
    },
    rose: {
      box: 'border-rose-200 bg-rose-50 hover:border-rose-400 dark:border-rose-500/20 dark:bg-rose-500/10 dark:hover:border-rose-500/40',
      icon: 'text-rose-600 dark:text-rose-400'
    }
  }

  const { data: recentJobsData } = await useFetch('/api/public/jobs', {
    key: 'landing-public-jobs',
    query: { page: 1, limit: 5 },
  })

  const { data: stats } = await useFetch('/api/public/stats', {
    key: 'landing-public-stats',
  })

  const { data: mapLocations } = await useFetch('/api/public/jobs/map', {
    key: 'landing-job-map',
  })

  const recentJobs = computed(() => recentJobsData.value?.data ?? [])

  function formatJobType(type: string | null | undefined) {
    if (!type) return 'Position'
    return type.replace(/_/g, ' ')
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString(locale.value, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const partners = [
    { key: 'aoi', src: '/partner/partner-aoi.png', alt: 'AOI' },
    { key: 'bfi', src: '/partner/partner-bfi.png', alt: 'BFI' },
    { key: 'bmt-tumang', src: '/partner/partner-bmt-tumang.png', alt: 'BMT Tumang' },
    { key: 'bpr-drs', src: '/partner/partner-bpr-drs.png', alt: 'BPR DRS' },
    { key: 'edu-akksa', src: '/partner/partner-edu-akksa.png', alt: 'Edu Akksa' },
    { key: 'fif', src: '/partner/partner-fif.jpeg', alt: 'FIF' },
    { key: 'gacoan', src: '/partner/partner-gacoan.png', alt: 'Gacoan' },
    { key: 'kap-jsr', src: '/partner/partner-kap-jsr.png', alt: 'KAP JSR' },
    { key: 'kospin-jasa', src: '/partner/partner-kospin-jasa.png', alt: 'Kospin Jasa' },
    { key: 'lpk-akatara', src: '/partner/partner-lpk-akatara.png', alt: 'LPK Akatara' },
    { key: 'mandiri-uf', src: '/partner/partner-mandiri-uf.png', alt: 'Mandiri UF' },
    { key: 'mandiri', src: '/partner/partner-mandiri.png', alt: 'Mandiri' },
    { key: 'mmi', src: '/partner/partner-mmi.png', alt: 'MMI' },
    { key: 'ppks', src: '/partner/partner-ppks.png', alt: 'PPKS' },
    { key: 'sim', src: '/partner/partner-sim.jpeg', alt: 'SIM' },
    { key: 'tp', src: '/partner/partner-tp.png', alt: 'TP' },
    { key: 'umbul-banyuroso', src: '/partner/partner-umbul-banyuroso.png', alt: 'Umbul Banyuroso' },
  ]

  const sponsors = [
    { key: 'bni46', src: '/sponsor/sponsor-bni46.png', alt: 'BNI 46' },
    { key: 'btn', src: '/sponsor/sponsor-btn.png', alt: 'BTN' },
    { key: 'grab', src: '/sponsor/sponsor-grab.png', alt: 'Grab' },
    { key: 'ganidar', src: '/sponsor/spronso-ganidar.png', alt: 'Ganidar' },
  ]

  useHead({ title: 'Karir' })
  definePageMeta({ layout: false })
</script>

<template>
  <div class="relative min-h-screen overflow-hidden bg-white dark:bg-[#09090b]">
    <!-- Ambient glow -->
    <div
      class="pointer-events-none absolute top-[-40%] left-1/2 h-[800px] w-[900px] -translate-x-1/2 rounded-full opacity-[0.07]"
      style="background: radial-gradient(ellipse at center, var(--color-brand-500), transparent 70%)" />

    <PublicNavBar />

    <main class="relative pb-24">
      <div class="mx-auto max-w-5xl px-6 pt-36">
        <!-- ── Hero ── -->
        <div class="flex flex-col items-center text-center">
          <h1
            class="hero-animate hero-delay-1 text-5xl font-bold leading-[1.1] tracking-tight text-surface-900 dark:text-white sm:text-6xl lg:text-7xl">
            {{ $t('home.hero.titleLine1') }}
            <br />
            <span class="bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">
              {{ $t('home.hero.titleHighlight') }}
            </span>
          </h1>

          <p
            class="hero-animate hero-delay-2 mt-6 max-w-md text-base leading-relaxed text-surface-600 dark:text-surface-400 sm:text-lg">
            {{ $t('home.hero.subtitle') }}
          </p>

          <div class="hero-animate hero-delay-4 mt-10 flex flex-wrap items-center justify-center gap-3">
            <NuxtLink v-if="session?.user" :to="localePath('/dashboard')"
              class="group flex items-center gap-2 rounded-lg bg-surface-900 dark:bg-white px-6 py-3 text-[14px] font-semibold text-white dark:text-[#09090b] transition hover:bg-surface-800 dark:hover:bg-white/90">
              {{ $t('home.hero.goToDashboard') }}
              <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </NuxtLink>
            <template v-else>
              <NuxtLink :to="localePath('/auth/sign-in?live=1')"
                class="group flex items-center gap-2 rounded-lg bg-surface-900 dark:bg-white px-6 py-3 text-[14px] font-semibold text-white dark:text-[#09090b] transition hover:bg-surface-800 dark:hover:bg-white/90">
                {{ $t('home.hero.ctaDemo') }}
                <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </NuxtLink>
              <NuxtLink :to="localePath('/auth/sign-up')"
                class="rounded-lg border border-surface-300 dark:border-white/[0.08] bg-surface-100 dark:bg-white/[0.03] px-6 py-3 text-[14px] font-medium text-surface-600 dark:text-surface-300 transition hover:border-surface-400 dark:hover:border-white/[0.14] hover:bg-surface-200 dark:hover:bg-white/[0.06]">
                {{ $t('home.hero.createAccount') }}
              </NuxtLink>
            </template>
          </div>
        </div>

        <!-- ── Pillars ── -->
        <!-- <div class="hero-animate hero-delay-5 mx-auto mt-28 grid max-w-3xl gap-4 sm:grid-cols-3">
          ...
        </div> -->

        <!-- ── Stats ── -->
        <div class="hero-animate hero-delay-5 mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
          <div
            class="rounded-xl border border-surface-200 bg-white p-6 text-center shadow-sm dark:border-white/[0.08] dark:bg-surface-950">
            <p class="text-3xl font-bold text-brand-600 dark:text-brand-400">{{ stats?.companies || 0 }}</p>
            <p class="mt-2 text-sm font-medium text-surface-600 dark:text-surface-400">{{ $t('home.stats.companies') }}
            </p>
          </div>
          <div
            class="rounded-xl border border-surface-200 bg-white p-6 text-center shadow-sm dark:border-white/[0.08] dark:bg-surface-950">
            <p class="text-3xl font-bold text-brand-600 dark:text-brand-400">{{ stats?.jobs || 0 }}</p>
            <p class="mt-2 text-sm font-medium text-surface-600 dark:text-surface-400">{{ $t('home.stats.jobs') }}</p>
          </div>
          <div
            class="rounded-xl border border-surface-200 bg-white p-6 text-center shadow-sm dark:border-white/[0.08] dark:bg-surface-950">
            <p class="text-3xl font-bold text-brand-600 dark:text-brand-400">{{ stats?.applicants || 0 }}</p>
            <p class="mt-2 text-sm font-medium text-surface-600 dark:text-surface-400">{{ $t('home.stats.applicants') }}
            </p>
          </div>
          <div
            class="rounded-xl border border-surface-200 bg-white p-6 text-center shadow-sm dark:border-white/[0.08] dark:bg-surface-950">
            <p class="text-3xl font-bold text-brand-600 dark:text-brand-400">{{ stats?.hired || 0 }}</p>
            <p class="mt-2 text-sm font-medium text-surface-600 dark:text-surface-400">{{ $t('home.stats.hired') }}</p>
          </div>
        </div>
      </div>

      <section class="mx-auto mt-24 max-w-5xl px-6">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
              {{ $t('home.featuredJobs.title') }}
            </p>
            <h2 class="mt-2 text-3xl font-bold tracking-tight text-surface-900 dark:text-white sm:text-4xl">
              {{ $t('home.featuredJobs.subtitle') }}
            </h2>
          </div>
          <NuxtLink :to="localePath('/jobs')"
            class="inline-flex items-center gap-2 text-sm font-semibold text-surface-700 transition hover:text-surface-900 dark:text-surface-300 dark:hover:text-white">
            {{ $t('home.featuredJobs.viewAll') }}
            <ArrowRight class="h-4 w-4" />
          </NuxtLink>
        </div>

        <div v-if="recentJobs.length" class="mt-8 grid gap-4 md:grid-cols-2">
          <NuxtLink v-for="job in recentJobs" :key="job.id" :to="localePath(`/jobs/${job.slug}`)"
            class="group block rounded-xl border border-surface-200 bg-white p-5 transition hover:border-brand-300 hover:shadow-sm dark:border-white/[0.08] dark:bg-surface-950 dark:hover:border-brand-700">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-xs font-medium uppercase tracking-wide text-surface-500 dark:text-surface-400">
                  {{ job.organizationName || 'Untidar' }}
                </p>
                <h3 class="mt-2 text-xl font-semibold text-surface-900 dark:text-white">
                  {{ job.title }}
                </h3>
              </div>
              <ArrowRight
                class="mt-1 h-5 w-5 shrink-0 text-surface-400 transition group-hover:text-brand-600 dark:group-hover:text-brand-300" />
            </div>

            <p v-if="job.description"
              class="mt-3 line-clamp-3 text-sm leading-6 text-surface-600 dark:text-surface-400">
              {{ job.description }}
            </p>

            <div class="mt-4 flex flex-wrap items-center gap-3 text-xs text-surface-500 dark:text-surface-400">
              <span class="inline-flex items-center gap-1.5 rounded-full bg-surface-100 px-2 py-1 dark:bg-white/[0.06]">
                <Briefcase class="h-3.5 w-3.5" />
                {{ formatJobType(job.type) }}
              </span>
              <span v-if="job.location" class="inline-flex items-center gap-1.5">
                <MapPin class="h-3.5 w-3.5" />
                {{ job.location }}
              </span>
              <span>Posted {{ formatDate(job.createdAt) }}</span>
            </div>
          </NuxtLink>
        </div>

        <div v-else
          class="mt-8 rounded-xl border border-dashed border-surface-300 bg-surface-50 p-8 text-center text-sm text-surface-500 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-surface-400">
          {{ $t('home.featuredJobs.emptyBody') }}
        </div>
      </section>

      <!-- ── Job types ── -->
      <section class="mx-auto mt-24 max-w-5xl px-6">
        <div class="overflow-hidden rounded-2xl border border-surface-200 bg-surface-50 dark:border-white/[0.08] dark:bg-surface-900/70">
          <div class="grid items-center gap-10 p-6 sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:p-12">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
                {{ $t('home.jobTypes.eyebrow') }}
              </p>
              <h2 class="mt-3 text-3xl font-bold tracking-tight text-surface-900 dark:text-white sm:text-4xl">
                {{ $t('home.jobTypes.title') }}
              </h2>
              <p class="mt-4 max-w-md text-base leading-7 text-surface-600 dark:text-surface-400">
                {{ $t('home.jobTypes.description') }}
              </p>
              <div class="mt-6 flex items-center gap-2 text-sm font-medium text-surface-700 dark:text-surface-300">
                <CalendarDays class="h-4 w-4 text-brand-600 dark:text-brand-300" />
                {{ $t('home.jobTypes.note') }}
              </div>
            </div>

            <div class="relative min-h-[280px] rounded-xl border border-surface-200 bg-white p-4 shadow-sm dark:border-white/[0.08] dark:bg-surface-950 sm:p-6">
              <div class="absolute inset-x-10 top-1/2 h-px bg-surface-200 dark:bg-white/[0.08]" />
              <div class="absolute inset-y-10 left-1/2 w-px bg-surface-200 dark:bg-white/[0.08]" />
              <div class="relative grid h-full grid-cols-2 gap-3 sm:gap-4">
                <div
                  v-for="jobType in jobTypes"
                  :key="jobType.key"
                  :class="[
                    'group flex min-h-[112px] flex-col justify-between rounded-lg border p-4 transition hover:-translate-y-0.5 hover:shadow-md',
                    toneClasses[jobType.tone]?.box || 'border-surface-200 bg-surface-50 hover:border-brand-300 dark:border-white/[0.08] dark:bg-white/[0.04] dark:hover:border-brand-700'
                  ]"
                >
                  <component
                    :is="jobType.icon"
                    :class="['h-5 w-5', toneClasses[jobType.tone]?.icon || 'text-brand-600 dark:text-brand-300']"
                  />
                  <div>
                    <p class="text-sm font-semibold text-surface-900 dark:text-white">
                      {{ $t(`home.jobTypes.items.${jobType.key}.label`) }}
                    </p>
                    <p class="mt-1 text-xs leading-5 text-surface-500 dark:text-surface-400">
                      {{ $t(`home.jobTypes.items.${jobType.key}.description`) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Map: Sebaran Kota ── -->
      <section v-if="mapLocations && mapLocations.length > 0" class="mx-auto mt-24 max-w-5xl px-6">
        <div class="mb-6 text-center">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
            {{ $t('home.map.subtitle') }}
          </p>
          <h2 class="mt-2 text-3xl font-bold tracking-tight text-surface-900 dark:text-white sm:text-4xl">
            {{ $t('home.map.title') }}
          </h2>
        </div>
        <ClientOnly>
          <JobMap :locations="mapLocations" />
        </ClientOnly>
      </section>

      <!-- ── Partners ── -->
      <section class="mx-auto mt-24 max-w-5xl px-6">
        <div class="text-center">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 light:text-brand-300">
            {{ $t('home.partners.eyebrow') }}
          </p>
          <h2 class="mt-2 text-3xl font-bold tracking-tight text-surface-900 light:text-dark sm:text-4xl">
            {{ $t('home.partners.title') }}
          </h2>
          <p class="mx-auto mt-4 max-w-2xl text-sm leading-6 text-surface-600 light:text-surface-400">
            {{ $t('home.partners.description') }}
          </p>
        </div>

        <div class="mt-8 grid grid-cols-2 items-center gap-4 sm:grid-cols-4 md:grid-cols-6">
          <div
            v-for="partner in partners"
            :key="partner.key"
            class="flex h-32 items-center justify-center rounded-xl border border-surface-200 bg-white px-4 py-4 transition hover:border-brand-300 hover:shadow-sm"
          >
            <img
              :src="partner.src"
              :alt="partner.alt"
              loading="lazy"
              class="max-h-20 w-full object-contain"
            />
          </div>
        </div>
      </section>

      <!-- ── Sponsors ── -->
      <section class="mx-auto mt-24 max-w-5xl px-6">
        <div class="text-center">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
            {{ $t('home.sponsors.eyebrow') }}
          </p>
          <h2 class="mt-2 text-3xl font-bold tracking-tight text-surface-900 dark:text-white sm:text-4xl">
            {{ $t('home.sponsors.title') }}
          </h2>
          <p class="mx-auto mt-4 max-w-2xl text-sm leading-6 text-surface-600 dark:text-surface-400">
            {{ $t('home.sponsors.description') }}
          </p>
        </div>

        <div class="mt-8 grid grid-cols-2 items-center gap-4 sm:grid-cols-4">
          <div
            v-for="sponsor in sponsors"
            :key="sponsor.key"
            class="flex h-36 items-center justify-center rounded-xl border border-surface-200 bg-white px-6 py-5 transition hover:border-brand-300 hover:shadow-sm"
          >
            <img
              :src="sponsor.src"
              :alt="sponsor.alt"
              loading="lazy"
              class="max-h-24 w-full object-contain"
            />
          </div>
        </div>
      </section>

      <!-- ── Footer ── -->
      <footer
        class="hero-animate hero-delay-5 mx-auto mt-8 flex max-w-5xl flex-col items-center gap-4 px-6 text-center">
        <div class="flex items-center gap-5">
          <NuxtLink :to="localePath('/jobs')"
            class="flex items-center gap-1.5 text-[13px] text-surface-500 transition hover:text-surface-700 dark:hover:text-surface-300">
            <Briefcase class="h-3.5 w-3.5" />
            {{ $t('home.nav.openPositions') }}
          </NuxtLink>
        </div>
        <p class="text-[12px] text-surface-500 dark:text-surface-600">
          {{ $t('home.footer.tagline') }} | Powered by <a :href="useRuntimeConfig().public.marketingUrl" class="underline hover:text-surface-600 dark:hover:text-surface-300">Reqcore</a>
        </p>
      </footer>
    </main>
  </div>
</template>