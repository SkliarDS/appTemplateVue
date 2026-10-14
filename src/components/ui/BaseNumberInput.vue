<script setup>
import { ref, onMounted, watch, computed } from "vue";
import Inputmask from "inputmask";

// Числовое поле с маской (ИНН, БИК, счёт). v-model — значение без пробелов
const value = defineModel({ default: "" });
const emit = defineEmits(["blur"]);
const inputRef = ref(null);
const errorText = ref(null)

const heightErrorText = computed(() => {
    if (errorText.value) {
        return errorText.value.offsetHeight;
    }
})

const props = defineProps({
	placeholder: {
		type: String,
		default: "",
	},
	required: {
		type: Boolean,
	},
	// Маска Inputmask, например "999999999999" или "4081 7899 9999 9999 9999"
	mask: {
		type: String,
		default: "",
	},
	maskPlaceholder: {
		type: String,
		default: "",
	},
	// Текст ошибки
	error: {
		type: String,
		default: "",
	},
	// CSS-класс состояния: '' | 'valid' | 'not-valid'
	status: {
		type: String,
		default: "",
	},
});

const clean = (raw) => (raw ?? "").replace(/\s/g, "");

onMounted(() => {
	new Inputmask({
		mask: props.mask,
		placeholder: props.maskPlaceholder,
		clearIncomplete: false,
		showMaskOnHover: false,
	}).mask(inputRef.value);
	if (value.value) inputRef.value.value = value.value;
});

// Значение изменили снаружи (сброс формы) — показываем его в поле
watch(value, (newVal) => {
	if (inputRef.value && clean(inputRef.value.value) !== (newVal ?? "")) {
		inputRef.value.value = newVal ?? "";
	}
});

const handleInput = (event) => {
	value.value = clean(event.target.value);
};
</script>

<template>
	<label :class="['input']">
		<div class="input__holder">
			<input
				ref="inputRef"
				type="text"
				inputmode="numeric"
				:placeholder="placeholder"
				:required="required"
				:class="['input__field', status]"
				@input="handleInput"
				@blur="emit('blur')"
			/>
			<span class="input__title"><slot></slot></span>
		</div>

		<Transition mode="out-in">
            <span v-if="!!error" ref="errorText" class="input__error" :style="{ bottom: `${(heightErrorText + 10) * -1}px` }">{{ error }}</span>
        </Transition>
	</label>
</template>
<style lang="scss" scoped>

.v-enter-active,
.v-leave-active {
    transition: all 0.25s ease-out;
}

.v-enter-from{
    opacity: 0;
  transform: translate(-50%, 10px);
}
.v-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px);
}
</style>
