<script setup>
import { useRequestsStore } from "@/stores/storeRequests";
import { useForm } from "@/composables/useForm";
import { required, email } from "@/utils/validators";
import BaseInput from "@/components/ui/BaseInput.vue";

const storeRequests = useRequestsStore();

const { field, isValid, handleSubmit } = useForm({
	email: { value: "", rules: [required("Введите email"), email()] },
});

const onSubmit = handleSubmit((data) => storeRequests.changeUserProfile(data));
</script>
<template>
	<form class="form form-grid" @submit.prevent="onSubmit">
		<div class="form__block-inputns">
			<div class="form__wrap">
				<BaseInput type="email" placeholder="Email" v-bind="field('email')">Email </BaseInput>
			</div>
		</div>
		<p class="form__text-error" v-if="storeRequests.responseError">{{ storeRequests.responseError }}</p>
		<div class="form__footer --small-gap">
			<button :disabled="!isValid" :class="['send-button form__btn btn --big', { 'not-hover': storeRequests.loaderBtn }]">
				<span v-if="!storeRequests.loaderBtn">Изменить</span>
				<img v-else class="form__loader" width="36" height="36" src="@/assets/img/icons/loader.svg" alt="изображение" />
			</button>
		</div>
	</form>
</template>
