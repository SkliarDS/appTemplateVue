<script setup>
import { ref, onMounted, computed, nextTick, onUnmounted } from "vue";
import { useRequestsStore } from "@/stores/storeRequests";
import { isIphone } from "@/utils/functions";

const storeRequests = useRequestsStore();

const scrollContainer = ref(null);
const sentinel = ref(null);
let observer = null;

const overflowAuto = computed(() => (storeRequests.winnersList?.length >= 5 ? "--overflow-auto" : ""));
const customScrollBar = computed(() => (storeRequests.winnersList?.length >= 5 && isIphone ? "list-scrollbar" : ""));

const setupObserver = async () => {
	await nextTick();

	if (!sentinel.value || !scrollContainer.value) return;

	if (observer) {
		observer.disconnect();
	}

	observer = new IntersectionObserver(
		(entries) => {
			const entry = entries[0];

			if (entry.isIntersecting && !storeRequests.loadingPrize && !storeRequests.allLoadedPrize) {
				storeRequests.getWinnings();
			}
		},
		{
			root: scrollContainer.value,
			rootMargin: "0px 0px 10px 0px",
			threshold: 0,
		},
	);

	observer.observe(sentinel.value);
};
onMounted(async () => {
	await storeRequests.getWinnings();
	setupObserver();
});
onUnmounted(() => {
	if (observer && sentinel.value) {
		observer.unobserve(sentinel.value);
		observer.disconnect();
	}
});
</script>
<template>
	<section :class="['winners section']" id="winners">
		<div class="container">
			<h2 class="title2 winners__title">Победители</h2>
			<div class="winners__header" v-if="storeRequests.winnersList?.length">
				<span>Имя</span>
				<span>Email</span>
				<span>Задание</span>
				<span>Суперприз</span>
			</div>
			<div class="winners__block">
				<ul :class="['winners__list', overflowAuto, customScrollBar]" v-if="storeRequests.winnersList?.length" ref="scrollContainer">
					<li class="winners__item" v-for="{ user_name, user_last_name, user_email, assignment_name, prize_name, id } in storeRequests.winnersList" :key="id">
						<span>{{ user_name }}</span>
						<span>{{ user_email }}</span>
						<span>{{ assignment_name }}</span>
						<span>{{ prize_name }}</span>
					</li>
					<li ref="sentinel" class="sentinel" v-if="!storeRequests.allLoadedPrize"></li>
					<li v-if="storeRequests.loadingPrize" class="winners__loader">
						<img class="form__loader" width="36" height="36" src="@/assets/img/icons/loader_black.svg" alt="" />
					</li>
				</ul>
				<div class="winners__empty" v-else>
					<p v-if="!storeRequests.loadingPrize">
						<span>Победители скоро будут опубликованы</span>
					</p>
					<div class="winners__loading" v-else>
						<img class="form__loader" style="position: absolute; left: 50%; transform: translateX(-50%)" width="36" height="36" src="@/assets/img/icons/loader_black.svg" alt="изображение" />
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
<style lang="scss" scoped>
@use "@/assets/scss/base/base";
.winners {
	position: relative;
}
.winners__title {
	@media (max-width: $xx) {
		margin-bottom: 1.3rem;
	}
}
.winners__header {
	font-family: var(--second-family);
	font-weight: 400;
	font-size: 2.4rem;
	line-height: 100%;

	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 2rem;
	margin-bottom: 2rem;
	padding: 0px 4.9rem;
	@media (max-width: $xx) {
		display: none;
	}
}
.winners__list {
	&.--overflow-auto {
		max-height: 39.7rem;
		padding-right: 2rem;
		margin-right: -2.5rem;
		@media (max-width: $m) {
			margin-right: 0rem;
			padding-right: 1.4rem;
		}
		@media (max-width: $xx) {
			    max-height: 48.8rem;
		}
	}
}
.winners__item {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	align-items: center;
	gap: 2.5rem;
	padding: 2.9rem 4.3rem;
	background: var(--fill-accent-1-1);
	border-radius: var(--border-radius) 0;
	border: 1px solid var(--border-inverse-1);

	font-family: var(--second-family);
	font-weight: 400;
	font-size: 2.4rem;
	line-height: 100%;
	&:not(:last-child) {
		margin-bottom: 1.6rem;
		@media (max-width: $xx) {
			margin-bottom: 1rem;
		}
	}
	@media (max-width: $xx) {
		grid-template-columns: 1fr;
		gap: 5px;
	}
	@media (max-width: $xx) {
		padding: 1.5rem 2rem;
	}
	span {

		&:last-child {
			@media (max-width: $xx) {
				// display: none;
			}
		}
	}
}
.winners__empty {
	position: relative;
	font-family: var(--second-family);
	font-weight: 400;
	font-size: 4rem;
	line-height: 100%;
	text-align: start;
	@media (max-width: $xx) {
		font-size: 2rem;
	}
}
.winners__loading {
}
.winners__loader {
	display: flex;
	justify-content: center;
	padding: 1rem 0;
}
.sentinel {
	height: 1px;
	flex-shrink: 0;
}

.v-enter-active,
.v-leave-active {
	transition: all 0.2s ease;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
	// transform: translateY(10px);
}
</style>
