<script setup>
import { ref } from "vue";
import { useRequestsStore } from "@/stores/storeRequests";
import { useForm } from "@/composables/useForm";
import { required, minLength } from "@/utils/validators";
import TelegramHeader from "@/pages_telegram/TelegramHeader.vue";
import BasePassword from '@/components/ui/BasePassword.vue';

// Телефон в Telegram приходит в ссылке (?phone=), стор подставит его сам
const storeRequests = useRequestsStore();

const { field, isValid, handleSubmit } = useForm({
    password: { value: "", rules: [required("Введите пароль"), minLength(6, "Введите пароль")] },
});

const activeButton = ref(null);

const handleLogin = handleSubmit(async (data) => {
    activeButton.value = 'login';
    await storeRequests.authorization(data);
    activeButton.value = null;
});

const handleRecovery = async () => {
    activeButton.value = 'recovery';
    await storeRequests.recoveryPassword();
    activeButton.value = null;
};
</script>

<template>
    <div class="tg-page">
        <TelegramHeader />
        <div class="modal-content" >
            <h5 class="modal-title">Авторизация</h5>
            <form class="form form-grid" @submit.prevent="handleLogin">
                <div class="form__block-inputns">
                    <div class="form__wrap">
                        <BasePassword placeholder="Пароль (не менее 6 символов)" :required="true" v-bind="field('password')"> Пароль </BasePassword>
                    </div>
                </div>
                <div class="form__footer">
                    <p class="form__text-error" v-if="storeRequests.responseError">{{ storeRequests.responseError }}</p>
                    <button :disabled="!isValid" :class="['send-button form__btn btn --big', { 'not-hover': activeButton === 'login' }]">
                        <span v-if="activeButton !== 'login'">Войти</span>
                        <img v-else class="form__loader" width="36" height="36" src="@/assets/img/icons/loader.svg" alt="изображение" />
                    </button>
                    <button type="button" @click="handleRecovery" :class="['send-button form__btn btn --big', { 'not-hover': activeButton === 'recovery' }]">
                        <span v-if="activeButton !== 'recovery'">Отправить пароль повторно</span>
                        <img v-else class="form__loader" width="36" height="36" src="@/assets/img/icons/loader.svg" alt="изображение" />
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.tg-page {
    padding: 2rem 0;
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
.form__footer {
	gap: 10px;
}
</style>
