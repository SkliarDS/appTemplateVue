<script setup>
import { ref, onMounted, watch, computed } from "vue";
import Inputmask from "inputmask";

// Поле телефона с маской +7 (999) 999-99-99. Пока введена только «7» — значение пустое ("")
const value = defineModel();
const emit = defineEmits(["blur"]);
const inputRef = ref(null);
const errorText = ref(null)

const heightErrorText = computed(() => {
    if (errorText.value) {
        return errorText.value.offsetHeight;
    }
})

defineProps({
	placeholder: {
		type: String,
		default: "",
	},
	required: {
		type: Boolean,
	},
	readonly: {
		type: Boolean,
		default: false,
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

const toModel = (raw) => ((raw ?? "").replace(/\D/g, "").length > 1 ? raw : "");

// Номер снаружи может прийти как 79991234567 / 89991234567. В маске уже есть «+7 (9», а при программной
// установке значения цифры занимают только свободные позиции — отдаём маске номер без «7» и первой «9»
const toMaskInput = (phone) => {
	let digits = (phone ?? "").replace(/\D/g, "");
	if (digits.length === 11 && /^[78]/.test(digits)) digits = digits.slice(1);
	return digits.startsWith("9") ? digits.slice(1) : digits;
};

onMounted(() => {
	new Inputmask({
		mask: "+7 (\\999) 999-99-99",
		placeholder: "_",
		clearIncomplete: false,
		showMaskOnHover: false,
	}).mask(inputRef.value);
	if (value.value) inputRef.value.value = toMaskInput(value.value);
});

// Значение изменили снаружи (предзаполнение, сброс формы) — показываем его в поле
watch(value, (newVal) => {
	if (inputRef.value && toModel(inputRef.value.value) !== (newVal ?? "")) {
		inputRef.value.value = toMaskInput(newVal);
	}
});

const handleInput = (event) => {
	value.value = toModel(event.target.value);
};
</script>
<template>
	<label :class="['input', { '--readonly': readonly }]">
			<input
				ref="inputRef"
				type="tel"
				:placeholder="placeholder"
				:required="required"
				:readonly="readonly"
				:class="['input__field', status, { '--readonly': readonly }]"
				@input="handleInput"
				@change="handleInput"
				@blur="emit('blur')"
			/>
			<span class="input__title"><slot></slot></span>

		<Transition mode="out-in">
            <span v-if="!!error" ref="errorText" class="input__error" :style="{ bottom: `${(heightErrorText + 10) * -1}px` }">{{ error }}</span>
        </Transition>
	</label>
</template>
<style lang="scss" scoped>

.input.--readonly {
    pointer-events: none;
    cursor: default;
}
.input__field.--readonly {
    opacity: 0.4;
}

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
