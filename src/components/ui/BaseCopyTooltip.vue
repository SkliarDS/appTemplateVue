<script setup>
import { ref, computed, onUnmounted } from "vue";

const props = defineProps({
	text: {
		type: String,
		default: "Скопировано",
	},
	duration: {
		type: Number,
		default: 2000,
	},
});

const isVisible = ref(false);
const copyTooltip = ref(null);
let timer = null;

const heightTooltip = computed(() => {
	if (copyTooltip.value) {
		return `${copyTooltip.value.offsetHeight}px`;
	}
})

const show = () => {
	isVisible.value = true;

	clearTimeout(timer);
	timer = setTimeout(() => {
		isVisible.value = false;
	}, props.duration);
};

onUnmounted(() => {
	clearTimeout(timer);
});
</script>

<template>
	<button :class="['copy-tooltip', {active: isVisible}]" ref="copyTooltip">
		<slot :show="show" />
		<Transition name="fade">
			<span v-if="isVisible" class="copy-tooltip__text" :style="{ top: heightTooltip }">
				{{ text }}
			</span>
		</Transition>
	</button>
</template>

<style lang="scss" scoped>
.copy-tooltip {
	position: relative;
	display: inline-flex;
    &__text  {
        position: absolute;
        top: 0;
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
    }
	&.active {
		z-index: 2;
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
