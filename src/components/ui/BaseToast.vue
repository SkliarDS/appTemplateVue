<script setup>
import { ref, onUnmounted } from "vue";

const props = defineProps({
	text: {
		type: String,
		default: "",
	},
	duration: {
		type: Number,
		default: 2000,
	},
	position: {
		type: String,
		default: "top",
	},
});

const isVisible = ref(false);
const activeText = ref(props.text);
const activeDuration = ref(props.duration);
const activePosition = ref(props.position);
let timer = null;

const show = ({ text, duration, position } = {}) => {
	activeText.value = text ?? props.text;
	activeDuration.value = duration ?? props.duration;
	activePosition.value = position ?? props.position;

	isVisible.value = true;

	clearTimeout(timer);
	timer = setTimeout(() => {
		isVisible.value = false;
	}, activeDuration.value);
};

defineExpose({ show });

onUnmounted(() => {
	clearTimeout(timer);
});
</script>

<template>
	<div class="toast">
		<Transition name="fade">
			<span v-if="isVisible" :class="['toast__text', `--${activePosition}`]">
				{{ activeText }}
			</span>
		</Transition>
	</div>
</template>

<style lang="scss" scoped>
.toast {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translateX(-50%);
	width: 0;
	height: 0;
	pointer-events: none;
	&__text {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		font-weight: 500;
		font-size: 1.6rem;
		line-height: 140%;
		color: var(--fill-inverse-1);
		background-color: var(--border-inverse-1);
		border-radius: 1.6rem 0;
		padding: .8rem 1.6rem;
		white-space: nowrap;
		pointer-events: none;
		text-transform: none;
		&.--top {
			bottom: 100%;
			margin-bottom: .8rem;
		}
		&.--bottom {
			top: 100%;
			margin-top: .8rem;
		}
	}
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
