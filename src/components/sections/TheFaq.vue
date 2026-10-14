<script setup>
import { ref, computed, watch, onUnmounted, nextTick } from "vue";
import { useModals } from "@/composables/useModals";
import { useScrollStore } from "@/stores/storeScroll";
import { useSettingsStore } from "@/stores/storeSettings";
import { useRequestsStore } from "@/stores/storeRequests";
import { rulesUrl } from "@/utils/provider";
import { sendMetrik } from "@/utils/metrika";
import { useRoute } from "vue-router";

const { openModal } = useModals();
const storeScroll = useScrollStore();
const storeSettings = useSettingsStore();
const storeRequests = useRequestsStore();
const route = useRoute();

const faqActive = ref({});
const dataFaq = ref([]);
const smoother = ref(null);
const sentinel = ref(null);

const PAGE_SIZE = 10;
const currentOffset = ref(0);
const hasMore = ref(false);
const isLoadingMore = ref(false);

let observer = null;

const loadFaq = async (type, reset = false) => {
    if (reset) {
        dataFaq.value = [];
        currentOffset.value = 0;
        hasMore.value = false;
    }
    isLoadingMore.value = true;
    const result = await storeSettings.getFaq(type, currentOffset.value, PAGE_SIZE);
    if (result) {
        dataFaq.value = [...dataFaq.value, ...result.results];
        currentOffset.value += result.results.length;
        hasMore.value = !!result.next;
    }
    isLoadingMore.value = false;
};

const setupObserver = () => {
    if (observer) observer.disconnect();
    if (!sentinel.value) return;
    observer = new IntersectionObserver(
        async (entries) => {
            if (entries[0].isIntersecting && hasMore.value && !isLoadingMore.value) {
                await loadFaq(getStatusUser.value);
            }
        },
        { root: sentinel.value.closest('.faq__list'), threshold: 0 }
    );
    observer.observe(sentinel.value);
};

onUnmounted(() => observer?.disconnect());

const isProfilePage = computed(() => route.name === "profile");

const formatText = (text) => {
	let formattedText = text.replace(/\r?\n/g, "<br>");

	const urlPattern = /(?<!<a href=")(https?:\/\/[^\s]+)(?!")/g;

	formattedText = formattedText.replace(urlPattern, '<a href="$1" target="_blank">$1</a>');

	return formattedText;
};

const formatAnswer = (text) => {
	if (!text) return "";
	const escaped = text.replace(/(?:\r\n|\r|\n)/g, "<br>").replace("Правил по ссылке", `<a href="${rulesUrl}" target="_blank" rel="noopener noreferrer">ссылке</a>`);
	return escaped;
};

const openFaqItem = (index) => {
	const newActiveState = {};
	for (let i = 0; i < dataFaq.value.length; i++) {
		newActiveState[i] = i === index ? !faqActive.value[index] : false;
	}
	faqActive.value = newActiveState;
};

const getStatusUser = computed(() => storeRequests.userData?.legal_entity && isProfilePage.value ? "legal_entity" : "all")

watch(
	() => storeRequests.userData,
	async (userData) => {
		if (!userData) return;
		await loadFaq(getStatusUser.value, true);
		await nextTick();
		setupObserver();
	},
	{ immediate: true }
);
</script>
<template>
	<section class="faq section" id="faq">
		<div class="container">
			<h2 class="faq__title title2">Вопросы-ответы</h2>
			<div class="faq__header">
				<h2></h2>
				<h2 class="faq__title3 title3">Вопросы-ответы</h2>
			</div>
			<div class="faq__container">
				<ul v-if="dataFaq.length" class="faq__list list-scrollbar">
					<li :class="['faq__item', { active: faqActive[index] }]" data-accordion-parent v-for="(faq, index) in dataFaq" :key="index" @click="openFaqItem(index)">
						<div class="faq__question">
							<span v-html="formatText(faq.question)"></span>
							<div class="faq__btn">
								<svg width="32" height="32"><use href="#check_down"></use></svg>
							</div>
						</div>
						<div class="faq__answer" data-accordion-hidden>
							<div style="min-height: 0" v-html="formatAnswer(faq.answer)"></div>
						</div>
					</li>
					<li v-if="hasMore" ref="sentinel" class="faq__sentinel"></li>
					<li v-if="isLoadingMore" class="faq__loader">
						<img class="form__loader" width="36" height="36" src="@/assets/img/icons/loader_black.svg" alt="" />
					</li>
				</ul>
				<div class="faq__block" :style="{ top: storeScroll.header?.offsetHeight + 20 + 'px' }">
					<div class="faq__block-content">
						<h3 class="faq__block-title">Остались вопросы?</h3>
						<p class="faq__block-text">Напишите нам, и мы обязательно вам ответим!</p>
					</div>
					<button class="faq__feedback-btn btn --big" @click="(openModal('feedback'), sendMetrik('reachGoal', 'klik_button_ask_question'))">Задать вопрос</button>
				</div>
			</div>
		</div>
	</section>
</template>
<style lang="scss" scoped>
@use "@/assets/scss/blocks/accordion-grid.scss";
.faq {
	position: relative;
}

.faq__title {
	@media (max-width: $xx) {
		margin-bottom: 1.5rem;
	}
}
.faq__header {
	display: none;
	grid-template-columns: 28rem 1fr;
	align-items: start;
	gap: 8rem;
	z-index: 1;
	margin-bottom: 20px;
	@media (max-width: $t) {
		gap: 4rem;
	}
	@media (max-width: $t) {
		grid-template-columns: 25rem 1fr;
		gap: 2rem;
	}
	@media (max-width: $xx) {
		grid-template-columns: 1fr;
		gap: 1.5rem;
	}
}
.faq__title3 {
}
.faq__container {
	position: relative;
	display: flex;
	grid-template-columns: 1fr 28rem;
	align-items: start;
	gap: 6rem;
	z-index: 1;
	@media (max-width: $t) {
		grid-template-columns: 1fr 25rem;
		gap: 2rem;
	}
	@media (max-width: $xx) {
		grid-template-columns: 1fr;
		gap: 2rem;
		flex-direction: column;
	}
}

.faq__sentinel {
	height: 1px;
	flex-shrink: 0;
}
.faq__loader {
	display: flex;
	justify-content: center;
	padding: 1rem 0;
}
.faq__list {
	display: grid;
	gap: 1.6rem;
	max-height: 54rem;
	padding-right: 2rem;
	@media (max-width: $xx) {
		padding-right: 1.2rem;
		max-height: 44.1rem;
	}
}
.faq__item {
	padding: 4.3rem 4rem 3.8rem;
	transition: var(--transition) ease-in;
	border: 1px solid var(--border-inverse-1);
	border-radius: var(--border-radius) 0;
	background: var(--fill-accent-1-1);
	@media (max-width: $t) {
	}
	@media (max-width: $xx) {
		padding: 2.4rem 1.6rem;
	}
	&.active {
		.faq__btn {
			transform: rotateX(180deg);
		}
		.faq__answer {
			padding-top: 1.4rem;
			@media (max-width: $xx) {
				padding-top: 1rem;
			}
		}
	}
}
.faq__question {
	width: 100%;
	display: flex;
	align-items: start;
	justify-content: space-between;
	gap: 2.4rem;
	font-size: 3.2rem;
	cursor: pointer;
	@media (max-width: $xx) {
		font-size: 2.4rem;
		gap: 1.5rem;
	}
	@media (hover: hover) {
		&:hover {
			.faq__btn {
			}
		}
	}
}
.faq__btn {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	width: 3.2rem;
	height: 3.2rem;
	transition: var(--transition) ease-in;
	@media (max-width: $xx) {
	}
	svg {
		width: 100%;
		height: 100%;
	}
}
.faq__answer {
	font-family: var(--second-family);
	font-weight: 400;
	font-size: 2.4rem;
	line-height: 160%;
	@media (max-width: $xx) {
		font-size: 2rem;
	}
	a {
		color: inherit;
		@media (hover: hover) {
			&:hover {
				text-decoration: underline;
			}
		}
	}

	span {
		font-family: var(--third-family);
	}
	:deep(span) {
	}
}

.faq__block {
	position: sticky;
	z-index: 1;
	border-radius: var(--border-radius) 0;
	border: 1px solid var(--border-inverse-1);
	background: var(--fill-inverse-1);
	width: 28rem;
	@media (max-width: $t) {
		width: 25rem;
	}
	@media (max-width: $xx) {
		width: 100%;
	}
}
.faq__block-content {
	padding: 3.2rem 2.4rem 2rem;
}
.faq__block-title {
	font-size: 2.8rem;
	line-height: 100%;
	margin-bottom: 0.5rem;
	@media (max-width: $xx) {
		font-size: 2.4rem;
		margin-bottom: 0.7rem;
	}
}
.faq__block-text {
	font-family: var(--second-family);
	font-weight: 400;
	font-size: 2.4rem;
	line-height: 100%;
	@media (max-width: $xx) {
		font-size: 1.8rem;
	}
}
.faq__feedback-btn {
	width: 100%;
	margin-top: auto;
	@media (max-width: $xx) {
	}
}
</style>
