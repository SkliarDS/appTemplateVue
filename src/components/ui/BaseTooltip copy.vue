<script setup>
    import { ref, computed } from "vue";

    const props = defineProps( {
        content: {
            type: String,
            default: ''
        },
        placement: {
            type: String,
            default: 'bottom',
            validator: (value) => ['top', 'bottom', 'left', 'left-bottom', 'right'].includes(value)
        },
        theme: {
            type: String,
            default: 'light',
            validator: (value) => ['dark', 'light'].includes(value)
        },
        offset: {
            type: Number,
            default: 8
        }
    })

    const show = ref(false);

    const tooltipStyle = computed(() => {
        const styles = {};
        if (props.placement === "top") {
            styles.bottom = `calc(100% + ${props.offset}px)`;
        } else if (props.placement === "bottom") {
            styles.top = `calc(100% + ${props.offset}px)`;
        } else if (props.placement === "left") {
            styles.right = `calc(100% + ${props.offset}px)`;
        } else if (props.placement === "left-bottom") {
            styles.right = `calc(-55% + ${props.offset}px)`;
		} else if (props.placement === "right") {
            styles.left = `calc(100% + ${props.offset}px)`;
        }
        return styles;
    });
</script>

<template>
	<div class="tooltip-wrapper">
		<div class="tooltip-trigger" @mouseenter="show = true" @mouseleave="show = false" @focus="show = true" @blur="show = false">
			<slot />
		</div>

		<transition name="tooltip">
			<div v-if="show" class="tooltip" :class="[placement, theme]" :style="tooltipStyle">
				<button @click="show = !show" class="tooltip__btn-close"><svg width='24' height='24'><use href='#x'></use></svg></button>
				<div class="tooltip-content">
					<div v-if="content" v-html="content"></div>
					<slot name="content" />
				</div>
				<div class="tooltip-arrow" :class="placement"></div>
			</div>
		</transition>
	</div>
</template>

<style lang="scss" scoped>
.tooltip-wrapper {
	position: relative;
	display: inline-block;
    cursor: pointer;
}

.tooltip-trigger {
	// display: inline-block;
	display: flex;
}

.tooltip {
	position: absolute;
	z-index: 1000;
	// white-space: nowrap;
	pointer-events: none;
	width: 25rem;
	@media (max-width: $xx) {
		width: 18rem;
	}
}
.tooltip__btn-close {
	position: absolute;
	top: 5px;
	right: 5px;
	width: 2.4rem;
	height: 2.4rem;
	svg {
		width: 100%;
		height: 100%;
		stroke: var(--text-accent-1-100);
	}
}
.tooltip.top {
	left: 50%;
	transform: translateX(-50%);
}

.tooltip.bottom {
	left: 50%;
	transform: translateX(-50%);
}

.tooltip.left {
	top: 50%;
	transform: translateY(-50%);
}
.tooltip.left-bottom {
	top: 140%;
	transform: translateY(0%);
	width: 260px;
}

.tooltip.right {
	top: 50%;
	transform: translateY(-50%);
}

.tooltip-content {
	padding: 8px 12px;
	border-radius: 6px;
	font-size: 14px;
	line-height: 1.4;
	font-weight: 500;
}

.tooltip.dark .tooltip-content {
	background: #1f2937;
	color: white;
	box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.tooltip.light .tooltip-content {
	background: white;
	color: #374151;
	border: 1px solid #e5e7eb;
	box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.tooltip-arrow {
	position: absolute;
	width: 8px;
	height: 8px;
	transform: rotate(45deg);
}

.tooltip.top .tooltip-arrow {
	bottom: -4px;
	left: 50%;
	transform: translateX(-50%) rotate(45deg);
}

.tooltip.bottom .tooltip-arrow {
	top: -4px;
	left: 50%;
	transform: translateX(-50%) rotate(45deg);
}

.tooltip.left .tooltip-arrow {
	right: -4px;
	top: 50%;
	transform: translateY(-50%) rotate(45deg);
}

.tooltip.left-bottom .tooltip-arrow {
	right: 13px;
	top: 0%;
	transform: translateY(-50%) rotate(45deg);
	display: none;
}

.tooltip.right .tooltip-arrow {
	left: -4px;
	top: 50%;
	transform: translateY(-50%) rotate(45deg);
}

.tooltip.dark .tooltip-arrow {
	background: #1f2937;
}

.tooltip.light .tooltip-arrow {
	background: white;
	border: 1px solid #e5e7eb;
}

.tooltip.light .tooltip-arrow.top {
	border-top: none;
	border-left: none;
}

.tooltip.light .tooltip-arrow.bottom {
	border-bottom: none;
	border-right: none;
}

.tooltip.light .tooltip-arrow.left {
	border-left: none;
	border-bottom: none;
}

.tooltip.light .tooltip-arrow.left-bottom {
	border-right: none;
	border-bottom: none;
}

.tooltip.light .tooltip-arrow.right {
	border-right: none;
	border-top: none;
}

/* Анимации */
.tooltip-enter-active,
.tooltip-leave-active {
	transition: all 0.2s ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
	opacity: 0;
	transform: translateX(-50%) translateY(-4px);
}

.tooltip.top.tooltip-enter-from,
.tooltip.top.tooltip-leave-to {
	transform: translateX(-50%) translateY(-4px);
}

.tooltip.bottom.tooltip-enter-from,
.tooltip.bottom.tooltip-leave-to {
	transform: translateX(-50%) translateY(4px);
}

.tooltip.left.tooltip-enter-from,
.tooltip.left.tooltip-leave-to {
	transform: translateY(-50%) translateX(-4px);
}

.tooltip.right.tooltip-enter-from,
.tooltip.right.tooltip-leave-to {
	transform: translateY(-50%) translateX(4px);
}
</style>
