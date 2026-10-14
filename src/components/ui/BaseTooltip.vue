<script setup>
import { computed, onMounted, onUnmounted } from 'vue';
import { useTooltip } from '@/composables/useTooltip';

const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        default: ''
    },
    id: {
        type: [Number, String],
        default: 0
    },
    index: {
        type: Number,
        default: 0
    },
    widthContent: {
        type: Number,
        default: 300
    }
})

const { activeTooltipId, showTooltip, hideTooltip } = useTooltip();

const isOpen = computed(() => activeTooltipId.value === props.id);

const showInfo = () => {
    if (props.id === null || props.id === undefined) return;
    if (isOpen.value) {
        hideTooltip(props.id);
    } else {
        showTooltip(props.id);
    }
};

const hideInfo = () => {
    hideTooltip(props.id);
};

// Клик вне тултипа закрывает его 
const closeOnOutsideClick = (event) => {
    if (!isOpen.value) return;
    if (event.target.closest(".tooltip")) return;
    hideTooltip(props.id);
};

onMounted(() => {
    document.addEventListener("click", closeOnOutsideClick);
});
onUnmounted(() => {
    document.removeEventListener("click", closeOnOutsideClick);
});

const tooltip = computed(() => `tooltip-${props.id}`)
const anchor = computed(() => `anchor-${props.id}`)
const anchorId = computed(() => `--anchor-${props.id}`)
//@mouseenter="showInfo(props.index)"
</script>

<template>
	<div :class="['tooltip', { '--cursor-pointer': props.id !== null && props.id !== undefined }]" @click="showInfo" >
        <Transition name="tooltip">
            <div
                v-if="activeTooltipId === props.id"
                class="tooltip__content"
                :id="tooltip"
                :style="{'position-anchor': anchorId, 'width': `${props.widthContent}px`}"
            >
                <!-- <button @click.stop="hideInfo" class="tooltip__btn-close">x</button> -->
                <p v-if="props.title" class="tooltip__title">{{ props.title }}</p>
                <p v-if="props.content" class="tooltip__text">{{ props.content }}</p>
            </div>
        </Transition>
		<div class="tooltip__anchor" :id="anchor" :style="{'anchor-name': anchorId}"><slot></slot></div>
	</div>
</template>
<style lang="scss" scoped>
@use "@/assets/scss/base/vars";
.tooltip {
	position: relative;
	width: fit-content;
    &.--cursor-pointer {
        
        cursor: pointer;
    }
}
.tooltip__anchor {
    /* position: absolute; */
    /* anchor-name: --anchor; */
}
.tooltip__content {
    // fixed — не абсолютный: не обрезается overflow: auto/hidden родительских
    // скролл-контейнеров (например .winners__list в ленте действий); anchor
    // positioning работает одинаково для absolute и fixed.
    position: fixed;
    /* position-anchor: --anchor; */
    position-area: bottom span-left;
    position-try-fallbacks: top span-left;
    margin-top: .2rem;

    padding: 1.6rem;
    box-shadow: 0 10px 100px 0 rgba(0, 0, 0, 0.3);
    background: var(--surface-light-blue-base);
    border-radius: 1.6rem;
    width: 35rem;
    display: grid;
    gap: 0.4rem;
    text-align: left;
	z-index: 3;

    &::before {
        content: '';
        position: absolute;
        bottom: 100%;
        right: 1.6rem;
        width: 1.2rem;
        height: 1.2rem;
        background: var(--surface-light-blue-base);
        transform: translateY(50%) rotate(45deg);
        border-radius: 0.3rem 0 0 0;
        @media (min-width: $m) {
            border-radius: 0.5rem 0 0 0;
        }
    }
}
.tooltip__btn-close {
    position: absolute;
    top: 5px;
    right: 5px;
}
.tooltip__title {
    font-weight: 700;
    font-size: 1.6rem;
    line-height: 120%;
    color: var(--text-dark-blue);
}
.tooltip__text {
    font-size: 1.2rem;
    line-height: 120%;
    letter-spacing: -0.03em;
    color: var(--text-gray);
}
.tooltip-enter-active,
.tooltip-leave-active {
	transition: all 0.2s ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
	opacity: 0;
	transform:  translateY(-10px);
}
</style>
