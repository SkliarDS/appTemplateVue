<script setup>
import { useRequestsStore } from "@/stores/storeRequests";
import { useForm } from "@/composables/useForm";
import { required, phone } from "@/utils/validators";
import BasePhoneInput from "@/components/ui/BasePhoneInput.vue";

const storeRequests = useRequestsStore();

const { field, isValid, handleSubmit } = useForm({
	phone: { value: "", rules: [required("Введите номер телефона"), phone()] },
});

const onSubmit = handleSubmit((data) => storeRequests.recoveryPassword(data));
</script>
<template>
	<form class="form form-grid" @submit.prevent="onSubmit">
		<div class="form__block-inputns">
			<div class="form__wrap">
				<BasePhoneInput :required="true" placeholder="Номер телефона" v-bind="field('phone')">Номер телефона </BasePhoneInput>
			</div>
		</div>
		<div class="form__footer">
			<p class="form__text-error" v-if="storeRequests.responseError">{{ storeRequests.responseError }}</p>
			<button :disabled="!isValid" :class="['send-button form__btn btn --big', { 'not-hover': storeRequests.loaderBtn }]">
				<span v-if="!storeRequests.loaderBtn">Отправить</span>
				<img v-else class="form__loader" width="36" height="36" src="@/assets/img/icons/loader.svg" alt="изображение" />
			</button>
		</div>
	</form>
</template>
