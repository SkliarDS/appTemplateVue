<script setup>
import { onMounted, ref, nextTick, watch } from "vue";
import { useSettingsStore } from "@/stores/storeSettings";
import { useScrollStore } from "@/stores/storeScroll";
import { useRequestsStore } from "./stores/storeRequests";
import TheHeader from "@/components/sections/TheHeader.vue";
import TheFooter from "@/components/sections/TheFooter.vue";
import TheModals from "@/components/modules/TheModals.vue";
import TheStubPage from "@/pages/TheStubPage.vue";
import BaseCookies from "@/components/modules/BaseCookies.vue";
import TheLoader from "./components/sections/TheLoader.vue";
import { initYandexMetrika } from "@/utils/metrika";
import { loadApmWidget } from "@/utils/apmWidget";

const storeSettings = useSettingsStore();
const storeScroll = useScrollStore();
const storeRequests = useRequestsStore();

const isStubPage = import.meta.env.VITE_SHOW_STUB === "true";

const isShowMobileMenu = ref(false);

// Виджет APM: подключаем после window load и только для авторизованного пользователя (в т.ч. после входа без перезагрузки)
watch(
	() => storeRequests.isAuthenticated,
	(isAuth) => {
		if (isAuth && !isStubPage) loadApmWidget().catch((e) => console.error(e));
	},
	{ immediate: true },
);

onMounted(async () => {
	await nextTick();

	await storeSettings.mainSettings();
	if (storeRequests.isAuthenticated) {
		await storeRequests.userInfo();
	}

	if (!isStubPage) {
		const params = new URLSearchParams(window.location.search);
		if (params.toString()) {
			localStorage.setItem("registration_params", params.toString());
		}
	}

	initYandexMetrika();
});
</script>

<template>
	<div v-ios-scrollbar="{ selectors: ['.list-scrollbar'] }">
		<div v-if="!isStubPage" :class="['wrapper']" id="header">
			<TheHeader @mobile-menu-show="isShowMobileMenu = !isShowMobileMenu" v-if="!storeRequests.isTelegramPage" />

			<main :class="['main', { 'mobile-menu-open': isShowMobileMenu, 'no-padding': storeRequests.isTelegramPage }]" >
				<RouterView />
			</main>
			<TheFooter />
		</div>
		<TheStubPage v-else />
		<BaseCookies v-if="!isStubPage && !storeRequests.isTelegramPage" />
		<TheModals v-if="!isStubPage" />
		<TheLoader v-if="storeRequests.isLoading" />
	</div>
</template>

<style type="scss" scoped></style>
