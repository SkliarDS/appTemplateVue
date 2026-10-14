<script setup>
import TelegramHeader from "@/pages_telegram/TelegramHeader.vue";
import FormRegistration from "@/components/forms/FormRegistration.vue";
</script>

<template>
    <div class="tg-page">
        <TelegramHeader />
        <div class="modal-content">
            <h5 class="modal-title">Регистрация</h5>
            <FormRegistration telegram />
        </div>
    </div>
</template>
<style lang="scss" scoped>
.tg-page {
    padding: 2rem 0 ;
}
.modal-content {
	display: grid;
	gap: 35px;
	padding: 0px 15px;
	@media (max-width: $xx) {
		padding: 0px 15px;
		gap: 20px;
	}
}

.modal-title {
	font-weight: 400;
	font-size: 48px;
	line-height: 100%;
	max-width: 75rem;
    text-align: center;
	@media (max-width: $xx) {
		font-size: 28px;
	}
	@media (max-width: $x) {
		// font-size: 28px;
	}
	&.--center {
		text-align: center;
	}
}
.modal-subtitle {
	font-family: var(--second-family);
	font-weight: 400;
	font-size: 32px;
	line-height: 120%;
	max-width: 75rem;
	@media (max-width: $xx) {
		font-size: 16px;
	}
	a {
		color: inherit;
		@media (hover: hover) {
			&:hover {
				text-decoration: underline;
			}
		}
	}
	&.--center {
		text-align: center;
	}
}
.buttons {
	display: grid;
	gap: 56px;
}
</style>
