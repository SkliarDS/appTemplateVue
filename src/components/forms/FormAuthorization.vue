<script setup>
import { useRoute } from "vue-router";
import { useRequestsStore } from "@/stores/storeRequests";
import { useSettingsStore } from "@/stores/storeSettings";
import { useModals } from "@/composables/useModals";
import { useForm } from "@/composables/useForm";
import { required, minLength, phone } from "@/utils/validators";
import { sendMetrik } from "@/utils/metrika";
import BasePhoneInput from "@/components/ui/BasePhoneInput.vue";
import BasePassword from "@/components/ui/BasePassword.vue";

const route = useRoute();
const storeRequests = useRequestsStore();
const storeSettings = useSettingsStore();
const { openModal } = useModals();

const { values, field, isValid, handleSubmit } = useForm({
	phone: { value: route.query.phone ?? "", rules: [required("Введите номер телефона"), phone()] },
	password: { value: "", rules: [required("Введите пароль"), minLength(6, "Введите пароль")] },
});

const onSubmit = handleSubmit((data) => storeRequests.authorization(data));
</script>
<template>
	<form class="form form-grid" @submit.prevent="onSubmit">
		<div class="form__block-inputns">
			<div class="form__wrap">
				<BasePhoneInput :required="true" placeholder="Номер телефона" v-bind="field('phone')">Номер телефона </BasePhoneInput>
			</div>
			<div class="form__wrap">
				<BasePassword placeholder="Пароль (не менее 6 символов)" :required="true" v-bind="field('password')"> Пароль </BasePassword>
				<div class="form__text-btn-inner">
					<svg width="20" height="20"><use href="#icons_forgot_pass"></use></svg>
					<button @click="openModal('recoveryPassword')" class="form__text-btn" type="button">Забыли пароль?</button>
				</div>
			</div>
		</div>
		<div class="form__footer">
			<p class="form__text-error" v-if="storeRequests.responseError">{{ storeRequests.responseError }}</p>
			<button :disabled="!isValid" :class="['send-button form__btn btn --big', { 'not-hover': storeRequests.loaderBtn }]">
				<span v-if="!storeRequests.loaderBtn">Войти</span>
				<img v-else class="form__loader" width="36" height="36" src="@/assets/img/icons/loader.svg" alt="изображение" />
			</button>
			<button type="button" @click="storeRequests.recoveryPassword({ phone: values.phone })" v-if="storeRequests.isTelegramPage" :class="['send-button form__btn btn --big', { 'not-hover': storeRequests.loaderBtn }]">
				<span v-if="!storeRequests.loaderBtn">Войти</span>
				<img v-else class="form__loader" width="36" height="36" src="@/assets/img/icons/loader.svg" alt="изображение" />
			</button>
			<div class="form__btn-wrapper --flex" v-if="!storeSettings.statusStockPast">
				<span> Нет аккаунта? </span>
				<button type="button" @click="openModal('registration'), sendMetrik('reachGoal', 'registration_open')" class="send-button form__btn">Регистрация</button>
			</div>
		</div>
	</form>
</template>
