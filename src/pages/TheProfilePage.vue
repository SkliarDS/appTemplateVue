<script setup>
import { ref, onMounted, computed } from "vue";
import { useScrollStore } from "@/stores/storeScroll";
import { useRequestsStore } from "@/stores/storeRequests";
import { useSettingsStore } from "@/stores/storeSettings";
import { RouterLink } from "vue-router";
import { useModals } from "@/composables/useModals";
import ProfileFilter from "@/components/profile/ProfileFilter.vue";
import ProfileUserData from "@/components/profile/ProfileUserData.vue";
import TheFaq from "@/components/sections/TheFaq.vue";
import ProfileUserPrizes from "@/components/profile/ProfileUserPrizes.vue";

const storeScroll = useScrollStore();
const storeSettings = useSettingsStore();
const storeRequests = useRequestsStore();
const { openModal } = useModals();

const welcomeTask = ref({});

const profileTitle = computed(() => {
	return storeRequests.userData?.legal_entity ? "Профиль юридического лица" : "Профиль физического лица";
});


onMounted( async() => {
});
</script>
<template>
	<section class="profile">
		<div class="container">
			<div class="profile__container">

				<div class="profile__header" >
					<h1 class="profile__title title3">{{ profileTitle }}</h1>
				</div>

				<ProfileFilter />
				<div class="profile__sections">

					<div class="profile__section profile__user-data" id="personalData">					
						<ProfileUserData />				
					</div>				

				

					<div class="profile__section profile__user-prizes profile__line" id="myPrizes">						
						<ProfileUserPrizes />
					</div>
				</div>
			</div>
		</div>
		<TheFaq class="profile__faq"/>
	</section>
</template>
<style lang="scss" scoped>
@use "@/assets/scss/base/typography";

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
