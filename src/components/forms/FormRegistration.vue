<script setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useRequestsStore } from "@/stores/storeRequests";
import { useModals } from "@/composables/useModals";
import { useForm } from "@/composables/useForm";
import { required, minLength, email, phone, isTrue, pattern, when, VK_PATTERN } from "@/utils/validators";
import { rulesUrl, agreementUrl, advertisingUrl, agreementBotUrl, advertisingBotUrl } from "@/utils/provider";
import BaseInput from "@/components/ui/BaseInput.vue";
import BasePhoneInput from "@/components/ui/BasePhoneInput.vue";
import BaseSelect from "@/components/ui/BaseSelect.vue";
import BaseSelectSearch from "@/components/ui/BaseSelectSearch.vue";
import BaseCheckbox from "@/components/ui/BaseCheckbox.vue";

// telegram — версия для Telegram Mini App: поля VK и MAX, ссылки на документы бота, без кнопки «Войти»
const props = defineProps({
	telegram: {
		type: Boolean,
		default: false,
	},
});

const route = useRoute();
const storeRequests = useRequestsStore();
const { openModal } = useModals();

const cityMessage = "Начните вводить символы и выберите город из списка";

const { values, field, isValid, handleSubmit } = useForm({
	fullName: { value: "", rules: [required("Введите ФИО"), minLength(2, "Введите ФИО")] },
	// В Telegram город необязателен (как было раньше)
	city: { value: "", rules: props.telegram ? [] : [required(cityMessage)] },
	phone: { value: route.query.phone ?? "", rules: [required("Введите номер телефона"), phone()] },
	email: { value: "", rules: [required("Введите email"), email()] },
	workplace: { value: "", rules: [required("Укажите место работы"), minLength(2, "Укажите место работы")] },
	position: { value: "", rules: [required("Укажите должность")], validateOn: "change" },
	// Соцсети (только Telegram): заполнить поле или отметить «Нет аккаунта»
	vk: {
		value: "",
		rules: props.telegram ? [when((all) => !all.vkNone, [required("Укажите VK или отметьте «Нет аккаунта»"), pattern(VK_PATTERN, "Неверный формат. Примеры: @username, username, https://vk.com/username, vk.com/username")])] : [],
	},
	vkNone: { value: false, validateOn: "change" },
	max: { value: "", rules: props.telegram ? [when((all) => !all.maxNone, [required("Укажите MAX или отметьте «Нет аккаунта»"), phone()])] : [] },
	maxNone: { value: false, validateOn: "change" },
	rules: { value: false, rules: [isTrue()], validateOn: "change" },
	agreement: { value: false, rules: [isTrue()], validateOn: "change" },
	agreeToAdvertising: { value: false, validateOn: "change" },
});

const onSubmit = handleSubmit((data) => storeRequests.registration(data));

onMounted(() => {
	storeRequests.getPositions();
});
</script>
<template>
	<form
		class="form form-grid"
		@submit.prevent="onSubmit"
	>
		<div class="form__block-inputns">
			<div class="form__wrap">
				<BaseInput
					type="text"
					placeholder="ФИО"
					v-bind="field('fullName')"
				>
					ФИО
				</BaseInput>
			</div>
			<div class="form__wrap">
				<BaseSelectSearch
					:select-options="storeRequests.suggestCityOptions"
					v-bind="field('city')"
				></BaseSelectSearch>
			</div>
			<div class="form__wrap --two-col">
				<BasePhoneInput
					:required="true"
					placeholder="Номер телефона"
					v-bind="field('phone')"
				>
					Номер телефона
				</BasePhoneInput>
				<BaseInput
					type="email"
					placeholder="Email"
					v-bind="field('email')"
				>
					Email
				</BaseInput>
			</div>
			<div class="form__wrap">
				<BaseInput
					type="text"
					placeholder="Место работы"
					v-bind="field('workplace')"
				>
					Место работы
				</BaseInput>
			</div>
			<div class="form__wrap">
				<BaseSelect
					:select-options="storeRequests.positions"
					value-key="title"
					v-bind="field('position')"
				>
					Должность
				</BaseSelect>
			</div>
			<div
				class="form__wrap --two-col"
				v-if="telegram"
			>
				<div class="form__social">
					<BaseInput
						type="text"
						placeholder="VK"
						:required="false"
						:readonly="values.vkNone"
						v-bind="field('vk')"
					>
						VK
					</BaseInput>
					<BaseCheckbox
						:disabled="!!values.vk.trim()"
						v-bind="field('vkNone')"
					>
						Нет аккаунта в VK
					</BaseCheckbox>
				</div>
				<div class="form__social">
					<BasePhoneInput
						placeholder="MAX"
						:readonly="values.maxNone"
						v-bind="field('max')"
					>
						MAX
					</BasePhoneInput>
					<BaseCheckbox
						:disabled="!!values.max"
						v-bind="field('maxNone')"
					>
						Нет аккаунта в MAX
					</BaseCheckbox>
				</div>
			</div>
		</div>
		<div class="form__checkboxes">
			<BaseCheckbox v-bind="field('rules')">
				Я согласен(на) с
				<a
					:href="rulesUrl"
					target="_blank"
					rel="noopener noreferrer"
				>
					правилами акции
				</a>
			</BaseCheckbox>
			<BaseCheckbox v-bind="field('agreement')">
				Я согласен(на) на обработку моих
				<a
					:href="telegram ? agreementBotUrl : agreementUrl"
					target="_blank"
					rel="noopener noreferrer"
				>
					персональных данных
				</a>
			</BaseCheckbox>
			<BaseCheckbox v-bind="field('agreeToAdvertising')">
				Я согласен(на) на получение
				<a
					:href="telegram ? advertisingBotUrl : advertisingUrl"
					target="_blank"
					rel="noopener noreferrer"
				>
					информационной и рекламной рассылки
				</a>
			</BaseCheckbox>
		</div>
		<p
			class="form__text-error"
			v-if="storeRequests.responseError"
		>
			{{ storeRequests.responseError }}
		</p>
		<div class="form__footer">
			<button
				:disabled="!isValid"
				:class="['send-button form__btn btn --big', { 'not-hover': storeRequests.loaderBtn }]"
			>
				<span v-if="!storeRequests.loaderBtn">Регистрация</span>
				<img
					v-else
					class="form__loader"
					width="36"
					height="36"
					src="@/assets/img/icons/loader.svg"
					alt="изображение"
				/>
			</button>
			<div
				class="form__btn-wrapper --flex"
				v-if="!telegram"
			>
				<span>Уже есть аккаунт?</span>
				<button
					type="button"
					@click="openModal('authorization')"
					class="send-button form__btn"
				>
					Войти
				</button>
			</div>
		</div>
	</form>
</template>
