<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useSettingsStore } from "@/stores/storeSettings";

const storeSettings = useSettingsStore();

const props = defineProps({
    btns: {
        type: Array,
        default: () => []
    },
    initialActive: {
        type: String,
        default: null
    }
})

const getInitialIndex = () => {
    if (!props.initialActive) return 0;
    const idx = props.btns.findIndex(b => b.value === props.initialActive);
    return idx >= 0 ? idx : 0;
};

const buildState = (activeIndex) => {
    const state = {};
    props.btns.forEach((_, i) => { state[i] = i === activeIndex; });
    return state;
};

const initialIndex = getInitialIndex();
const isActive = ref(buildState(initialIndex));
const selectedTitle = ref(props.btns[initialIndex]?.title ?? null);
const btnTitle = computed(() => selectedTitle.value ?? props.btns[0]?.title);
const isShowSelect = ref(false);

const isMobile = computed(() => storeSettings.widthWindow <= 576);

const emit = defineEmits(['getCurrentType']);

const toggleActive = (index, title, btn) => {
    const newActiveState = {};
    for (let i = 0; i < props.btns.length; i++) {
        newActiveState[i] = false; 
    }
   
    newActiveState[index] = true;
    isActive.value = newActiveState;
    selectedTitle.value = title;
    emit('getCurrentType', btn)
}

const showSelect = () => {
    isShowSelect.value = !isShowSelect.value
}

const handleScroll = () => {
    if (isShowSelect.value) isShowSelect.value = false;
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});

</script>
<template>
    <div class="filter">
        <div class="filter__desctop" v-if="!isMobile">
            <button                     
                v-for="btn, index in btns" 
                :key="btn.id" 
                :class="['filter__btn btn --desktop --border', {active: isActive[index]}]"
                @click="toggleActive(index, btn.title, btn)"
            >
                {{ btn.title }}
            </button>
        </div>
        <div class="filter__mobile" v-else>
            <button :class="['filter__btn btn --mobile --border' , {active: isShowSelect}]" @click="showSelect">
                {{ btnTitle }}
                <svg width="24" height="24"><use href="#check_down"></use></svg>
            </button>
            <Transition>
                <div class="filter__select" v-if="isShowSelect">
                    <button                     
                        v-for="btn, index in btns" 
                        :key="btn.id" 
                        :class="['filter__btn btn --option --border']"
                        @click="toggleActive(index, btn.title, btn), showSelect()"
                    >
                        {{ btn.title }}
                    </button>
                </div>
            </Transition>
        </div>
    </div>
</template>
<style lang='scss' scoped>
.filter {
    position: relative;
    
}
.filter__desctop {
    display: flex;
    align-items: center;
    gap: 1.2rem;
}
.filter__mobile {
    position: relative;
    z-index: 2;
}
.filter__select {
    position: absolute;
    display: flex;
    flex-direction: column;
    top: 100%;
    left: 0;
    width: 100%;
    background: var(--fill-inverse-1);
    border: 1px solid var(--border-inverse-1);
    border-radius: var(--border-radius) 0;
    overflow: hidden;
}
.filter__btn {

    @media (max-width: $xx) {
        width: 100%;
    }
    &.--mobile {
        display: flex;
        justify-content: space-between;
        &.active {
            svg {
                transform: rotateX(180deg);
            }
        }
    }
    &.--desktop {
        @media (max-width: $xx) {
            display: none;
        }

        &.active {
            color: var(--text-inverse-100);
	        background: var(--fill-default-1);
            border: 1px solid var(--fill-default-1);
            @media (hover: hover) {
                &:hover {
                    color:  var(--border-inverse-1);
                    border: 1px solid currentColor;
                    background: var(--fill-inverse-1);
                }
            }
        }
    }
    &.--option {
        border: none;
        &:first-child {
        }
        &:not(:last-child) {
            border-bottom: 1px solid currentColor;
            border-bottom-right-radius: 0;
            
        }
    }

    svg {
        transition: transform var(--transition) ease-in;
    }
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
</style>