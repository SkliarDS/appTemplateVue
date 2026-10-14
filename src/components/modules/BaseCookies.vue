<script setup>
import { ref, onMounted } from "vue";
import cookies from "browser-cookies";
import { cookiesUrl, policyUrl} from "@/utils/provider";
// import { initYandexMetrika } from "@/utils/metrika";

const COOKIE_NAME = "cookieConsent";
const COOKIE_EXPIRATION_DAYS = 182;

const show = ref(false);

onMounted(() => {
	const consent = cookies.get(COOKIE_NAME);
	if (!consent) {
		show.value = true;
	} else {
		// initYandexMetrika();
	}
});

const acceptCookies = () => {
	cookies.set(COOKIE_NAME, "true", { expires: COOKIE_EXPIRATION_DAYS });
	show.value = false;
	// initYandexMetrika();
};
</script>
<template>
	<div class="cookies" v-if="show">
		<div class="cookies__container">
			<div class="cookies__content">
				<p>
					Мы используем файлы cookie для улучшения вашего опыта на сайте. <br> Продолжая использовать наш сайт, вы соглашаетесь с использованием <a :href="cookiesUrl" target="_blank">файлов cookie</a>. <br> Подробнее о нашей
					<a target="_blank" :href="policyUrl">политике конфиденциальности.</a>
				</p>
			</div>
			<button class="btn cookies__btn --big" @click="acceptCookies">Согласиться</button>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.cookies {
	position: fixed;
	
	width: 120rem;
	left: 50%;
	bottom: 12px;
	transform: translateX(-50%);
	border: 1px solid var(--border-inverse-1);
	border-radius: var(--border-radius) 0;
	background: var(--fill-inverse-1);
	padding: 3.2rem;
	z-index: 3;
	@media (max-width: $t) {
		width: 97%;
	}
	@media (max-width: $m) {
	}
	@media (max-width: $xx) {
		padding: 1.2rem 1rem;
		padding: 1.6rem;
		width: 95%;		
	}
}
.cookies__container {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 2.4rem;
	@media (max-width: $xx) {
		flex-direction: column;
		gap: 1.2rem;
	}
}
.cookies__content {
	max-width: 97.7rem;
	font-family: var(--second-family);
	font-weight: 400;
	font-size: 2.4rem;
	line-height: 100%;
	color: var(--text-default-100);
	@media (max-width: $xx) {
		font-size: 1.2rem;
	}
	a {
		white-space: nowrap;
		color: var(--text-default-100);
		border-bottom: 1px solid currentColor;
		@media (hover: hover) {
			&:hover {
				border-color: transparent;
			}
		}
	}
	br {
		@media (max-width: $t) {
			display: none;
		}
	}
}

.cookies__btn {
	// padding: 2.3rem 3rem;
	@media (max-width: $xx) {
		width: 100%;
	}
	@media (max-width: $xx) {
		height: 4.8rem;
	}
	@media (hover: hover) {
		&:hover {
		}
	}
}
</style>
