<script setup>
import { onMounted, computed } from "vue";
import { useScrollStore } from "@/stores/storeScroll";
import { useRequestsStore } from "@/stores/storeRequests";
import { useSettingsStore } from "@/stores/storeSettings";
import { RouterLink } from "vue-router";
import { useModals } from "@/composables/useModals";
import ProfileFilter from "@/components/profile/ProfileFilter.vue";
import ProfileUserData from "@/components/profile/ProfileUserData.vue";
import TheFaq from "@/components/sections/TheFaq.vue";
import ProfileUserPrizes from "@/components/profile/ProfileUserPrizes.vue";
import TelegramHeader from "@/pages_telegram/TelegramHeader.vue";

const storeScroll = useScrollStore();
const storeSettings = useSettingsStore();
const storeRequests = useRequestsStore();
const { openModal } = useModals();

const profileTitle = computed(() => {
	return storeRequests.userData?.legal_entity ? "Профиль юридического лица" : "Профиль физического лица";
});

const isMobile = computed(() => storeSettings.widthWindow <= 576);

onMounted( async() => {
	await storeRequests.userInfo();
});
</script>
<template>
	<section class="profile tg-page">
        <TelegramHeader />
		<div class="container">
			<div class="profile__container">

				<div class="profile__header" v-if="isMobile">
					<h1 class="profile__title title3">{{ profileTitle }}</h1>
				</div>

				<ProfileFilter />
				<div class="profile__sections">

					<div class="profile__section profile__user-data" id="personalData">					
						<ProfileUserData />				
					</div>				

					<!-- storeRequests.userData?.legal_entity -->

					<div class="profile__section user-activities" id="calendar">
						<div class="profile-empty  profile__line" v-if="storeRequests.userData?.legal_entity"> 
							<h2 class="profile-empty__title title3">Календарь активностей</h2>
							<p class="profile-empty__desc">Задания для пользователей со статусом юридического лица пока недоступны. Следите за обновлениями!</p>
						</div>
						<div class="profile__sections" v-else>
						</div>
					</div>

					<div class="profile__section profile__user-prizes profile__line" id="myPrizes">
						<div class="profile-empty" v-if="storeRequests.userData?.legal_entity"> 
							<h2 class="profile-empty__title title3">Призы</h2>
							<RouterLink to="/#prizes" class="profile-empty__btn btn">Смотреть все призы</RouterLink>
							<p class="profile-empty__desc">Обмен баллов на призы пока недоступен для пользователей со статусом юридического лица. Следите за обновлениями!</p>
						</div>
						<div class="profile__sections" v-else>
							<ProfileUserPrizes />
						</div>							
					</div>
				</div>
			</div>
		</div>
		<TheFaq class="profile__faq"/>
	</section>
</template>
<style lang="scss" scoped>
@use "@/assets/scss/base/typography";
.profile {
	padding-bottom: 20px;
}
.profile__container {
	position: relative;
	display: grid;
	grid-template-columns: 28rem 1fr;
	align-items: start;
	gap: 8rem;
	z-index: 2;
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
.profile__title {
    text-align: center;
}
.profile__sections {
	display: grid;
	gap: 3.5rem;
	@media (max-width: $xx) {
		gap: 4rem;
	}
}
.profile__header {
	display: grid;
	gap: 2rem;
	@media (max-width: $xx) {
		gap: 1rem;
	}
}
.profile__section {
	
}
.profile__line {
	border-bottom: 1px solid var(--border-inverse-1);
	padding-bottom: 4rem;
}
.profile__user-data {
}
.profile__user-prizes {
}
.profile__user-news {
	:deep(.news) {
		background-color: transparent;
		border: none;
		padding: 0;
	}
	:deep(.container){
		max-width: 100%;
		padding: 0;
	}
	:deep(.news__container) {
		grid-template-columns: 1fr;
		gap: 32px;
	}
	:deep(.title2){
		@extend .title3;
		text-transform: none;
		margin-bottom: 2.3rem;
		@media (max-width: $xx) {
			margin-bottom: 23px;
		}
	}
	:deep(.news__tabs) {
		.filter__desctop {
			flex-direction: row;
		}
		.filter__btn.--desktop {
			width: fit-content;
		}
	}
}
.profile__knowledge {
	min-width: 0;
}

.profile__faq {
	padding: 4rem 0 0;
	@media (max-width: $xx) {
		padding: 2rem 0 0;
	}
	&::before {
		background-image: none;
	}
	:deep(.faq__container) {
		flex-direction: row-reverse;
		gap: 8rem;
		@media (max-width: $t) {
			gap: 4rem;
		}
		@media (max-width: $t) {
			gap: 2rem;
		}
		@media (max-width: $xx) {
			flex-direction: column;
			
		}
	}
	:deep(.faq__title){
		display: none;
	}
	:deep(.faq__header){
		display: grid;
	}
}
.tg-page {
    :deep(.faq__block) {
        display: none;
    }
}
.v-enter-active,
.v-leave-active {
	transition: 0.5s ease;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
	transform: translateY(10px);
}
</style>
