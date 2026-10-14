<script setup>
import { computed } from "vue";
import { useRequestsStore } from "@/stores/storeRequests";
import { useSettingsStore } from "@/stores/storeSettings";
import { useModals } from "@/composables/useModals";
import { sendMetrik } from "@/utils/metrika";
import { useRouter } from "vue-router";

const { openModal } = useModals();
const storeRequests = useRequestsStore();
const storeSettings = useSettingsStore();
const router = useRouter();

defineProps({
	mobileMenuActive: Boolean,
});

const emit = defineEmits(['mobileMenuShow']);

const userName = computed(() => {
	if (storeRequests.userData.full_name === undefined) {
		return "Профиль";
	} else {
		return `${storeRequests.userData?.full_name}`;
	}
});

const clickBtnPfofile = () => {
	if (storeSettings.statusStockFuture) {
		openModal("promoNotStart");
	}

	if (storeSettings.statusStockPast || storeSettings.statusStockActive) {
		openModal("authorizationRequired");
	}
};
const clickBtnClub = () => {
	if (storeSettings.statusStockFuture) {
		openModal("promoNotStart");
	}
	if (storeSettings.statusStockPast) {
		openModal('promoEnd');
	}
	if (storeSettings.statusStockActive) {
		openModal("registration");
		sendMetrik("reachGoal", "join");
	}
};

const mobileMenu = () => {
	emit('mobileMenuShow');
};

const handleClick = () => {
	mobileMenu()
	if(!storeRequests.isAuthenticated) {
		clickBtnPfofile()
	} else {
		router.push("/profile");
	}
	sendMetrik("reachGoal", "profile");
};

</script>

<template>
	<div class="header__profile-btns" :class="{'--grid-1fr': !storeRequests.isAuthenticated}">
		<button v-if="!storeRequests.isAuthenticated" class="header__btn btn" @click="clickBtnClub()">
			<span>Вступить в клуб</span>
		</button>
		<button class="header__btn btn" @click="handleClick()">
			<svg width='32' height='32'><use href='#user'></use></svg>
			<span>Профиль</span>
		</button>
		<button v-if="storeRequests.isAuthenticated" @click="storeRequests.logout(), mobileMenu()" class="header__btn header__logout btn  --icon --hover-green">
			<svg width="24" height="24"><use href="#logout"></use></svg>
		</button>
	</div>
</template>

<style lang="scss" scoped>

.header__profile-btns {
	
	align-items: center;
	gap: 1.2rem;
	flex-shrink: 0;
	@media (max-width: $t) {
		flex-wrap: wrap;
		width: 100%;
	}
	@media (max-width: $xx) {
		gap: 0;
	}
	&.--desktop {
		display: flex;
		@media (max-width: $t) {
			display: none;
		}
	}
	&.--mobile {
		display: none;
		gap: 0.8rem;
		width: 100%;
		@media (max-width: $t) {
			display: grid;
			grid-template-columns: 1fr 1fr auto;
			margin-top: auto;
		}
		@media (max-width: $xx) {
			grid-template-columns: 1fr auto;
		}
		&.--grid-1fr {
			grid-template-columns: 1fr 1fr;
			.header__btn  {
				@media (max-width: $xx) {
					grid-template-columns: 1fr;
					grid-column: 1/3;
				}

			}
		}
	}
}

.header__btn {
	@media (max-width: $xx) {
		font-size: 2rem;
	}
	&:nth-child(1) {
		
		&.--hide {
			visibility: hidden;
		}
	}
	span {
		// width: 80px;
		// overflow: hidden;
		// text-overflow: ellipsis;
	}
}

.header__logout{
	@media (max-width: $t) {
		width: 100%;
	}
	@media (max-width: $xx) {
		width: 5.6rem;
	}
	svg {
		stroke: transparent;
	}
	@media (hover: hover) {
		&:hover {
			
		}
	}
}

.header__profile-btns.--fixed {
	// height: 48px;
	.header-btn {
		font-size: 2rem;
		color: var(--text-accent-1-100);
		border-color: rgba(14, 14, 14, 0.16);
		svg {
			width: 2.4rem;
			height: 2.4rem;
		}
		@media (hover: hover){
			&:hover {
				background: var(--fill-accent-1-1);
				color: var(--text-inverse-100);
				border-color: currentColor;
			}
		}
	}
	.btn-logout {
		color: var(--text-accent-1-100);
		border-color: rgba(14, 14, 14, 0.16);
		svg {
			width: 2.4rem;
			height: 2.4rem;
		}
		@media (hover: hover){
			&:hover {
				background: var(--fill-accent-1-1);
				color: var(--text-inverse-100);
				border-color: currentColor;
			}
		}
	}
}

.header__profile-btns.--fixed.--mobile-menu-active {
	// .header-btn {
	// 	font-size: 2rem;
	// 	color: #fff;
	// 	border-color: #fff;
	// }
	// .btn-logout {
	// 	color: #fff;
	// 	border-color: #fff;
	// 	svg {
	// 		width: 2.4rem;
	// 		height: 2.4rem;
	// 	}
	// }
}
</style>
