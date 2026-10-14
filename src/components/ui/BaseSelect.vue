<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

// Выпадающий список. v-model — значение выбранной опции по ключу valueKey ('id' или 'title')
const value = defineModel();
const emit = defineEmits(["blur"]);

const props = defineProps({
	selectOptions: {
		type: Array,
		required: true,
	},
	// Какое поле опции записывать в v-model
	valueKey: {
		type: String,
		default: "id",
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

const dropdownRef = ref(null);
const dropdownRefHeight = ref(null);
const isOpen = ref(false);

const selectedTitle = computed(() => props.selectOptions.find((option) => option[props.valueKey] === value.value)?.title ?? "");

const errorText = ref(null);
const heightErrorText = computed(() => errorText.value?.offsetHeight);

const showDropdownList = () => {
	isOpen.value = !isOpen.value;
	dropdownRefHeight.value = dropdownRef.value?.offsetHeight || 80;
};

const changeValueSelect = (option) => {
	value.value = option[props.valueKey];
	isOpen.value = false;
};

const closeDropdownOnClickOutside = (event) => {
	if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
		isOpen.value = false;
	}
};

onMounted(() => {
	document.addEventListener("click", closeDropdownOnClickOutside);
});

onUnmounted(() => {
	document.removeEventListener("click", closeDropdownOnClickOutside);
});
</script>
<template>
	<div class="dropdown input" ref="dropdownRef">
		<label :class="['dropdown-label', { '--visible': isOpen }]">
			<input :value="selectedTitle" @click="showDropdownList" :class="['dropdown__button input__field', status]" :placeholder="selectedTitle" @blur="emit('blur')" readonly />
			<span class="input__title"><slot></slot></span>
		</label>
		<Transition mode="out-in">
			<span v-if="!!error" ref="errorText" class="input__error" :style="{ bottom: `${(heightErrorText + 10) * -1}px` }">{{ error }}</span>
		</Transition>
		<Transition>
			<div :class="['dropdown__list']" v-if="isOpen" :style="{ top: dropdownRefHeight + 1 + 'px' }">
				<ul class="dropdown__list-scroll list-scrollbar">
					<li v-for="option in props.selectOptions" :key="option.id" @mousedown.prevent @click="changeValueSelect(option)" class="dropdown__list-item" :data-value="option.id">
						{{ option.title }}
					</li>
				</ul>
			</div>
		</Transition>
	</div>
</template>
<style lang="scss" scoped>

.v-enter-active,
.v-leave-active {
	transition: all 0.25s ease-out;
}

.v-enter-from {
	opacity: 0;
	transform: translate(0%, 20px);
}
.v-leave-to {
	opacity: 0;
	transform: translate(0%, 20px);
}

.section-dropdown {
	max-width: 300px;
}
.dropdown {
	position: relative;
}

.dropdown__button {
	position: relative;
	display: block;
	text-align: left;
	cursor: pointer;
	padding-right: 50px;
	overflow: hidden;
	text-overflow: ellipsis;
	// color: rgba(14, 14, 14, 0.4);
	&.--visible {
		&::after {
			transform: translateY(-50%) rotateX(180deg);
		}
	}
	&.valid {
		// color: var(--text-accent-2-100);
		color: var(--text-default-100);
	}
	&::placeholder {
		color: var(--text-default-100);
		// color: red;
	}
}

.dropdown-label {
	display: grid;
	gap: 5px;
	&::after {
		content: "";
		position: absolute;
		top: 50%;
		right: 28px;
		transform: translateY(-50%) rotateX(0deg);
		background-image: url("@/assets/img/icons/select_icon.svg");
		background-repeat: no-repeat;
		background-position: 0px 0px; /* x y*/
		background-size: auto; /* w h*/
		width: 24px;
		height: 24px;
		pointer-events: none;
		transition: var(--transition) ease-in;
		@media (max-width: $xx) {
			right: 10px;
		}

	}

	&.--visible {
		&::after {
			transform: translateY(-50%) rotateX(180deg);
		}
	}
}
.dropdown__button::after {
}

.dropdown__list {
	position: absolute;
	left: 0;
	top: 80px;

	margin: 0;
	padding: 0 25px;
	list-style-type: none;
	box-shadow: 0 15px 15px 0 rgba(18, 38, 67, 0.1);
	background: #fff;
	border: 1px solid var(--text-default-100);
	border-radius: var(--border-radius) 0;
	overflow: hidden;
	width: 100%;
	z-index: 100;
	@media (max-width: $xx) {
		top: 55px;
		padding: 10px 15px;
		border-radius: 16px 0;
	}
}

.dropdown__list-item {
	font-family: var(--second-family);
	font-weight: 400;
	font-size: 32px;
	line-height: 120%;
	color: var(--text-default-100);
	margin: 0;
	padding: 0;
	border-bottom: 0px;
	padding: 18px 10px;
	cursor: pointer;
	@media (max-width: $xx) {
		padding: 10px 10px;
		font-size: 20px;
	}
	&:first-child {
		
		padding-top: 20px;
	}
	&:last-child {
		
		padding-bottom: 20px;
	}
	&:not(:last-child) {
		border-bottom: 1px solid var(--border-inverse-1);
	}
	@media (hover: hover) {
		&:hover {
			background: rgba(176, 198, 225, 0.26);
		}
	}
}


.dropdown__input-hidden {
	display: none;
}
.dropdown__list-scroll {
	height: auto;
	// height: 146px;
	// padding: 10px 0px 10px 0px;
}
.dropdown__list-scroll--height {
	height: 125px;
}
</style>
