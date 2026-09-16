<script setup lang="ts">
import {
    Sun,
    Moon,
    Check,
    ChevronDown,
} from "lucide-vue-next";
import {
    BILLING_PLANS,
    getBillingPlan,
    type BillingPlan,
    type BillingTier,
} from "~~/shared/billing";
import type { BillingCadence } from "~/composables/useBillingCheckout";
const { t } = useI18n();
const { isDark, toggle: toggleColorMode } = useColorMode();

const route = useRoute();

// ── Plan picker ───────────────────────────────────────────────────────────
// A visitor who picked a plan on the pricing page arrives here with the intent
// in the URL; on the sign-up page they can also pick or switch right here. The
// chosen plan/cadence lives in the URL query, so the downstream checkout reads
// the same source of truth and the half-filled form survives a query change.
const isSignUp = computed(() => route.path.includes("/auth/sign-up"));
const isSignIn = computed(() => route.path.includes("/auth/sign-in"));
const selectedIntent = computed(() => parseBillingCheckoutIntent(route.query));
const isFreeSelected = computed(() => hasFreePlanIntent(route.query));
const selectedCadence = computed<BillingCadence>(() =>
    parseBillingCadenceQuery(route.query),
);

// The currently-chosen tier (free + paid), or null when nothing is selected.
const currentPlanId = computed<BillingTier | null>(
    () =>
        selectedIntent.value?.planId ?? (isFreeSelected.value ? "free" : null),
);
const currentPaidPlan = computed(() =>
    selectedIntent.value
        ? (getBillingPlan(selectedIntent.value.planId) ?? null)
        : null,
);

// Show the picker on sign-up always (so anyone can choose), and elsewhere only
// when a plan intent is already present (e.g. returning to finish checkout).
const showPlanPicker = computed(
    () => isSignUp.value || currentPlanId.value !== null,
);

function priceLabel(plan: BillingPlan): string {
    if (selectedCadence.value === "annual" && plan.annualPrice != null) {
        return `$${Math.round(plan.annualPrice / 12).toLocaleString("en-US")}/mo`;
    }
    return `$${plan.monthlyPrice}/mo`;
}

type PlanOption = {
    id: BillingTier;
    name: string;
    tagline: string;
    price: string;
    featured: boolean;
};
const planOptions = computed<PlanOption[]>(() => [
    {
        id: "free",
        name: "Free trial",
        tagline: "Try one role — first AI shortlist free",
        price: "$0",
        featured: false,
    },
    ...BILLING_PLANS.map((p) => ({
        id: p.id,
        name: p.name,
        tagline: p.tagline,
        price: priceLabel(p),
        featured: p.id === "team",
    })),
]);

// Trigger summary shown on the closed picker.
const triggerName = computed(() => {
    if (currentPlanId.value === "free") return "Free trial";
    return currentPaidPlan.value?.name ?? "Choose a plan";
});
const triggerSub = computed(() => {
    if (currentPlanId.value === "free")
        return "Try one role — first AI shortlist free";
    return (
        currentPaidPlan.value?.tagline ??
        "Start with a free trial or pick a paid plan"
    );
});
const triggerPrice = computed(() => {
    if (currentPlanId.value === "free") return "$0";
    return currentPaidPlan.value ? priceLabel(currentPaidPlan.value) : "";
});

const planMenuOpen = ref(false);
const planMenuRef = ref<HTMLElement | null>(null);
function handlePlanClickOutside(event: MouseEvent) {
    if (
        planMenuRef.value &&
        !planMenuRef.value.contains(event.target as Node)
    ) {
        planMenuOpen.value = false;
    }
}
onMounted(() => document.addEventListener("mousedown", handlePlanClickOutside));
onUnmounted(() =>
    document.removeEventListener("mousedown", handlePlanClickOutside),
);

// Write the selection into the URL, preserving every other query param.
function applyQuery(patch: Record<string, string | undefined>) {
    const query: Record<string, unknown> = { ...route.query, ...patch };
    for (const key of Object.keys(query)) {
        if (query[key] === undefined) delete query[key];
    }
    navigateTo({ query: query as Record<string, string> });
}
function selectPlan(id: BillingTier) {
    if (id === "free") applyQuery({ plan: "free", billing: undefined });
    else applyQuery({ plan: id, billing: selectedCadence.value });
    planMenuOpen.value = false;
}
function setCadence(cadence: BillingCadence) {
    applyQuery({ billing: cadence });
}
</script>

<template>
    <div class="relative min-h-screen bg-surface-50 dark:bg-surface-950">
        <!-- Top-left controls -->
        <div class="absolute left-4 top-4 z-20 flex items-center gap-2">
            <ClientOnly>
                <button
                    class="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-surface-500 transition-all duration-200 hover:bg-surface-100 hover:text-surface-700 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-200"
                    :title="
                        isDark ? 'Switch to light mode' : 'Switch to dark mode'
                    "
                    @click="toggleColorMode"
                >
                    <Sun v-if="isDark" class="size-4" />
                    <Moon v-else class="size-4" />
                </button>
                <template #fallback>
                    <div class="size-8" aria-hidden="true" />
                </template>
            </ClientOnly>
            <LanguageSwitcher align="left" />
        </div>

        <!-- ── Brand panel (large screens) — pinned to the right edge so the form
         can sit dead-center of the screen while the branding stays on the
         side. Hidden below xl, where there isn't room for both. ── -->
        <aside
            class="absolute inset-y-0 right-0 z-20 hidden w-[26rem] flex-col overflow-hidden border-l border-surface-200 bg-surface-100 p-12 xl:flex dark:border-transparent dark:bg-[#09090b]"
        >
            <!-- Logo mark -->
            <div class="relative flex items-center gap-3">
                <img
                    src="/eagle-mascot-logo.png"
                    alt=""
                    class="size-9 object-contain"
                />
                <span
                    class="text-lg font-semibold tracking-tight text-surface-900 dark:text-white"
                    >Karir Untidar</span
                >
            </div>

            <div class="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/5">
                <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">
                    {{ t("auth.sidebar.forCompaniesTitle") }}
                </p>
                <ul class="mt-3 space-y-2 text-sm leading-6 text-surface-600 dark:text-surface-300">
                    <li>• {{ t("auth.sidebar.companyBenefit1") }}</li>
                    <li>• {{ t("auth.sidebar.companyBenefit2") }}</li>
                    <li>• {{ t("auth.sidebar.companyBenefit3") }}</li>
                </ul>
            </div>

            <div class="mt-4 rounded-2xl border border-danger-200 bg-danger-50/80 p-4 dark:border-danger-500/20 dark:bg-danger-500/5">
                <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-danger-700 dark:text-danger-300">
                    {{ t("auth.sidebar.applicantsTitle") }}
                </p>
                <p class="mt-2 text-sm leading-6 text-surface-700 dark:text-surface-200">
                    {{ t("auth.sidebar.applicantsText") }}
                </p>
            </div>

            <p
                v-if="isSignIn || isSignUp"
                class="mt-auto text-sm text-surface-500 dark:text-white/40"
            >
                {{
                    isSignIn
                        ? t("auth.sidebar.helpSignIn")
                        : t("auth.sidebar.helpSignUp")
                }}
                <a
                    href="mailto:karir@untidar.ac.id?subject=Karir%20account%20help"
                    class="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >{{ t("auth.sidebar.contactSupport") }}</a
                >.
            </p>
        </aside>

        <!-- ── Form — centered on the full viewport, independent of the panel ── -->
        <div
            class="relative z-10 flex min-h-screen items-center justify-center overflow-y-auto px-4 py-12 sm:px-8"
        >
            <div class="w-full max-w-[420px]">
                <!-- Compact brand mark — shown when the side panel is hidden -->
                <div
                    class="mb-8 flex flex-col items-center gap-3 text-center xl:hidden"
                >
                    <img
                        src="/eagle-mascot-logo.png"
                        alt="Karir mascot"
                        class="size-12 object-contain"
                    />
                    <span
                        class="text-lg font-semibold tracking-tight text-surface-900 dark:text-surface-100"
                        >Karir</span
                    >
                </div>

                <slot />
            </div>
        </div>
    </div>
</template>
