<script setup>
import { onMounted, useTemplateRef, ref, computed, useAttrs } from "vue";
import { useScrollStore } from "@/stores/storeScroll";
import { useSettingsStore } from "@/stores/storeSettings";
import { RouterLink, useRoute, useRouter } from "vue-router";
import TheHeaderBtns from "./TheHeaderBtns.vue";
import { sendMetrik } from "@/utils/metrika";

const router = useRouter();

const storeScroll = useScrollStore();
const storeSettings = useSettingsStore();
const route = useRoute();

const header = useTemplateRef("header");


const isProfilePage = computed(() => route.name === "profile" ? '--profile-page' : '');

const isMobile = computed(() => storeSettings.widthWindow <= 1200);

const links = [
	{
		href: "tasks",
		label: "Задания",
	},
	{
		href: "prizes",
		label: "Призы",
	},
	{
		href: "news",
		label: "Новости",
	},
	{
		href: "faq",
		label: "Вопросы-ответы",
	},
];

const onMetrica = (key) => {
	switch (key) {
		case "tasks":
			sendMetrik("reachGoal", "task");
			break;
		case "prizes":
			sendMetrik("reachGoal", "gift");
			break;
		case "news":
			sendMetrik("reachGoal", "news");
			break;
		case "faq":
			sendMetrik("reachGoal", "faq");
			break;
	}
};

const mobileMenuActive = ref(false);


defineProps({
	pageLoaded: {
		type: Boolean,
	},
});
const emit = defineEmits(["mobileMenuShow"]);
defineOptions({ inheritAttrs: false });
const attrs = useAttrs();

const mobileMenu = () => {
	if (storeSettings.widthWindow > 1200) return;

	mobileMenuActive.value = !mobileMenuActive.value;
	emit('mobileMenuShow');
	if (mobileMenuActive.value) {
		document.body.classList.add("noscroll");
	} else {
		document.body.classList.remove("noscroll");
	}
};

onMounted(async () => {
	storeScroll.header = header.value;
	
});
</script>
<template>
	<div id="overlay" @click="mobileMenu" :class="{ active: mobileMenuActive }"></div>
	<header v-bind="attrs" :class="['header', isProfilePage, { '--fixed': storeScroll.headerFixed }, { active: mobileMenuActive }]" ref="header">
		<div class="container --header">
			<div class="header__container">
				<div class="logos">
					<RouterLink to="/#header" class="logo">
						<img class='' width="218" height="61" src='@/assets/img/icons/logo.webp' srcset='@/assets/img/icons/logo@2x.webp 2x' alt='изображение логотипа'>
					</RouterLink>
				</div>
				<nav class="nav">
					<RouterLink
						:to="`/#${link.href}`"
						:class="['nav__link']"
						@click="onMetrica(link.href), mobileMenu()"
						v-for="link in links"
						:key="link.href"
					>
						{{ link.label }}
					</RouterLink>
					<TheHeaderBtns class="--mobile" :mobileMenuActive="mobileMenuActive" @mobileMenuShow="mobileMenu()" />
				</nav>

				<TheHeaderBtns class="--desktop" :mobileMenuActive="mobileMenuActive" @mobileMenuShow="mobileMenu()" />

				<div @click="mobileMenu" :class="['nav-icon', { active: mobileMenuActive }]"><span></span></div>
			</div>
		</div>
	</header>
</template>
<style lang="scss" scoped>
@use "@/assets/scss/blocks/nav-icon";
.header {
	display: flex;
	align-items: center;
	width: 100%;
	position: fixed;
	width: 100%;
	top: 0px;
	left: 0px;
	height: var(--header-height);
	background: var(--fill-inverse-1);
	z-index: 5;
	border-bottom: 1px solid  var(--text-default-100);
	transition: 0.2s ease-in;
	
	@media (max-width: $xx) {
	}
	&.--fixed {
		.logos {
			position: relative;
			opacity: 1;
			pointer-events: all;
		}
	}
	&.active {
		.nav {
			left: 0;
			opacity: 1;
		}
	}
}
.header__container {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	@media (max-width: $t) {
	}
}
.logos {
	position: absolute;
	opacity: 0;
	pointer-events: none;
	transition:  var(--transition) ease-in;
	@media (max-width: $t) {
		position: relative;
		opacity: 1;
		pointer-events: all;
	}
}
.logo {
	position: relative;
	display: block;
	z-index: 3;
	width: 21.8rem;

	@media (max-width: $l) {
		width: 18rem;
	}

	@media (max-width: $xx) {
		width: 13.4rem;
	}
}

.nav {
	display: flex;
	align-items: center;
	gap: 7.2rem;
	@media (max-width: $t) {
		position: fixed;
		flex-direction: column;
		align-items: start;
		// justify-content: space-between;
		z-index: 2;
		top: 0%;
		left: -100%;
		opacity: 0;
		background: var(--fill-inverse-1);
		padding: 100px var(--padding-container) 20px;
		width: 100%;
		max-width: 100%;
		gap: 8px;
		transition: all 0.5s ease-in;
		overflow-y: auto;
		height: 100dvh;
		padding: 114px var(--padding-container) 20px;
		gap: 30px;
		align-items: center;
	}
	@media (max-width: $xx) {
	}
}
.nav__link {
	font-family: var(--second-family);
	font-weight: 400;
	font-size: 3.2rem;
	line-height: 75%;
	color: var(--text-default-100);
	border-bottom: 2px solid transparent;
	@media (hover: hover) {
		&:hover {
			border-color: currentColor;
		}
	}
	@media (max-width: $lg) {
		// font-size: 2.4rem;
	}
	@media (max-width: $xx) {
		font-size: 2.4rem;
	}
}

@keyframes animHeader {
	0% {
		transform: translateY(-100%);
	}
	100% {
		transform: translateY(0%);
	}
}
</style>
