<script setup>
import { useRequestsStore } from "@/stores/storeRequests";
import { useForm } from "@/composables/useForm";
import { required, email } from "@/utils/validators";
import BaseInput from "@/components/ui/BaseInput.vue";

const storeRequests = useRequestsStore();

// Email только разблокирует кнопку: repeatVerification() отправляет письмо на адрес из профиля
const { field, isValid } = useForm({
	email: { value: "", rules: [required("Введите email"), email()] },
});
</script>
<template>
	<div class="form form-grid">
		<div class="form__wrap">
			<BaseInput type="email" placeholder="Email" v-bind="field('email')">Email </BaseInput>
		</div>
		<button :disabled="!isValid" class="send-button btn form__btn --blue" type="button" @click="storeRequests.repeatVerification()">Запросить повторно</button>
	</div>
</template>
