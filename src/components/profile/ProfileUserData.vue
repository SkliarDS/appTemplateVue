<script setup>
import { computed, ref } from "vue";
import { useRequestsStore } from "@/stores/storeRequests";
import { useSettingsStore } from "@/stores/storeSettings";
import { useModals } from "@/composables/useModals";
import BaseTooltip from '@/components/ui/BaseTooltip.vue';
import BaseToast from '@/components/ui/BaseToast.vue';

const { openModal } = useModals();

const storeRequests = useRequestsStore();
const storeSettings = useSettingsStore();

const profileTitle = computed(() => {
	return storeRequests.userData?.legal_entity ? "Профиль юридического лица" : "Профиль физического лица";
});
const isMobile = computed(() => storeSettings.widthWindow <= 576);
const formatPhoneNumber = (phone) => {
	const formattedPhoneNumber = phone?.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, "7 $2 $3 $4$5");
	return formattedPhoneNumber;
};

const toast = ref(null);
const onResend = async () => {
	const result = await storeRequests.repeatVerification();
	if (result) toast.value?.show(result);
};


</script>
<template>
	<div class="user-data">
		<div class="user-data__holder">
			<div class="user-data__header" v-if="!isMobile">
				<h1 class="user-data__title title3">{{ profileTitle }}</h1>
			</div>
			<div class="user-data__inner">
				<div class="user-data__contacts">
					<h5 class="user-data__contacts-name">{{ storeRequests.userData?.full_name }}</h5>
					<div class="user-data__contacts-row">
						<span>г.{{ storeRequests.userData?.city }}</span>
					</div>
					<div class="user-data__contacts-row">
						<span>{{ formatPhoneNumber(storeRequests.userData?.phone_number) }}</span>
						<span>{{ storeRequests.userData?.email }}</span>
					</div>
					<div class="user-data__contacts-row">
						<span v-if="storeRequests.userData?.legal_entity">{{ storeRequests.userData?.legal_entity?.company_name}}</span>
						<span v-else>{{ storeRequests.userData?.workplace }}</span>
						<span v-if="storeRequests.userData?.legal_entity">{{ storeRequests.userLegalData?.inn }}</span>
						<span>{{ storeRequests.userData?.position }}</span>
					</div>
					<div class="user-data__contacts-row" v-if="storeRequests.userData?.legal_entity">
						<span>{{ storeRequests.userLegalData?.legal_address }}</span>
					</div>
					<div class="user-data__contacts-socials">
						<div class="user-data__contacts-social" v-if="storeRequests.userData?.telegram_username">
							<svg width="20" height="20"><use href="#telegram"></use></svg>
							{{ storeRequests.userData?.telegram_username }}
						</div>
						<div class="user-data__contacts-social" v-if="storeRequests.userData?.vk_username">
							<svg width="20" height="20"><use href="#vk"></use></svg>
							{{ storeRequests.userData?.vk_username }}
						</div>
						<div class="user-data__contacts-social" v-if="storeRequests.userData?.max_username">
							<svg width="20" height="20"><use href="#max"></use></svg>
							{{ storeRequests.userData?.max_username }}
						</div>
					</div>
				</div>
				<div class="user-data__verefication" v-if="!storeRequests.userData?.email_confirmed">
					<p>Пожалуйста, подтвердите адрес электронной почты. Мы&nbsp;отправили письмо со&nbsp;ссылкой&nbsp;на {{ storeRequests.userData?.email }}.</p>
					<p>Не получили письмо? <br>
						<button @click="onResend">
							Отправить ссылку повторно
							<BaseToast ref="toast" />
						</button>
					</p>
				</div>
				<div class="user-data__btns">
					<button @click="openModal('changeUserProfile')" class="user-data__btn btn ">Изменить данные</button>
					<button @click="openModal('changeUserPassword')" class="user-data__btn btn ">Изменить пароль</button>
				</div>
			</div>
		</div>
	</div>
</template>
<style lang="scss" scoped>

.user-data {
	display: flex;
	justify-content: center;
    @media (max-width: $xx) {
        // padding: 3.5rem 0 5rem;
    }
}
.user-data__holder {
	width: 100%;
	display: grid;
	// gap: 20px;
    @media (max-width: $xx) {

    }
}
.user-data__title {
	margin-bottom: 2rem;
	@media (max-width: $xx) {
		margin-bottom: 1rem;
	}
}
.user-data__inner {
	margin-bottom: 3.4rem;
	@media (max-width: $xx) {
		margin-bottom: 4rem;
	}
}
.user-data__contacts {
	display: grid;
	gap: 1.3rem;
	margin-bottom: 2.4rem;
	@media (max-width: $xx) {
		gap: 13px;
		margin-bottom: 24px;
	}
	
}
.user-data__contacts-name {
	font-weight: 400;
	font-size: 2.8rem;
	line-height: 100%;
	@media (max-width: $xx) {
		font-size: 2.4rem;
	}
}
.user-data__contacts-row {
	display: flex;
	align-items: center;
	gap: 12px;
	font-family: var(--second-family);
	font-weight: 400;
	font-size: 2.4rem;
	line-height: 100%;
    @media (max-width: $xx) {
        font-size: 1.8rem;
    }
	span {
		&:not(:first-child) {
			
			
			display: flex;
			align-items: center;
			gap: 12px;
			@media (max-width: $xx) {

			}
			&::before {
				content: '';
				width: 0.4rem;
				height: 0.4rem;
				border-radius: 100%;
				background-color: var(--fill-accent-1-1);
				@media (max-width: $xx) {
					// display: none;
				}
			}
			
		}
	}
}
.user-data__contacts-socials {
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
}
.user-data__contacts-social {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 3px;
	border: 1px solid var(--border-inverse-1);
	border-radius: 3.2rem;
	padding: 0rem 10px 0 8px;
	height: 3.6rem;

	font-family: var(--second-family);
	font-weight: 400;
	font-size: 2rem;
	line-height: 120%;
}
.user-data__verefication {
	position: relative;
	font-family: var(--second-family);
	font-weight: 400;
	font-size: 2.4rem;
	line-height: 100%;
	margin-bottom: 2.4rem;
	@media (max-width: $xx) {
		font-size: 1.8rem;
		line-height: 120%;
	}
	br {
		display: none;
		@media (max-width: $xx) {
			display: block;
		}
	}
	button {
		position: relative;
		border-bottom: 1px solid currentColor;
		@media (hover: hover) {
			&:hover {
				border-color: transparent;
			}
		}
	}
}
.user-data__btns {
	display: flex;
	flex-wrap: wrap;
	gap: 1.6rem;
	@media (max-width: $xx) {
		gap: .5rem;
	}
}
.user-data__btn {

	@media (max-width: $xx) {
		width: 100%;
	}
}
</style>
