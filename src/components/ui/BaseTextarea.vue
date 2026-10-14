<script setup>
import { ref, computed } from 'vue';

const value = defineModel({ default: '' })
const emit = defineEmits(['blur']);
const errorText = ref(null)

const heightErrorText = computed(() => {
    if (errorText.value) {
        return errorText.value.offsetHeight;
    }
})

defineProps({
    placeholder: {
        type: String,
    },
    maxLength: {
        type: Number
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

const count = computed(() => value.value?.length ?? 0);

const resizeMessage = (e) => {
	const textarea = e.target;
    textarea.style.minHeight = `auto`;
	const textareaHeight = textarea.scrollHeight;
	textarea.style.minHeight = `${textareaHeight}px`;
	textarea.style.transition = `min-height .2s linear`
}

</script>
<template>
    <label :class="['input']">
        <div class="input__holder --message none-scrollbar">
            <textarea
                :class="['input__field none-scrollbar', status]"
                autocomplete="on"
                :maxlength="maxLength"
                @input="resizeMessage"
                @blur="emit('blur')"
                v-model="value"
                :placeholder="placeholder"
                >
            </textarea>
            <span class="input__title"><slot></slot></span>
        </div>
        <span class="input__counter"><i>{{ count }}</i>/<i>{{ maxLength }}</i></span>
        <Transition>
            <span v-if="count === maxLength" ref="errorText" class="input__error" :style="{ bottom: `${(heightErrorText + 10) * -1}px` }">Не более {{ maxLength }} символов</span>
        </Transition>
        <Transition mode="out-in">
			<span v-if="!!error" ref="errorText" class="input__error" :style="{ bottom: `${(heightErrorText + 10) * -1}px` }">{{ error }}</span>
		</Transition>
    </label>
</template>
<style lang='scss' scoped>
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