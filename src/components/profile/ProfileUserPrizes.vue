<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRequestsStore } from "@/stores/storeRequests";
import { useSettingsStore } from "@/stores/storeSettings";
import { useModals } from "@/composables/useModals";
import BaseCopyTooltip from "@/components/ui/BaseCopyTooltip.vue";

const storeRequests = useRequestsStore();
const storeSettings = useSettingsStore();
const { openModal } = useModals();

const MOBILE_LIMIT = 2;

const isMobile = computed(() => storeSettings.widthWindow <= 480);

const userPrizesList = ref([]);
const nextList = ref(null);
const offset = ref(0);
const isPrizesLoaded = ref(false);

const listStatusPrizes = {
	pending: 'Ожидает подтверждения',
	confirmed: 'Подтверждён',
	shipped: 'Отправлен',
	delivered: 'Доставлен',
	cancelled: 'Отменён',
}

const showStatusPrizes = (status) => listStatusPrizes[status];


const loadInitial = async () => {
	if (isMobile.value) {
		const prizesData = await storeRequests.userPrizes(0, MOBILE_LIMIT);
		userPrizesList.value = prizesData?.results ?? [];
		nextList.value = prizesData?.next ?? null;
		offset.value = MOBILE_LIMIT;
	} else {
		const prizesData = await storeRequests.userPrizes(0, 1000);
		userPrizesList.value = prizesData?.results ?? [];
		nextList.value = null;
		offset.value = prizesData?.results?.length ?? 0;
	}
};

const showMorePrizes = async () => {
	isPrizesLoaded.value = true;
	const prizesData = await storeRequests.userPrizes(offset.value, MOBILE_LIMIT);
	userPrizesList.value = [...userPrizesList.value, ...(prizesData?.results ?? [])];
	nextList.value = prizesData?.next ?? null;
	offset.value += MOBILE_LIMIT;
	isPrizesLoaded.value = false;
};

const copy = async (text, show) => {
	await navigator.clipboard.writeText(text);
	show();
};

watch(isMobile, async (newVal, oldVal) => {
	if (oldVal === true && newVal === false) {
		const prizesData = await storeRequests.userPrizes(offset.value, 1000);
		userPrizesList.value = [...userPrizesList.value, ...(prizesData?.results ?? [])];
		nextList.value = null;
	}
});

watch(() => storeRequests.isChangedPrize, async (newValue) => {
	if (newValue) {
		await loadInitial();
		storeRequests.isChangedPrize = false;
	}
});

onMounted(loadInitial);
</script>
<template>
	<div class="user-prizes">
		<div class="user-prizes__holder" v-if="userPrizesList?.length">
			<div class="user-prizes__header">
				<h2 class="user-prizes__title title3">Накапливайте баллы и обменивайте их на ценные призы!</h2>
				<RouterLink to="/#prizes" class="user-prizes__btn btn">Смотреть все призы</RouterLink>
			</div>
			<ul class="user-prizes__list">
				<li class="user-prizes__item" v-for="(prize, index) of userPrizesList" :key="prize.id">
					<div class="user-prizes__image">	
						<span class="user-prizes__label label --big">{{prize.prize.points_cost}} баллов</span>					
						<img class="full-img" width="330" height="330" :src="prize.prize.image" alt="изображение" />
					</div>
					<div class="user-prizes__content">
						<h5 class="user-prizes__name">{{ prize.prize.name }}</h5>
						<!-- <p class="user-prizes__status">{{ showStatusPrizes(prize.status) }}</p> -->
						<div class="user-prizes__links" v-if="prize.tracking_number && prize.tracking_url">
							<BaseCopyTooltip class="user-prizes__btn-copy" title="Cкопировать" text="Номер скопирован">
								<template #default="{ show }">
									<span @click="copy(prize.tracking_number ?? '', show)">
										<svg width="32" height="32"><use href="#copy"></use></svg>
										{{ prize.tracking_number }}
									</span>
								</template>
							</BaseCopyTooltip>
							<a :href="prize.tracking_url" target="_blank" rel="noopener noreferrer" class="user-prizes__link">Отследить</a>
						</div>
					</div>
				</li>
			</ul>
			<button @click="showMorePrizes" v-if="nextList" class="user-prizes__more-show btn ">
				<span v-if="!isPrizesLoaded">Показать ещё</span>
				<img v-else class="form__loader" width="36" height="36" src="@/assets/img/icons/loader.svg" alt="изображение" />
			</button>
		</div>
		<div class="profile-empty" v-else>
			<h2 class="profile-empty__title title3">Накапливайте баллы и обменивайте их на ценные призы!</h2>
			<RouterLink to="/#prizes" class="profile-empty__btn btn">Смотреть все призы</RouterLink>
			<p class="profile-empty__desc">Призов пока нет. Выполняйте задания, накапливайте баллы и обменивайте их на призы</p>
		</div>
	</div>
</template>
<style lang="scss" scoped>
.user-prizes {
}
.user-prizes__holder {
	display: flex;
	flex-direction: column;
	gap: 2.3rem;
	@media (max-width: $xx) {
		gap: 3rem;
	}
}
.user-prizes__header {
	width: 100%;
	display: flex;
	align-items: end;
	justify-content: space-between;
	gap: 1rem;
	@media (max-width: $xx) {
		flex-direction: column;
		gap: 2rem;
	}
}
.user-prizes__title {
	max-width: 60rem;
	@media (max-width: $xx) {
		max-width: 100%;
		width: 100%;
	}
}
.user-prizes__btn {
	@media (max-width: $xx) {
		width: 100%;
	}
}
.user-prizes__list {
	width: 100%;
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(26rem, 1fr));
	gap: 4.8rem 2.5rem;
	@media (max-width: $xx) {
		gap: 3rem;
	}
	
}

.user-prizes__item {
	display: flex;
	flex-direction: column;
	gap: 1.6rem;
}
.user-prizes__image {
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	border: 1px solid var(--border-inverse-1);
	border-radius: var(--border-radius) 0;
	box-shadow: 0 16px 25px 0 rgba(73, 41, 18, 0.15);
	overflow: hidden;
	padding: 37px;
	@media (max-width: $xx) {
		padding: 5rem;

	}
	img {
		aspect-ratio: 1/1;
	}
}
.user-prizes__label {
	position: absolute;
	&.--big {
		right: 2.4rem;
		bottom: 2.4rem;
		top: unset;
		left: unset;
		@media (max-width: $xx) {
			right: 1.5rem;
			bottom: 1.5rem;
			font-size: 2.8rem;
    		padding: 0.8rem 1.6rem 0.4rem;
		}
	}
}
.user-prizes__content {
	display: grid;
	gap: 1rem;
}
.user-prizes__name {
	font-weight: 400;
	font-size: 2.8rem;
	line-height: 100%;
}
.user-prizes__status {
	font-family: var(--second-family);
	font-weight: 400;
	font-size: 2.4rem;
	line-height: 100%;
}
.user-prizes__links {
	display: flex;
	align-items: center;
	gap: 1rem;
}
.user-prizes__btn-copy {
	border-radius: 0.9rem;
	padding: 6px;
	background: var(--fill-default-1);
	font-family: var(--second-family);
	font-weight: 400;
	font-size: 2rem;
	line-height: 100%;
	color: var(--text-inverse-100);
	border: 1px solid var(--border-inverse-1);
	svg {
		width: 20px;
		height: 20px;
	}
	span {
		display: flex;
		align-items: center;
		gap: 6px;
	}
	@media (hover: hover) {
		&:hover {
			color: var(--fill-default-1);
			background-color: var(--text-inverse-100);
		}
	}
}
.user-prizes__link {
	font-family: var(--second-family);
	font-weight: 400;
	font-size: 3.2rem;
	line-height: 100%;
	border-bottom: 1px solid currentColor;
	color: var(--fill-default-1);
	@media (hover: hover) {
		&:hover {
			border-color: transparent;
		}
	}
}

.user-prizes__more-show {
	// margin-top: 6rem;
	@media (max-width: $xx) {
		width: 100%;
		// margin-top: 3.6rem;
	}
}

</style>
