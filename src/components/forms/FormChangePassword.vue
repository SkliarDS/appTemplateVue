<script setup>
import { useRequestsStore } from "@/stores/storeRequests";
import { useForm } from "@/composables/useForm";
import { required, minLength, sameAs } from "@/utils/validators";
import BasePassword from "@/components/ui/BasePassword.vue";

const storeRequests = useRequestsStore();

const { field, isValid, handleSubmit } = useForm({
	password: { value: "", rules: [required("Введите пароль"), minLength(6, "Введите пароль")] },
	passwordRepeat: { value: "", rules: [required("Повторите пароль"), sameAs("password", "Повторите пароль")] },
});

const onSubmit = handleSubmit((data) => storeRequests.changeUserPassword(data));
</script>
<template>
	<form class="form form-grid" @submit.prevent="onSubmit">
		<div class="form__block-inputns">
			<div class="form__wrap">
				<BasePassword placeholder="Пароль (не менее 6 символов)" :required="true" v-bind="field('password')"> Новый пароль </BasePassword>
			</div>
			<div class="form__wrap">
				<BasePassword placeholder="Повторите пароль" :required="true" v-bind="field('passwordRepeat')"> Повторите новый пароль </BasePassword>
			</div>
		</div>
		<div class="form__footer">
			<button :disabled="!isValid" :class="['send-button form__btn btn --big', { 'not-hover': storeRequests.loaderBtn }]">
				<span v-if="!storeRequests.loaderBtn">Сохранить</span>
				<img v-else class="form__loader" width="36" height="36" src="@/assets/img/icons/loader.svg" alt="изображение" />
			</button>
		</div>
	</form>
</template>
