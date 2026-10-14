<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { useRequestsStore } from "@/stores/storeRequests";
import { debounce } from "@/utils/functions";

// Поиск города с подсказками. v-model — город, выбранный из списка; пока город не выбран — ""
const value = defineModel({ default: "" });
const emit = defineEmits(["blur"]);
const storeRequests = useRequestsStore();

const props = defineProps({
	selectOptions: {
		type: Array,
		required: true,
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
const searchText = ref(value.value);

const fetchSuggestions = async () => {
	await storeRequests.getSuggestCity(searchText.value);
	isOpen.value = props.selectOptions.length > 0;
};

const showDropdownList = debounce(fetchSuggestions, 300);

const handleInput = () => {
	value.value = "";
	showDropdownList();
};

const changeValueSelect = (optionTitle, city) => {
	searchText.value = optionTitle;
	value.value = city;
	isOpen.value = false;
};

// Ушли с поля, не выбрав город из списка, — очищаем ввод
const handleBlur = () => {
	if (!value.value) {
		searchText.value = "";
		isOpen.value = false;
	}
	emit("blur");
};

// Сброс формы снаружи
watch(value, (newVal) => {
	if (!newVal && !isOpen.value && document.activeElement !== dropdownRef.value) searchText.value = "";
});

const closeDropdownOnClickOutside = (event) => {
	if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
		isOpen.value = false;
	}
};

const errorText = ref(null);
const heightErrorText = computed(() => errorText.value?.offsetHeight);

onMounted(() => {
	dropdownRefHeight.value = dropdownRef.value?.offsetHeight || 80;
	document.addEventListener("click", closeDropdownOnClickOutside);
});

onUnmounted(() => {
	document.removeEventListener("click", closeDropdownOnClickOutside);
});
</script>
<template>
	<div class="dropdown input" >
		<label :class="['dropdown-label', { '--visible': isOpen }]">
			<input
				ref="dropdownRef"
				v-model="searchText"
				@input="handleInput"
				:class="['dropdown__button input__field', status]"
				placeholder="Город"
				@blur="handleBlur"

			/>
			<span class="input__title">Город</span>
			<Transition name="error">
				<span v-if="!!error" ref="errorText" class="input__error" :style="{ bottom: `${(heightErrorText + 10) * -1}px` }">{{ error }}</span>
			</Transition>
		</label>
		<Transition>
			<div :class="['dropdown__list']" v-if="isOpen" :style="{ top: dropdownRefHeight + 'px' }">
				<ul class="dropdown__list-scroll list-scrollbar">
					<li v-for="{ value: title, city, id } in props.selectOptions" :key="id" @mousedown.prevent @click="changeValueSelect(title, city)" class="dropdown__list-item" :data-value="id">
						{{ title }}
					</li>
				</ul>
			</div>
		</Transition>
	</div>
</template>
<style lang="scss" scoped>
.error-enter-active,
.error-leave-active {
    transition: all 0.25s ease-out;
}

.error-enter-from{
    opacity: 0;
  	transform: translate(-50%, 10px);
}
.error-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px);
}

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
	// color: var(--text-default-100);
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
		// color: var(--text-default-100);
		// color: red;
	}
}

.dropdown-label {
	display: grid;
	gap: 5px;
	

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
	padding: 10px 25px;
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
	// height: auto;
	padding-right: 10px;
	max-height: 400px;
	// padding: 10px 0px 10px 0px;
}
.dropdown__list-scroll--height {
	height: 125px;
}
</style>
