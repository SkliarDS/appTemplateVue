<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import { scrollToSection } from "@/utils/functions";
import { useScrollSpy } from "@/composables/useScrollSpy";
import { useScrollStore } from "@/stores/storeScroll";
import { useSettingsStore } from "@/stores/storeSettings";
import { useRequestsStore } from "@/stores/storeRequests";

const storeScroll = useScrollStore();
const storeSettings = useSettingsStore();
const storeRequests = useRequestsStore();

const links = {
	personalData: "Профиль",
	calendar: "Календарь активностей",
	myPrizes: "Мои призы",
	...(storeRequests.isTelegramPage ? {} : { knowledge: "База знаний профи", news: "Новости" }),
	faq: "Вопросы-ответы",
};
const { activeId } = useScrollSpy(Object.keys(links));

const currentLink = ref(links.personalData);
const headerProfile = ref(null);
const activeBtn = ref(false);
const ignoreScrollSpy = ref(false);

const isMobile = computed(() => storeSettings.widthWindow <= 576);

const handleScroll = () => {
	if (activeBtn.value) activeBtn.value = false;
};

const toggleLink = (link, id) => {
	ignoreScrollSpy.value = true;
	currentLink.value = link;
	activeBtn.value = false;
	setTimeout(() => {
		scrollToSection(id);
		ignoreScrollSpy.value = false;
	}, 50);
};
const showOptions = () => {
	activeBtn.value = !activeBtn.value;
};

watch(activeId, (newId) => {
	if (!ignoreScrollSpy.value && newId && links[newId]) {
		currentLink.value = links[newId];
	}
});

onMounted(() => {
	storeScroll.headerProfile = headerProfile.value;
	window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
	window.removeEventListener('scroll', handleScroll);
});
</script>
<template>
	<div class="profile-links" ref="headerProfile" :style="{ top: storeScroll.header?.offsetHeight + 5 + 'px' }">
		<div class="profile-links__container">
			<button v-if="isMobile" :class="['profile-btn btn --mobile --border', {active: activeBtn }]" @click="showOptions">
                {{ currentLink }}
                <svg width='24' height='24'><use href='#check_down'></use></svg>
            </button>
			<Transition>

				<div v-if="isMobile && activeBtn" :class="['profile__links',]">
					<button v-for="(link, id) in links" :key="id" :class="['profile-btn btn --border', { active: currentLink === link }]" @click="toggleLink(link, id)">
						{{ link }}
					</button>
				</div>
			</Transition>
			<div v-if="!isMobile" :class="['profile__links']">
				<button v-for="(link, id) in links" :key="id" :class="['profile-btn btn --border', { active: currentLink === link }]" @click="toggleLink(link, id)">
					{{ link }}
				</button>
			</div>
		</div>
	</div>
</template>
<style lang="scss" scoped>

.profile-links {
	position: sticky;	
	z-index: 3;
	@media (max-width: $t) {
		// position: static;
	}
}
.profile-links__container {
}

.profile__links {
	width: 100%;
	display: flex;
	align-items: start;
	flex-direction: column;
	gap: .8rem;
	animation: active 0.3s ease-in alternate;
    @media (max-width: $t) {
       
    }
	@media (max-width: $xx) {
		position: absolute;
		background: var(--fill-inverse-1);
		border-radius: 3.2rem 0;
		border: 1px solid currentColor;
		overflow: hidden;
		gap: 0;
	}
	&.active {
		@media (max-width: $xx) {
			display: flex;
		}
	}
	.profile-btn {
		@media (max-width: $xx) {
			border: none;
			border-radius: 0;
		}
		&:not(:last-child) {
			@media (max-width: $xx) {
				border-bottom: 1px solid currentColor;
			}
		}
	}
}
.profile-btn {
	width: 100%;
	justify-content: start;
	&.active {
		color: var(--text-inverse-100);
		background: var(--fill-default-1);
		@media (max-width: $xx) {
			background: var(--fill-inverse-1);
			color: var(--fill-default-1);
			border-color: currentColor;
		}
		@media (hover: hover) {
			&:hover {
				background: var(--fill-inverse-1);
				color: var(--fill-default-1);
				border-color: currentColor;
			}
		}
	}
	@media (hover: hover) {
		&:hover {
			color: var(--fill-default-1);
		}
	}
	@media (max-width: $xx) {
		width: 100%;
	}
	@media (max-width: $xx) {
		font-size: 1.6rem;
		height: 4.8rem;
	}

	&.--mobile {
		display: none;
		justify-content: space-between;
		@media (max-width: $xx) {
			display: flex;
		}
		&.active {

			svg {
				transform: rotateX(180deg);
			}
		}
	}

	svg {
		transition: transform var(--transition) ease-in;
	}
}
.v-enter-active,
.v-leave-active {
	transition: all 0.25s ease-out;
}

.v-enter-from {
	opacity: 0;
	transform: translate(0%, 20px);
}
.v-leave-to {
	opacity: 0;
	transform: translate(0%, 20px);
}
</style>
