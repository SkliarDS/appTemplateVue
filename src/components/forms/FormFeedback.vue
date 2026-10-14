<script setup>
import { ref, onMounted } from "vue";
import { useRequestsStore } from "@/stores/storeRequests";
import { useForm } from "@/composables/useForm";
import { required, minLength, email, isTrue } from "@/utils/validators";
import { agreementUrl, advertisingUrl } from "@/utils/provider";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseSelect from "@/components/ui/BaseSelect.vue";
import BaseTextarea from "@/components/ui/BaseTextarea.vue";
import BaseFileDragDrop from "@/components/ui/BaseFileDragDrop.vue";
import BaseCheckbox from "@/components/ui/BaseCheckbox.vue";

const storeRequests = useRequestsStore();
const topics = ref([]);

// Авторизованному пользователю имя и email подставляются из профиля
const profile = storeRequests.isAuthenticated ? storeRequests.userData : null;

const { values, field, isValid, handleSubmit } = useForm({
	name: { value: profile?.full_name ?? "", rules: [required("Введите Имя"), minLength(2, "Введите Имя")] },
	email: { value: profile?.email ?? "", rules: [required("Введите email"), email()] },
	topic: { value: null, rules: [required("Выберите тему")], validateOn: "change" },
	// Сообщение необязательно, если прикреплены файлы
	message: { value: "", rules: [(value, all) => all.files.length > 0 || value.trim().length >= 2 || "Введите сообщение"] },
	files: { value: [], validateOn: "change" },
	agreement: { value: false, rules: [isTrue()], validateOn: "change" },
	agreeToAdvertising: { value: false, validateOn: "change" },
});

const onSubmit = handleSubmit((data) => storeRequests.feedback(data));

onMounted(async () => {
	topics.value = (await storeRequests.topics()) ?? [];
});
</script>
<template>
	<form class="form" @submit.prevent="onSubmit">
		<div class="form__block-inputns">
			<div class="form__wrap">
				<BaseInput type="text" placeholder="Имя" v-bind="field('name')"> Имя </BaseInput>
			</div>
			<div class="form__wrap email">
				<BaseInput type="email" placeholder="Email" v-bind="field('email')">Email</BaseInput>
			</div>
			<div class="form__wrap">
				<BaseSelect :select-options="topics" v-bind="field('topic')">Тема обращение</BaseSelect>
			</div>
			<div class="form__wrap">
				<BaseTextarea :max-length="1000" placeholder="Сообщение" v-bind="field('message')">Сообщение</BaseTextarea>
			</div>
			<div class="form__wrap">
				<BaseFileDragDrop v-model="values.files" />
			</div>
		</div>
		<div class="form__footer">
			<div class="form__checkboxes">
				<BaseCheckbox v-bind="field('agreement')">Я согласен(на) на обработку моих <a :href="agreementUrl" target="_blank" rel="noopener noreferrer">персональных данных</a> </BaseCheckbox>
				<BaseCheckbox v-bind="field('agreeToAdvertising')">Я согласен(на) на получение <a :href="advertisingUrl" target="_blank" rel="noopener noreferrer">рекламной и информационной рассылки</a></BaseCheckbox>
			</div>

			<button :disabled="!isValid" :class="['send-button form__btn btn --big', { 'not-hover': storeRequests.loaderBtn }]">
				<span v-if="!storeRequests.loaderBtn">Отправить</span>
				<img v-else class="form__loader" width="36" height="36" src="@/assets/img/icons/loader.svg" alt="изображение" />
			</button>
			<p class="form__text-error" v-if="storeRequests.responseError">{{ storeRequests.responseError }}</p>
		</div>
	</form>
</template>
