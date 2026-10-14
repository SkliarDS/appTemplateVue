import { createRouter, createWebHistory } from "vue-router";
import { useScrollStore } from "@/stores/storeScroll";
import { useRequestsStore } from "@/stores/storeRequests";
import TheHomePage from "@/pages/TheHomePage.vue";
import TheNotFindPage from "@/pages/TheNotFindPage.vue";
import TheProfilePage from "@/pages/TheProfilePage.vue";
import { TELEGRAM_ENABLED } from "@/utils/constans";

// Страницы Telegram Mini App. Подключаются только при VITE_TELEGRAM_ENABLED=true, иначе /webview/* → 404
const telegramRoutes = [
	{
		path: "/webview/register",
		name: "tg-register",
		component: () => import("@/pages_telegram/TelegramRegisterPage.vue"),
	},
	{
		path: "/webview/auth",
		name: "tg-auth",
		component: () => import("@/pages_telegram/TelegramAuthPage.vue"),
	},
	{
		path: "/webview/legal-entity",
		name: "tg-legal-entity",
		component: () => import("@/pages_telegram/TelegramLegalEntityPage.vue"),
	},
	{
		path: "/webview/about",
		name: "tg-about",
		component: () => import("@/pages_telegram/TelegramAboutPage.vue"),
	},
	{
		path: "/webview/profile",
		name: "tg-profile",
		component: () => import("@/pages_telegram/TelegramProfilePage.vue"),
	},
	{
		path: "/webview/prizes",
		name: "tg-prizes",
		component: () => import("@/pages_telegram/TelegramPrizesPage.vue"),
	},
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: TheHomePage,
		},
		{
			path: "/profile/",
			name: "profile",
			component: TheProfilePage,
			meta: { requiresAuth: true },
		},
		...(TELEGRAM_ENABLED ? telegramRoutes : []),
		{
			path: "/:pathMatch(.*)*",
			name: "404",
			component: TheNotFindPage,
		},
	],
	scrollBehavior(to, from, savedPosition) {
		if (to.hash) {
			return false;
		}

		if (savedPosition) {
			return savedPosition;
		}
		return { top: 0 };
	},
});

router.afterEach((to, from) => {
	if (!to.hash) return;

	const id = to.hash.slice(1);
	const storeScroll = useScrollStore();
	const isSamePage = to.path === from.path;
	const delay = isSamePage ? 0 : 600;

	setTimeout(() => {
		const el = document.getElementById(id);
		if (!el) return;
		const headerOffset = storeScroll.header?.offsetHeight || 100;
		const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
		window.scrollTo({ top, behavior: "smooth" });
	}, delay);
});

router.beforeEach((to, from, next) => {
	const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
	const storeRequests = useRequestsStore();

	const { token, uuid, verification_token, ref: refParam } = to.query;
	if (Object.keys(to.query).length) {
		const params = new URLSearchParams(to.query).toString();
		localStorage.setItem("registration_params", params);
	}

	if ( refParam ) {
		localStorage.setItem("ref", refParam);
	}

	if(token) {
		localStorage.setItem("token", token);
		storeRequests.setToken(token);
	}

	if(verification_token && uuid) {
		storeRequests.verification(verification_token, uuid);
	}

	if (requiresAuth && !storeRequests.isAuthenticated) {
		next("/");
	} else {
		next();
	}
});



export default router;
