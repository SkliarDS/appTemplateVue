<script setup>
// Чекбокс: v-model — boolean. disabled — для «Нет аккаунта», когда поле соцсети уже заполнено
const value = defineModel({ type: Boolean, default: false });

defineProps({
    disabled: {
        type: Boolean,
        default: false,
    },
    // Текст ошибки
    error: {
        type: String,
        default: ''
    },
    // CSS-класс состояния: '' | 'valid' | 'not-valid'
    status: {
        type: String,
        default: ''
    },
})
</script>
<template>
    <label :class="['checkbox', status, { '--disabled': disabled }]">
        <div class="checkbox__inner">
            <input
                type="checkbox"
                class="checkbox__real-input"
                :disabled="disabled"
                v-model="value"
            >
            <span class="checkbox__custom-input"></span>
            <span class="checkbox__text">
                <slot></slot>
            </span>
        </div>
        <Transition mode="out-in">
            <span v-if="!!error" class="input__error">{{ error }}</span>
        </Transition>
    </label>
</template>
<style lang='scss' scoped>
.checkbox {
    display: grid;
    gap: .5rem;
    width: fit-content;
    &.--disabled {
        opacity: 0.4;
        pointer-events: none;
    }
}
.checkbox__inner {
    display: flex;
    align-items: start;
    gap: .8rem;

}
.checkbox__real-input {
	width: 0;
	height: 0;
	opacity: 0;
	position: absolute;
	z-index: -1;
}

.checkbox__custom-input {
    display: flex;
    align-items: center;
    justify-self: center;
    position: relative;
    border: 1px solid var(--text-default-100);
    border-radius: 0.8rem;
    width: 2.4rem;
    height: 2.4rem;
    flex-shrink: 0;
    background-color: #fff;
    transition:  var(--transition) ease-in;   
    @media (max-width: $xx) {
        width: 2rem;
        height: 2rem;
    }
}
.checkbox__text {
    font-family: var(--second-family);
    font-weight: 400;
    font-size: 20px;
    line-height: 120%;
    color: var(--text-default-100);
    @media (max-width: $xx) {
        line-height: 112%;
    }
    :deep(a) {
		white-space: nowrap;
        color: var(--text-default-100);
        text-decoration: underline;
		// border-bottom: 0.1rem solid currentColor;
		@media (max-width: $xx) {
			white-space: wrap;
		}
		@media (hover: hover) {
			&:hover {
				border-color: transparent;
                text-decoration: none;
			}
		}
	}
}

.checkbox__custom-input::before {
	content: '';	
    display: inline-block;
	width: 2rem;
	height: 2rem;
	background-image: url('@/assets/img/icons/check.svg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: auto;
	position: absolute;
    transform: scale(0);
    
    transition: 0.2s ease-in; 
    @media (max-width: $xx) {
        // width: 2rem;
        // height: 2rem;
    } 
}
.checkbox__real-input:checked + .checkbox__custom-input {
	background: var(--fill-default-1);
    // border: 1px solid var(--fill-accent-1-1);
}
.checkbox__real-input:checked + .checkbox__custom-input::before {
	transform: scale(1) translateX(1.5px);
}
.v-enter-active,
.v-leave-active {
    transition: all 0.25s ease-out;
}

.v-enter-from{
    opacity: 0;
    transform: translateX(20px);
}
.v-leave-to {
    opacity: 0;
    transform: translateX(-20px);
}
</style>
